import { WalletActionResultType } from '../wallet-action-result-type.enum';
import { WalletActionResult } from '../wallet-action-result.interface';
import { CovenantOutpoint } from '../../requests/payloads/covenant-action.interface';

export interface CovenantDeployActionResult extends WalletActionResult {
  type: WalletActionResultType.CovenantDeploy;
  txid: string;
  contractAddress: string;
  outpoint: CovenantOutpoint;
  covenantId?: string;
}

export interface CovenantSpendActionResult extends WalletActionResult {
  type: WalletActionResultType.CovenantSpend;
  txid: string;
  functionName: string;
  covenantId?: string;
}
