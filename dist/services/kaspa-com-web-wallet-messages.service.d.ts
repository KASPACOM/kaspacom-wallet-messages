import { WalletActionRequestPayloadInterface } from "../types/actions/requests/wallet-action-request-payload-interface";
import { WalletActionResultPayloadInterface } from "../types/actions/results/wallet-action-result-payload-interface";
import { KaspaComWebWalletMessagesEventHandlers } from "../types/event-handlers.interface";
import { WalletInfoPayloadInterface } from "../types/payloads/wallet-info-payload.interface";
import { WalletMessageInterface } from "../types/wallet-message.interface";
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
export declare class KaspaComWebWalletMessagesService {
    protected walletUrl: string;
    private onMessageWithBind;
    private eventHandlers;
    private iframe;
    private waitForWalletToConnectPromise;
    private waitForWalletToConnectResolve;
    private waitForWalletToConnectReject;
    protected isFirstEventEmitted: boolean;
    private walletInfo;
    private messagesWaitingToBeResolved;
    /**
     * Creates a new instance of the KaspaComWebWalletMessagesService.
     * @param walletUrl - The URL of the Kaspa.com Web Wallet iframe
     */
    constructor(walletUrl: string);
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
    startConnectionAndWaitForWalletSelection(iframe: HTMLIFrameElement, eventHandlers: KaspaComWebWalletMessagesEventHandlers): Promise<WalletInfoPayloadInterface>;
    /**
     * Disconnects from the wallet and cleans up event listeners.
     * Should be called when the wallet connection is no longer needed.
     */
    disconnect(): Promise<void>;
    private onMessage;
    private startListeningForMessages;
    private stopListeningForMessages;
    /**
     * Gets the current wallet information.
     * @returns The current wallet info or undefined if not connected
     */
    getWalletInfo(): WalletInfoPayloadInterface | undefined;
    private handleWalletInfoUpdate;
    private handleRequestResponse;
    /**
     * Sends a message to the wallet iframe.
     * @param message - The message to send to the wallet
     * @throws Error if the wallet iframe doesn't exist
     */
    sendWalletMessage(message: WalletMessageInterface): void;
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
    sendWalletActionAndWaitForResponse(action: WalletActionRequestPayloadInterface): Promise<WalletActionResultPayloadInterface>;
    /**
     * Handles wallet closure by rejecting pending actions.
     * Should be called when the wallet iframe is closed.
     */
    walletClosed(): Promise<void>;
    isUserSelectedWallet(): boolean;
    addEventHandlers(eventHandlers: KaspaComWebWalletMessagesEventHandlers): void;
    removeEventHandlers(eventHandlers: KaspaComWebWalletMessagesEventHandlers): void;
}
//# sourceMappingURL=kaspa-com-web-wallet-messages.service.d.ts.map