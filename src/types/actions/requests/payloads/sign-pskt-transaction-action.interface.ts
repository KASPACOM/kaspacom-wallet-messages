import { PsktActionsEnum } from "../../../pkst-actions-enum.interface";
import { ProtocolType } from "../../../protocol-type.enum";

export interface SignPsktTransactionActionInterface {
    psktTransactionJson: string;
    submitTransaction?: boolean;
    protocol?: ProtocolType | string;
    protocolAction?: PsktActionsEnum | string;  
}