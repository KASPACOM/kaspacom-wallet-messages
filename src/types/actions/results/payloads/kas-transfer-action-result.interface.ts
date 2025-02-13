import { WalletActionResultType } from '../wallet-action-result-type.enum';
import { WalletActionResult } from '../wallet-action-result.interface';

export interface KasTransferActionResult extends WalletActionResult {
  type: WalletActionResultType.KasTransfer;
  to: string;
  amount: bigint;
  sendAll?: boolean;
  transactionId: string;
}