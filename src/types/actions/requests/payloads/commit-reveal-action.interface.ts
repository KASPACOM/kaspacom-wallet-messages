import { ProtocolScriptDataAndAddress } from "../../../protocol-script-data-and-address.interface";

export interface CommitRevealActionInterface {
    actionScript: { type: string; stringifyAction: string; },
    options?: {
        priorityFee?: number; revealPriorityFee?: number;
        additionalOutputs?: { address: string; amount: number; }[];
        commitTransactionId?: string;
        revealPskt?: {
          outputs?: {
            address: string;
            amount: number;
          }[];
          script: ProtocolScriptDataAndAddress,
        }    
    }
}