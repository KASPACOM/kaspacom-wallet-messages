import { ProtocolScriptDataAndAddress } from "../../protocol-script-data-and-address.interface";
import { WalletActionTypeEnum } from "../requests/wallet-action-type.enum";
import { CommitRevealActionResult } from "./payloads/commit-reveal-action-result.interface";
import { KasTransferActionResult } from "./payloads/kas-transfer-action-result.interface";
import { SignedMessageActionResult } from "./payloads/sign-message-action-result.interface";
import { SignPsktTransactionActionResult } from "./payloads/sign-pskt-transaction-action-result.interface";
import { EIP1193ProviderRequestActionResult } from "./payloads/eip1193-provider-request-action-result.interface";
import { EIP1193RequestType } from "../../eip1193/requests/request.types";
export type WalletActionResultPayloadInterface = {
    [K in keyof WalletActionResultDataMap]: {
        action: K;
        success: true;
        data: WalletActionResultDataMap[K];
    } | {
        action: K;
        success: false;
        errorCode: number;
    };
}[keyof WalletActionResultDataMap];
interface WalletActionResultDataMap {
    [WalletActionTypeEnum.SignMessage]: SignedMessageActionResult;
    [WalletActionTypeEnum.CommitReveal]: CommitRevealActionResult;
    [WalletActionTypeEnum.KasTransfer]: KasTransferActionResult;
    [WalletActionTypeEnum.SignPsktTransaction]: SignPsktTransactionActionResult;
    [WalletActionTypeEnum.GetProtocolScriptData]: ProtocolScriptDataAndAddress;
    [WalletActionTypeEnum.EIP1193ProviderRequest]: EIP1193ProviderRequestActionResult<EIP1193RequestType>;
}
export {};
//# sourceMappingURL=wallet-action-result-payload-interface.d.ts.map