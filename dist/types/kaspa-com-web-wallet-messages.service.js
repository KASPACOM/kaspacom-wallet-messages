import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ERROR_CODES, WalletMessageTypeEnum, } from 'kaspacom-wallet-messages';
@Injectable({
    providedIn: 'root',
})
export class KaspaComWebWalletMessagesService {
    onMessageWithBind;
    eventHandlers;
    iframe = undefined;
    walletInfo = undefined;
    messagesWaitingToBeResolved = {};
    constructor() {
        this.onMessageWithBind = this.onMessage.bind(this);
    }
    async onMessage(event) {
        if (event.origin === environment.kaspaComWebWalletUrl &&
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
                default:
                    console.error('Unknown message', eventData);
                    throw new Error(`Unknown message type ${eventData.type}`);
            }
        }
    }
    startListeningForMessages(eventHandlers) {
        this.eventHandlers = eventHandlers;
        window.addEventListener('message', this.onMessageWithBind);
    }
    setCurrentIframe(iframe) {
        this.iframe = iframe;
    }
    stopListeningForMessages() {
        window.removeEventListener('message', this.onMessageWithBind);
        this.eventHandlers = undefined;
        for (const key of Object.keys(this.messagesWaitingToBeResolved)) {
            const value = this.messagesWaitingToBeResolved[key];
            value.reject();
            delete this.messagesWaitingToBeResolved[key];
        }
    }
    getWalletInfo() {
        return this.walletInfo;
    }
    handleWalletInfoUpdate(data) {
        const oldWalletInfo = this.walletInfo;
        this.walletInfo = data;
        this.eventHandlers?.onWalletInfoUpdate(data, oldWalletInfo);
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
    sendWalletMessage(message) {
        if (!this.iframe || !this.iframe.contentWindow) {
            throw new Error('Wallet IFrame not exists.');
        }
        this.iframe.contentWindow.postMessage(message, environment.kaspaComWebWalletUrl);
    }
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
                    errorCode: ERROR_CODES.WALLET_ACTION.USER_REJECTED,
                    action: value.action.action,
                });
                delete this.messagesWaitingToBeResolved[key];
            }
        }
    }
}
