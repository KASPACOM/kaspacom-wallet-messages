import { CommitRevealActionInterface } from './payloads/commit-reveal-action.interface';
import { SignMessageActionInterface } from './payloads/sign-message-action.interface';
import { TransferKasAction } from './payloads/kas-transfer-action.interface';
import { WalletActionTypeEnum } from './wallet-action-type.enum';
import { SignPsktTransactionActionInterface } from './payloads/sign-pskt-transaction-action.interface';
import { ProtocolScript } from '../../protocol-script.interface';
import { ConnectAppActionInterface } from './payloads/connect-app-action.interface';

export type WalletActionRequestPayloadInterface = {
  [K in keyof WalletActionsDataMap]: {
    action: K;
    data: WalletActionsDataMap[K];
  };
}[keyof WalletActionsDataMap];

interface WalletActionsDataMap {
  [WalletActionTypeEnum.CommitReveal]: CommitRevealActionInterface;
  [WalletActionTypeEnum.SignMessage]: SignMessageActionInterface;
  [WalletActionTypeEnum.KasTransfer]: TransferKasAction;
  [WalletActionTypeEnum.SignPsktTransaction]: SignPsktTransactionActionInterface;
  [WalletActionTypeEnum.GetProtocolScriptData]: ProtocolScript;
  [WalletActionTypeEnum.ConnectApp]: ConnectAppActionInterface;
}
