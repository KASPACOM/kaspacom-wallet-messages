import { ERROR_CODES } from "../consts/error-codes.consts";
import { WalletActionTypeEnum } from "../types/actions/requests/wallet-action-type.enum";
import { EIP1193RequestType } from "../types/eip1193";
export class KaspaComWebWalletEip1193Provider {
    kaspaComWalletMessages;
    actionsThatNotRequireUserApproval = [
        EIP1193RequestType.GET_ACCOUNTS,
        EIP1193RequestType.GET_BALANCE,
        EIP1193RequestType.GET_CHAIN_ID,
        EIP1193RequestType.GET_BLOCK_BY_HASH,
        EIP1193RequestType.GET_BLOCK_BY_NUMBER,
        EIP1193RequestType.GET_CODE,
        EIP1193RequestType.GET_ESTIMATE_GAS,
        EIP1193RequestType.GET_GAS_PRICE,
        EIP1193RequestType.GET_LOGS,
        EIP1193RequestType.ETH_CALL,
        EIP1193RequestType.GET_NETWORK_VERSION,
        EIP1193RequestType.GET_TRANSACTION_BY_HASH,
        EIP1193RequestType.GET_TRANSACTION_COUNT,
        EIP1193RequestType.GET_TRANSACTION_RECEIPT,
    ];
    actionsThatNotRequireUserApprovalByAction = {};
    eventListeners = {};
    constructor(kaspaComWalletMessages) {
        this.kaspaComWalletMessages = kaspaComWalletMessages;
        this.kaspaComWalletMessages.addEventHandlers({
            onEip1193Event: (event) => {
                this.eventListeners[event.type]?.forEach(listener => listener(event.data));
            },
        });
        this.actionsThatNotRequireUserApprovalByAction = Object.fromEntries(this.actionsThatNotRequireUserApproval.map(action => [action, true]));
    }
    isActionReuqireUserApproval(args) {
        return !this.actionsThatNotRequireUserApprovalByAction[args.method];
    }
    async request(args) {
        const isActionReuqireUserApproval = this.isActionReuqireUserApproval(args);
        if (isActionReuqireUserApproval) {
            await this.openWallet();
        }
        const result = await this.kaspaComWalletMessages.sendWalletActionAndWaitForResponse({
            action: WalletActionTypeEnum.EIP1193ProviderRequest,
            data: args,
        });
        if (isActionReuqireUserApproval) {
            await this.closeWallet();
        }
        if (!result.success) {
            throw {
                message: "Error from kaspa-com-web-wallet-messages: " + result.errorCode,
                code: ERROR_CODES.EIP1193.INTERNAL_ERROR,
            };
        }
        const ethResult = result.data.eip1193Response;
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
