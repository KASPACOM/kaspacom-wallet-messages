import { WalletActionRequestPayloadInterface } from './actions/requests/wallet-action-request-payload-interface';
import { WalletActionResultPayloadInterface } from './actions/results/wallet-action-result-payload-interface';
import { RejectOperationPayloadInterface } from './payloads/reject-operation-payload.interface';
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
    [WalletMessageTypeEnum.WalletActionRequest]: WalletActionRequestPayloadInterface;
    [WalletMessageTypeEnum.WalletActionResponse]: WalletActionResultPayloadInterface;
    [WalletMessageTypeEnum.OpenWalletInfo]: undefined;
    [WalletMessageTypeEnum.RejectOperation]: RejectOperationPayloadInterface | undefined;
}
export {};
//# sourceMappingURL=wallet-message.interface.d.ts.map