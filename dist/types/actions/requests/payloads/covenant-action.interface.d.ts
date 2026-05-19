export interface CovenantOutpoint {
    txid: string;
    vout: number;
}
export interface CovenantSpendOutput {
    address: string;
    amountSompi: string;
}
export interface CovenantDeployActionInterface {
    compiledContractJson: string;
    amountSompi: string;
}
export interface CovenantSpendActionInterface {
    compiledContractJson: string;
    outpoint: CovenantOutpoint;
    inputAmountSompi: string;
    functionName: string;
    outputs: CovenantSpendOutput[];
    extraArgs?: Record<string, string>;
    covenantId?: string;
    priorityFeeSompi?: string;
    useSenderFee?: boolean;
}
//# sourceMappingURL=covenant-action.interface.d.ts.map