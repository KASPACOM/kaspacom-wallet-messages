import { WalletInfoPayloadInterface } from "./payloads/wallet-info-payload.interface";

export interface KaspaComWebWalletMessagesEventHandlers {
    onWalletInfoUpdate: (walletInfo: WalletInfoPayloadInterface | undefined, oldWalletInfo: WalletInfoPayloadInterface | undefined) => void;
}