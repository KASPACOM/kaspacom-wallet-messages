export interface EIP1193Provider {
    request<T extends EIP1193RequestType>(args: EIP1193RequestPayload<T>): Promise<EIP1193RequestResults[T]>;
    on?(event: string, listener: (...args: any[]) => void): this;
    removeListener?(event: string, listener: (...args: any[]) => void): this;
}
export type EIP1193ProviderEvent = 'connect' | 'disconnect' | 'chainChanged' | 'accountsChanged' | 'message';
export interface EIP1193ProviderConnectInfo {
    chainId: string;
}
export interface EIP1193ProviderRpcError extends Error {
    message: string;
    code: number;
    data?: unknown;
}
export interface EIP1193ProviderMessage {
    type: string;
    data: unknown;
}
export interface EIP1193ProviderChain {
    chainId: string;
    chainName: string;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    rpcUrls: string[];
    blockExplorerUrls: string[];
}
export interface EIP1193ProviderResponse<T extends EIP1193RequestType> {
    jsonrpc: '2.0';
    id: number;
    result?: EIP1193RequestResults[T];
    error?: {
        code: number;
        message: string;
    };
}
export declare enum EIP1193RequestType {
    REQUEST_ACCOUNTS = "eth_requestAccounts",
    GET_BALANCE = "eth_getBalance",
    SIGN = "eth_sign",
    SEND_TRANSACTION = "eth_sendTransaction",
    GET_CHAIN_ID = "eth_chainId",
    GET_NETWORK_VERSION = "net_version",
    GET_GAS_PRICE = "eth_gasPrice",
    GET_ACCOUNTS = "eth_accounts",
    GET_BLOCK_NUMBER = "eth_blockNumber",
    GET_CODE = "eth_getCode",
    GET_ESTIMATE_GAS = "eth_estimateGas",
    GET_TRANSACTION_COUNT = "eth_getTransactionCount",
    GET_TRANSACTION_RECEIPT = "eth_getTransactionReceipt",
    GET_TRANSACTION_BY_HASH = "eth_getTransactionByHash",
    GET_BLOCK_BY_NUMBER = "eth_getBlockByNumber",
    GET_BLOCK_BY_HASH = "eth_getBlockByHash",
    GET_LOGS = "eth_getLogs",
    PERSONAL_SIGN = "personal_sign",
    SIGN_TYPED_DATA = "eth_signTypedData",
    SIGN_TYPED_DATA_V4 = "eth_signTypedData_v4",
    WALLET_ADD_ETHEREUM_CHAIN = "wallet_addEthereumChain",
    WALLET_SWITCH_ETHEREUM_CHAIN = "wallet_switchEthereumChain",
    WALLET_WATCH_ASSET = "wallet_watchAsset"
}
export interface EIP1193RequestParams {
    [EIP1193RequestType.REQUEST_ACCOUNTS]: [];
    [EIP1193RequestType.GET_BALANCE]: [string, string];
    [EIP1193RequestType.SIGN]: [string, string];
    [EIP1193RequestType.SEND_TRANSACTION]: [
        {
            from: string;
            to: string;
            value: string;
            data?: string;
            gas?: string;
            gasPrice?: string;
            nonce?: string;
        }
    ];
    [EIP1193RequestType.GET_CHAIN_ID]: [];
    [EIP1193RequestType.GET_NETWORK_VERSION]: [];
    [EIP1193RequestType.GET_GAS_PRICE]: [];
    [EIP1193RequestType.GET_ACCOUNTS]: [];
    [EIP1193RequestType.GET_BLOCK_NUMBER]: [];
    [EIP1193RequestType.GET_CODE]: [string, string];
    [EIP1193RequestType.GET_ESTIMATE_GAS]: [
        {
            from: string;
            to: string;
            value?: string;
            data?: string;
        }
    ];
    [EIP1193RequestType.GET_TRANSACTION_COUNT]: [string, string];
    [EIP1193RequestType.GET_TRANSACTION_RECEIPT]: [string];
    [EIP1193RequestType.GET_TRANSACTION_BY_HASH]: [string];
    [EIP1193RequestType.GET_BLOCK_BY_NUMBER]: [string, boolean];
    [EIP1193RequestType.GET_BLOCK_BY_HASH]: [string, boolean];
    [EIP1193RequestType.GET_LOGS]: [
        {
            fromBlock?: string;
            toBlock?: string;
            address?: string | string[];
            topics?: (string | string[])[];
            blockhash?: string;
        }
    ];
    [EIP1193RequestType.PERSONAL_SIGN]: [string, string];
    [EIP1193RequestType.SIGN_TYPED_DATA]: [string, string];
    [EIP1193RequestType.SIGN_TYPED_DATA_V4]: [string, string];
    [EIP1193RequestType.WALLET_ADD_ETHEREUM_CHAIN]: [
        {
            chainId: string;
            chainName: string;
            nativeCurrency: {
                name: string;
                symbol: string;
                decimals: number;
            };
            rpcUrls: string[];
            blockExplorerUrls?: string[];
        }
    ];
    [EIP1193RequestType.WALLET_SWITCH_ETHEREUM_CHAIN]: [{
        chainId: string;
    }];
    [EIP1193RequestType.WALLET_WATCH_ASSET]: [
        {
            type: string;
            options: {
                address: string;
                symbol: string;
                decimals: number;
                image?: string;
            };
        }
    ];
}
export interface EIP1193RequestPayload<T extends EIP1193RequestType> {
    method: T;
    params: EIP1193RequestParams[T];
}
export interface EIP1193RequestResults {
    [EIP1193RequestType.REQUEST_ACCOUNTS]: string[];
    [EIP1193RequestType.GET_BALANCE]: string;
    [EIP1193RequestType.SIGN]: string;
    [EIP1193RequestType.SEND_TRANSACTION]: string;
    [EIP1193RequestType.GET_CHAIN_ID]: string;
    [EIP1193RequestType.GET_NETWORK_VERSION]: string;
    [EIP1193RequestType.GET_GAS_PRICE]: string;
    [EIP1193RequestType.GET_ACCOUNTS]: string[];
    [EIP1193RequestType.GET_BLOCK_NUMBER]: string;
    [EIP1193RequestType.GET_CODE]: string;
    [EIP1193RequestType.GET_ESTIMATE_GAS]: string;
    [EIP1193RequestType.GET_TRANSACTION_COUNT]: string;
    [EIP1193RequestType.GET_TRANSACTION_RECEIPT]: {
        transactionHash: string;
        transactionIndex: string;
        blockNumber: string;
        blockHash: string;
        from: string;
        to: string;
        cumulativeGasUsed: string;
        gasUsed: string;
        contractAddress: string | null;
        logs: Array<{
            address: string;
            topics: string[];
            data: string;
            blockNumber: string;
            transactionHash: string;
            logIndex: string;
            blockHash: string;
        }>;
        status: string;
    } | null;
    [EIP1193RequestType.GET_TRANSACTION_BY_HASH]: {
        hash: string;
        nonce: string;
        blockHash: string;
        blockNumber: string;
        transactionIndex: string;
        from: string;
        to: string;
        value: string;
        gas: string;
        gasPrice: string;
        input: string;
    } | null;
    [EIP1193RequestType.GET_BLOCK_BY_NUMBER]: {
        number: string;
        hash: string;
        parentHash: string;
        nonce: string;
        sha3Uncles: string;
        logsBloom: string;
        transactionsRoot: string;
        stateRoot: string;
        receiptsRoot: string;
        miner: string;
        difficulty: string;
        totalDifficulty: string;
        size: string;
        extraData: string;
        gasLimit: string;
        gasUsed: string;
        timestamp: string;
        transactions: string[] | Array<{
            hash: string;
            nonce: string;
            blockHash: string;
            blockNumber: string;
            transactionIndex: string;
            from: string;
            to: string;
            value: string;
            gas: string;
            gasPrice: string;
            input: string;
        }>;
        uncles: string[];
    } | null;
    [EIP1193RequestType.GET_BLOCK_BY_HASH]: {
        number: string;
        hash: string;
        parentHash: string;
        nonce: string;
        sha3Uncles: string;
        logsBloom: string;
        transactionsRoot: string;
        stateRoot: string;
        receiptsRoot: string;
        miner: string;
        difficulty: string;
        totalDifficulty: string;
        size: string;
        extraData: string;
        gasLimit: string;
        gasUsed: string;
        timestamp: string;
        transactions: string[] | Array<{
            hash: string;
            nonce: string;
            blockHash: string;
            blockNumber: string;
            transactionIndex: string;
            from: string;
            to: string;
            value: string;
            gas: string;
            gasPrice: string;
            input: string;
        }>;
        uncles: string[];
    } | null;
    [EIP1193RequestType.GET_LOGS]: Array<{
        address: string;
        topics: string[];
        data: string;
        blockNumber: string;
        transactionHash: string;
        logIndex: string;
        blockHash: string;
    }>;
    [EIP1193RequestType.PERSONAL_SIGN]: string;
    [EIP1193RequestType.SIGN_TYPED_DATA]: string;
    [EIP1193RequestType.SIGN_TYPED_DATA_V4]: string;
    [EIP1193RequestType.WALLET_ADD_ETHEREUM_CHAIN]: null;
    [EIP1193RequestType.WALLET_SWITCH_ETHEREUM_CHAIN]: null;
    [EIP1193RequestType.WALLET_WATCH_ASSET]: boolean;
}
//# sourceMappingURL=eip1193.interface.d.ts.map