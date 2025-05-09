import { WalletActionRequestPayloadInterface } from './actions/requests/wallet-action-request-payload-interface';
import { WalletActionResultPayloadInterface } from './actions/results/wallet-action-result-payload-interface';
import { EIP1193KaspaComWalletProviderEvent } from './eip1193';
import { RejectWalletActionRequestPayloadInterface } from './payloads/reject-wallet-action-request-payload.interface';
import { WalletInfoPayloadInterface } from './payloads/wallet-info-payload.interface';
import { WalletMessageTypeEnum } from './wallet-message-type.enum';
export type WalletMessageInterface = {
    [K in keyof WalletMessagePayloadMap]: {
        type: K;
        payload: WalletMessagePayloadMap[K];
        uuid?: string;
    };
}[keyof WalletMessagePayloadMap];
interface WalletMessagePayloadMap {
    [WalletMessageTypeEnum.WalletInfo]: WalletInfoPayloadInterface | undefined;
    [WalletMessageTypeEnum.EIP1193Event]: EIP1193KaspaComWalletProviderEvent;
    [WalletMessageTypeEnum.WalletActionRequest]: WalletActionRequestPayloadInterface;
    [WalletMessageTypeEnum.WalletActionApproved]: WalletActionRequestPayloadInterface;
    [WalletMessageTypeEnum.WalletActionResponse]: WalletActionResultPayloadInterface;
    [WalletMessageTypeEnum.OpenWalletInfo]: undefined;
    [WalletMessageTypeEnum.RejectWalletActionRequest]: RejectWalletActionRequestPayloadInterface | undefined;
}
export {};
//# sourceMappingURL=wallet-message.interface.d.ts.map