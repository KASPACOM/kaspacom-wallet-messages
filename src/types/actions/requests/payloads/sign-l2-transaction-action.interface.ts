import { L2TransactionOptions } from "../../../l2-transaction-options.interface";

export interface SignL2TransactionActionInterface {
    transactionOptions: L2TransactionOptions;
    submitTransaction?: boolean;
    payloadPrefix?: string;
}