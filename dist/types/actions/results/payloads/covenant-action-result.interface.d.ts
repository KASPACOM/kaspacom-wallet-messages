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
export interface CovenantCompletePartialActionResult extends WalletActionResult {
    type: WalletActionResultType.CovenantCompletePartial;
    txid: string;
    functionName: string;
}
//# sourceMappingURL=covenant-action-result.interface.d.ts.map