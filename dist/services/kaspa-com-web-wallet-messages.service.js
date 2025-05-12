import { ERROR_CODES } from "../consts/error-codes.consts";
import { WalletMessageTypeEnum } from "../types/wallet-message-type.enum";
/**
 * Service for handling communication with the Kaspa.com Web Wallet through an iframe.
 * This service manages the message passing between your application and the wallet iframe,
 * handling wallet connection, actions, and responses.
 *
 * @example
 * ```typescript
 * // Initialize the service with the wallet URL
 * const walletMessagesService = new KaspaComWebWalletMessagesService('https://wallet.kaspa.com');
 *
 * // Start connection and wait for wallet selection
 * const iframe = document.getElementById('wallet-iframe') as HTMLIFrameElement;
 * const walletInfo = await walletMessagesService.startConnectionAndWaitForWalletSelection(iframe, {
 *   onWalletInfoUpdate: (newInfo, oldInfo) => {
 *     // Handle wallet info updates
 *     console.log('Wallet info updated:', newInfo);
 *   }
 * });
 *
 * // Send a wallet action and wait for response
 * const result = await walletMessagesService.sendWalletActionAndWaitForResponse({
 *   action: WalletActionTypeEnum.KasTransfer,
 *   data: {
 *     amount: 1.5,
 *     to: 'kaspa:...'
 *   }
 * });
 * ```
 */
