import { EIP1193ProviderResponse, EIP1193RequestPayload, EIP1193RequestType } from "../../../eip1193";
import { WalletActionResultType } from "../wallet-action-result-type.enum";
import { WalletActionResult } from "../wallet-action-result.interface";


export interface EIP1193ProviderRequestActionResult<T extends EIP1193RequestType> extends WalletActionResult {
    type: WalletActionResultType.EIP1193ProviderRequest;
    requestData: EIP1193RequestPayload<T>;
    eip1193Response: EIP1193ProviderResponse<T>;
} 