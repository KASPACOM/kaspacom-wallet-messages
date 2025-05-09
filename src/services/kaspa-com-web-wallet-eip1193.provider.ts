import { ERROR_CODES } from "../consts/error-codes.consts";
import { WalletActionTypeEnum } from "../types/actions/requests/wallet-action-type.enum";
import { EIP1193ProviderRequestActionResult } from "../types/actions/results/payloads/eip1193-provider-request-action-result.interface";
import { EIP1193ProviderInterface, EIP1193RequestPayload, EIP1193RequestResults, EIP1193RequestType } from "../types/eip1193";
import { KaspaComWebWalletMessagesService } from "./kaspa-com-web-wallet-messages.service";
export class KaspaComWebWalletEip1193Provider implements EIP1193ProviderInterface {

    protected eventListeners: {
        [key: string]: ((...args: any[]) => void)[];
    } = {};

    constructor(protected kaspaComWalletMessages: KaspaComWebWalletMessagesService) {
        this.kaspaComWalletMessages.addEventHandlers({
            onEip1193Event: (event) => {
                this.eventListeners[event.type]?.forEach(listener => listener(event.data));
            },
        });
    }

    async request<T extends EIP1193RequestType>(args: EIP1193RequestPayload<T>): Promise<EIP1193RequestResults[T]> {
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

        const ethResult = (result.data as EIP1193ProviderRequestActionResult<T>).result;

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
