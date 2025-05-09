import { EIP1193ProviderEventEnum } from "./events/event.types";
import { EIP1193RequestPayload, EIP1193RequestType } from "./requests/request.types";
import { EIP1193RequestResults } from "./results/result.types";
export interface EIP1193ProviderInterface {
    request<T extends EIP1193RequestType>(args: EIP1193RequestPayload<T>): Promise<EIP1193RequestResults[T]>;
    on?(event: string, listener: (...args: any[]) => void): this;
    removeListener?(event: string, listener: (...args: any[]) => void): this;
}
export interface EIP1193ProviderConnectInfo {
    chainId: number;
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
    blockExplorerUrls?: string[];
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
export type EIP1193KaspaComWalletProviderEvent = {
    type: EIP1193ProviderEventEnum.CONNECT;
    data: EIP1193ProviderConnectInfo;
} | {
    type: EIP1193ProviderEventEnum.DISCONNECT;
    data: Error;
} | {
    type: EIP1193ProviderEventEnum.CHAIN_CHANGED;
    data: string;
} | {
    type: EIP1193ProviderEventEnum.ACCOUNTS_CHANGED;
    data: string[];
} | {
    type: EIP1193ProviderEventEnum.MESSAGE;
    data: EIP1193ProviderMessage;
};
//# sourceMappingURL=base.types.d.ts.map