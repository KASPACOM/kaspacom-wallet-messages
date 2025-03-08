import { WalletActionResultType } from '../wallet-action-result-type.enum';
import { WalletActionResult } from '../wallet-action-result.interface';
export interface ConnectAppActionResult extends WalletActionResult {
    type: WalletActionResultType.ConnectApp;
    isApproved: boolean;
}
//# sourceMappingURL=connect-app-action-result.interface.d.ts.map