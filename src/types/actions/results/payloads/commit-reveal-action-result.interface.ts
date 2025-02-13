import { WalletActionResultType } from '../wallet-action-result-type.enum';
import { WalletActionResult } from '../wallet-action-result.interface';

export interface CommitRevealActionResult extends WalletActionResult {
  type: WalletActionResultType.CommitReveal;
  commitTransactionId: string;
  revealTransactionId: string;
  protocol: string;
  protocolAction: string;
  revealPsktJson?: string;
}
