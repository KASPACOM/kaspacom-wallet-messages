import { L2TransactionOptions } from "../../../l2-transaction-options.interface";

export interface SignL2EtherTransactionActionInterface {
    transactionOptions: L2TransactionOptions;
    submitTransaction?: boolean;
    payloadPrefix?: string;
    sendToL1?: boolean;
}