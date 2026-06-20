import { PsktActionsEnum } from '../../../pkst-actions-enum.interface';
import { ProtocolType } from '../../../protocol-type.enum';

export enum WalletPsktSighashTypeEnum {
  All = 0,
  None = 1,
  Single = 2,
  AllAnyOneCanPay = 3,
  NoneAnyOneCanPay = 4,
  SingleAnyOneCanPay = 5,
}

export interface WalletPsktSignInput {
  index: number;
  sighashType?: WalletPsktSighashTypeEnum;
}

export interface SignPsktTransactionActionInterface {
  psktTransactionJson: string;
  signOnly?: boolean; // Don't add inputs & change
  signInputs?: WalletPsktSignInput[];
  submitTransaction?: boolean;
  protocol?: ProtocolType | string;
  protocolAction?: PsktActionsEnum | string;
}