export class KaspaComWebWalletMessagesService {
    walletUrl;
    onMessageWithBind;
    eventHandlers = [];
    iframe = undefined;
    waitForWalletToConnectPromise = undefined;
    waitForWalletToConnectResolve = undefined;
    waitForWalletToConnectReject = undefined;
    isFirstEventEmitted = false;
    walletInfo = undefined;
    messagesWaitingToBeResolved = {};
    /**
     * Creates a new instance of the KaspaComWebWalletMessagesService.
     * @param walletUrl - The URL of the Kaspa.com Web Wallet iframe
     */
    constructor(walletUrl) {
        this.walletUrl = walletUrl;
        this.onMessageWithBind = this.onMessage.bind(this);
    }
    /**
     * Starts the connection with the wallet iframe and waits for wallet selection.
     * This method should be called after the iframe is loaded and ready.
     *
     * @param iframe - The HTML iframe element containing the wallet
     * @param eventHandlers - Event handlers for wallet events
     * @returns Promise that resolves with the wallet info when connected
     *
     * @example
     * ```typescript
     * const iframe = document.getElementById('wallet-iframe') as HTMLIFrameElement;
     * const walletInfo = await walletMessagesService.startConnectionAndWaitForWalletSelection(iframe, {
     *   onWalletInfoUpdate: (newInfo, oldInfo) => {
     *     // Handle wallet info updates
     *   }
     * });
     * ```
     */
    async startConnectionAndWaitForWalletSelection(iframe, eventHandlers) {
        this.iframe = iframe;
        this.waitForWalletToConnectPromise = new Promise((resolve, reject) => {
            this.waitForWalletToConnectResolve = resolve;
            this.waitForWalletToConnectReject = reject;
        });
        this.startListeningForMessages(eventHandlers);
        return this.waitForWalletToConnectPromise;
    }
    /**
     * Disconnects from the wallet and cleans up event listeners.
     * Should be called when the wallet connection is no longer needed.
     */
    async disconnect() {
        this.stopListeningForMessages();
        if (this.waitForWalletToConnectPromise) {
            this.waitForWalletToConnectReject?.();
        }
    }
    async onMessage(event) {
        if (event.origin === this.walletUrl &&
            event.data &&
            event.data?.type) {
            const eventData = event.data;
            // Handle responses from requests
            if (eventData.uuid) {
                if (eventData.type === WalletMessageTypeEnum.WalletActionResponse) {
                    await this.handleRequestResponse(eventData);
                    return;
                }
                if (eventData.type === WalletMessageTypeEnum.WalletActionApproved) {
                    if (this.messagesWaitingToBeResolved[eventData.uuid]) {
                        this.messagesWaitingToBeResolved[eventData.uuid].isApprovedByUser = true;
                    }
                    return;
                }
            }
            // Handle events like wallet connected, disconnected, changed, balance changed and more
            switch (eventData.type) {
                case WalletMessageTypeEnum.WalletInfo:
                    this.handleWalletInfoUpdate(eventData.payload);
                    break;
                case WalletMessageTypeEnum.EIP1193Event:
                    this.eventHandlers.forEach(handler => handler.onEip1193Event?.(eventData.payload));
                    break;
                default:
                    console.error('Unknown message', eventData);
                    throw new Error(`Unknown message type ${eventData.type}`);
            }
        }
    }
    startListeningForMessages(eventHandlers) {
        this.eventHandlers.push(eventHandlers);
        window.addEventListener('message', this.onMessageWithBind);
    }
    stopListeningForMessages() {
        window.removeEventListener('message', this.onMessageWithBind);
        this.eventHandlers = [];
        for (const key of Object.keys(this.messagesWaitingToBeResolved)) {
            const value = this.messagesWaitingToBeResolved[key];
            value.reject();
            delete this.messagesWaitingToBeResolved[key];
        }
    }
    /**
     * Gets the current wallet information.
     * @returns The current wallet info or undefined if not connected
     */
    getWalletInfo() {
        return this.walletInfo;
    }
    handleWalletInfoUpdate(data) {
        const oldWalletInfo = this.walletInfo;
        if (data && this.waitForWalletToConnectPromise &&
            this.waitForWalletToConnectResolve &&
            data.walletAddress) {
            this.isFirstEventEmitted = true;
            this.waitForWalletToConnectResolve(data);
            this.waitForWalletToConnectPromise = undefined;
            this.waitForWalletToConnectResolve = undefined;
            this.waitForWalletToConnectReject = undefined;
        }
        this.walletInfo = data;
        this.eventHandlers.forEach(handler => handler.onWalletInfoUpdate?.(data, oldWalletInfo));
    }
    handleRequestResponse(data) {
        const defferObject = this.messagesWaitingToBeResolved[data.uuid];
        if (!defferObject) {
            console.warn(`Message with uuid ${data.uuid} not found in messagesWaitingToBeResolved`);
            return;
        }
        const payload = data.payload;
        defferObject.resolve(payload);
        delete this.messagesWaitingToBeResolved[data.uuid];
    }
    /**
     * Sends a message to the wallet iframe.
     * @param message - The message to send to the wallet
     * @throws Error if the wallet iframe doesn't exist
     */
    sendWalletMessage(message) {
        if (!this.iframe || !this.iframe.contentWindow) {
            throw new Error('Wallet IFrame not exists.');
        }
        this.iframe.contentWindow.postMessage(message, this.walletUrl);
    }
    /**
     * Sends a wallet action and waits for the response.
     * This is the main method for interacting with the wallet.
     *
     * @param action - The wallet action to perform
     * @returns Promise that resolves with the action result
     *
     * @example
     * ```typescript
     * // Send KAS
     * const result = await walletMessagesService.sendWalletActionAndWaitForResponse({
     *   action: WalletActionTypeEnum.KasTransfer,
     *   data: {
     *     amount: 1.5,
     *     to: 'kaspa:...'
     *   }
     * });
     *
     * // Sign a message
     * const signResult = await walletMessagesService.sendWalletActionAndWaitForResponse({
     *   action: WalletActionTypeEnum.SignMessage,
     *   data: {
     *     message: 'Hello, Kaspa!'
     *   }
     * });
     * ```
     */
    async sendWalletActionAndWaitForResponse(action) {
        if (!this.iframe || !this.iframe.contentWindow) {
            throw new Error('Wallet IFrame not exists.');
        }
        const uuid = crypto.randomUUID();
        const defferObject = { action };
        defferObject.promise = new Promise((resolve, reject) => {
            defferObject.resolve = resolve;
            defferObject.reject = reject;
        });
        this.messagesWaitingToBeResolved[uuid] = defferObject;
        this.sendWalletMessage({
            type: WalletMessageTypeEnum.WalletActionRequest,
            uuid,
            payload: action,
        });
        return await defferObject.promise;
    }
    /**
     * Handles wallet closure by rejecting pending actions.
     * Should be called when the wallet iframe is closed.
     */
    async walletClosed() {
        if (this.messagesWaitingToBeResolved) {
            for (const key of Object.keys(this.messagesWaitingToBeResolved)) {
                if (this.messagesWaitingToBeResolved[key].isApprovedByUser) {
                    continue;
                }
                this.sendWalletMessage({
                    type: WalletMessageTypeEnum.RejectWalletActionRequest,
                    payload: {
                        actionUuid: key,
                    }
                });
                const value = this.messagesWaitingToBeResolved[key];
                value.resolve({
                    success: false,
                    errorCode: ERROR_CODES.EIP1193.USER_REJECTED,
                    action: value.action.action,
                });
                delete this.messagesWaitingToBeResolved[key];
            }
        }
    }
    isUserSelectedWallet() {
        return this.isFirstEventEmitted;
    }
    addEventHandlers(eventHandlers) {
        this.eventHandlers.push(eventHandlers);
    }
    removeEventHandlers(eventHandlers) {
        this.eventHandlers = this.eventHandlers.filter(handler => handler !== eventHandlers);
    }
}
