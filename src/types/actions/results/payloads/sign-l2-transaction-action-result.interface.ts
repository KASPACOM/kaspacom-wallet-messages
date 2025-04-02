import { WalletActionResultType } from '../wallet-action-result-type.enum';
import { WalletActionResult } from '../wallet-action-result.interface';

export interface SignL2EtherTransactionActionResult extends WalletActionResult {
  type: WalletActionResultType.SignL2EtherTransaction;
  transactionId?: string;
  signedTransactionString: string;
  signedTransactionHash: string;
}
