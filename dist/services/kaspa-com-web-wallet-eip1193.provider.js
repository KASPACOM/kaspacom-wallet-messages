import { ERROR_CODES } from "../consts/error-codes.consts";
import { WalletActionTypeEnum } from "../types/actions/requests/wallet-action-type.enum";
export class KaspaComWebWalletEip1193Provider {
    kaspaComWalletMessages;
    eventListeners = {};
    constructor(kaspaComWalletMessages) {
        this.kaspaComWalletMessages = kaspaComWalletMessages;
        this.kaspaComWalletMessages.addEventHandlers({
            onEip1193Event: (event) => {
                this.eventListeners[event.type]?.forEach(listener => listener(event.data));
            },
        });
    }
    async request(args) {
        await this.openWallet();
        const result = await this.kaspaComWalletMessages.sendWalletActionAndWaitForResponse({
            action: WalletActionTypeEnum.EIP1193ProviderRequest,
            data: args,
        });
        await this.closeWallet();
        if (!result.success) {
            throw {
                message: "Error from kaspa-com-web-wallet-messages: " + result.errorCode,
                code: ERROR_CODES.EIP1193.INTERNAL_ERROR,
            };
        }
        const ethResult = result.data.result;
        if (ethResult.error) {
            throw ethResult.error;
        }
        return ethResult.result;
    }
    async openWallet() {
        // override in subclass
    }
    async closeWallet() {
        // override in subclass
    }
    getKaspaComWalletMessages() {
        return this.kaspaComWalletMessages;
    }
    on(event, listener) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(listener);
        return this;
    }
    removeListener(event, listener) {
        if (this.eventListeners[event]) {
            this.eventListeners[event] = this.eventListeners[event].filter(l => l !== listener);
        }
        return this;
    }
}
