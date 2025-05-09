export type EIP1193ProviderEvent =
  | EIP1193ProviderEventEnum.CONNECT
  | EIP1193ProviderEventEnum.DISCONNECT
  | EIP1193ProviderEventEnum.CHAIN_CHANGED
  | EIP1193ProviderEventEnum.ACCOUNTS_CHANGED
  | EIP1193ProviderEventEnum.MESSAGE;

export enum EIP1193ProviderEventEnum {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  CHAIN_CHANGED = 'chainChanged',
  ACCOUNTS_CHANGED = 'accountsChanged',
  MESSAGE = 'message',
};
