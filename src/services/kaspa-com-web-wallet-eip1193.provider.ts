import { ERROR_CODES } from "../consts/error-codes.consts";
import { WalletActionTypeEnum } from "../types/actions/requests/wallet-action-type.enum";
import { EIP1193ProviderRequestActionResult } from "../types/actions/results/payloads/eip1193-provider-request-action-result.interface";
import { EIP1193ProviderInterface, EIP1193RequestPayload, EIP1193RequestResults, EIP1193RequestType } from "../types/eip1193";
import { KaspaComWebWalletMessagesService } from "./kaspa-com-web-wallet-messages.service";
export class KaspaComWebWalletEip1193Provider implements EIP1193ProviderInterface {

    protected actionsThatNotRequireUserApproval: EIP1193RequestType[] = [
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

    protected actionsThatNotRequireUserApprovalByAction: {[method: string]: boolean} = {};

    protected eventListeners: {
        [key: string]: ((...args: any[]) => void)[];
    } = {};

    constructor(protected kaspaComWalletMessages: KaspaComWebWalletMessagesService) {
        this.kaspaComWalletMessages.addEventHandlers({
            onEip1193Event: (event) => {
                this.eventListeners[event.type]?.forEach(listener => listener(event.data));
            },
        });
        this.actionsThatNotRequireUserApprovalByAction = Object.fromEntries(
            this.actionsThatNotRequireUserApproval.map(action => [action, true])
        );
    }

    protected isActionReuqireUserApproval<T extends EIP1193RequestType>(args: EIP1193RequestPayload<T>): boolean {
        return !this.actionsThatNotRequireUserApprovalByAction[args.method];
    }

    async request<T extends EIP1193RequestType>(args: EIP1193RequestPayload<T>): Promise<EIP1193RequestResults[T]> {
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

        const ethResult = (result.data as EIP1193ProviderRequestActionResult<T>).eip1193Response;

        if (ethResult.error) {
            throw ethResult.error;
        }

        return ethResult.result!;
    }


    protected async openWallet() {
        // override in subclass
    }

    protected async closeWallet() {
        // override in subclass
    }

    public getKaspaComWalletMessages(): KaspaComWebWalletMessagesService {
        return this.kaspaComWalletMessages;
    }

    public on(event: string, listener: (...args: any[]) => void): this {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(listener);
        return this;
    }

    public removeListener(event: string, listener: (...args: any[]) => void): this {
        if (this.eventListeners[event]) {
            this.eventListeners[event] = this.eventListeners[event].filter(l => l !== listener);
        }
        return this;
    }
}
