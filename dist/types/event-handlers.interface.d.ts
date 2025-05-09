import { WalletInfoPayloadInterface } from "./payloads/wallet-info-payload.interface";
import { EIP1193KaspaComWalletProviderEvent } from "./eip1193";
export interface KaspaComWebWalletMessagesEventHandlers {
    onWalletInfoUpdate?: (walletInfo: WalletInfoPayloadInterface | undefined, oldWalletInfo: WalletInfoPayloadInterface | undefined) => void;
    onEip1193Event?: (event: EIP1193KaspaComWalletProviderEvent) => void;
}
//# sourceMappingURL=event-handlers.interface.d.ts.map