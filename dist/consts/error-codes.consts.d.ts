export declare const ERROR_CODES: {
    GENERAL: {
        UNKNOWN_ERROR: number;
    };
    WALLET_ACTION: {
        WALLET_NOT_SELECTED: number;
        INVALID_ACTION_TYPE: number;
        INVALID_AMOUNT: number;
        INVALID_ADDRESS: number;
        INSUFFICIENT_BALANCE: number;
        TICKER_NOT_FOUND: number;
        TOKEN_NOT_IN_MINTABLE_STATE: number;
        NO_UTXOS_TO_COMPOUND: number;
        REVEAL_WITH_NO_COMMIT_ACTION: number;
        REVEAL_TRANSACTION_NOT_FOUND: number;
        INVALID_PSKT_TX: number;
        SEND_TRANSACTION_ALREADY_SPENT: number;
        KASPLEX_API_ERROR: number;
        INVALID_DEPLOY_DATA: number;
        INVALID_TICKER: number;
        TOKEN_NAME_IS_NOT_AVAILABLE_TO_DEPLOY: number;
        INVALID_MESSAGE_TO_SIGN: number;
        INVALID_COMMIT_REVEAL_DATA: number;
    };
    EIP1193: {
        USER_REJECTED: number;
        UNAUTHORIZED: number;
        UNSUPPORTED_METHOD: number;
        DISCONNECTED: number;
        CHAIN_DISCONNECTED: number;
        CHAIN_NOT_ADDED: number;
        INVALID_PARAMETERS: number;
        METHOD_NOT_FOUND: number;
        INTERNAL_ERROR: number;
    };
};
export declare const ERROR_CODES_MESSAGES: {
    [x: number]: string;
};
//# sourceMappingURL=error-codes.consts.d.ts.map