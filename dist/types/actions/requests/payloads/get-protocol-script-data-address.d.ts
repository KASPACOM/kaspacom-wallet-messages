import { PsktActionsEnum } from "../../../pkst-actions-enum.interface";
import { ProtocolType } from "../../../protocol-type.enum";
export interface GetProtocolScriptDataAddress {
    psktTransactionJson: string;
    submitTransaction?: boolean;
    protocol?: ProtocolType | string;
    protocolAction?: PsktActionsEnum | string;
}
//# sourceMappingURL=get-protocol-script-data-address.d.ts.map