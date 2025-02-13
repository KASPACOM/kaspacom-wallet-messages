import { WalletActionResultType } from '../wallet-action-result-type.enum';
import { WalletActionResult } from '../wallet-action-result.interface';
export interface SignPsktTransactionActionResult extends WalletActionResult {
    type: WalletActionResultType.SignPsktTransaction;
    transactionId?: string;
    psktTransactionJson: string;
}
//# sourceMappingURL=sign-pskt-transaction-action-result.interface.d.ts.map