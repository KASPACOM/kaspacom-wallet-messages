import { WalletActionResultType } from '../wallet-action-result-type.enum';
import { WalletActionResult } from '../wallet-action-result.interface';
export interface SignL2TransactionActionResult extends WalletActionResult {
    type: WalletActionResultType.SignL2Transaction;
    transactionId?: string;
    signedTransaction: string;
}
//# sourceMappingURL=sign-l2-transaction-action-result.interface.d.ts.map