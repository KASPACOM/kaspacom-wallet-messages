import { EIP1193ProviderResponse, EIP1193RequestType } from "../../../eip1193";
import { WalletActionResultType } from "../wallet-action-result-type.enum";
import { WalletActionResult } from "../wallet-action-result.interface";
export interface EIP1193ProviderRequestActionResult<T extends EIP1193RequestType> extends WalletActionResult {
    type: WalletActionResultType.EIP1193ProviderRequest;
    result: EIP1193ProviderResponse<T>;
}
//# sourceMappingURL=eip1193-provider-request-action-result.interface.d.ts.map