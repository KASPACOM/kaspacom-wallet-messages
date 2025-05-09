import { EIP1193ProviderInterface, EIP1193RequestPayload, EIP1193RequestResults, EIP1193RequestType } from "../types/eip1193";
import { KaspaComWebWalletMessagesService } from "./kaspa-com-web-wallet-messages.service";
export declare class KaspaComWebWalletEip1193Provider implements EIP1193ProviderInterface {
    protected kaspaComWalletMessages: KaspaComWebWalletMessagesService;
    constructor(kaspaComWalletMessages: KaspaComWebWalletMessagesService);
    request<T extends EIP1193RequestType>(args: EIP1193RequestPayload<T>): Promise<EIP1193RequestResults[T]>;
    protected openWallet(): Promise<void>;
    protected closeWallet(): Promise<void>;
}
//# sourceMappingURL=eip1193.provider.d.ts.map