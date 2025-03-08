import { WalletActionResultType } from '../wallet-action-result-type.enum';
import { WalletActionResult } from '../wallet-action-result.interface';
export interface ConnectionRequestActionResult extends WalletActionResult {
    type: WalletActionResultType.ConnectionRequest;
    isApproved: string;
}
//# sourceMappingURL=connection-request-action-result.interface.d.ts.map