import { CommitRevealActionInterface } from './payloads/commit-reveal-action.interface';
import { SignMessageActionInterface } from './payloads/sign-message-action.interface';
import { TransferKasAction } from './payloads/kas-transfer-action.interface';
import { WalletActionTypeEnum } from './wallet-action-type.enum';
import { SignPsktTransactionActionInterface } from './payloads/sign-pskt-transaction-action.interface';
import { ProtocolScript } from '../../protocol-script.interface';
import { EIP1193RequestPayload } from '../../eip1193';

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
  [WalletActionTypeEnum.EIP1193ProviderRequest]: EIP1193RequestPayload<any>;
}
