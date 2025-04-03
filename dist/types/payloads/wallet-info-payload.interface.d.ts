import { WalletBalance } from "./wallet-balance.interface";
export interface WalletInfoPayloadInterface {
    walletAddress: string;
    balance: WalletBalance | null;
    kasplexL2Address?: string | null;
}
//# sourceMappingURL=wallet-info-payload.interface.d.ts.map