# API Reference

Complete reference for all available actions, request/response types, and error codes in `@kaspacom/wallet-messages`.

---

## Table of Contents

- [Services](#services)
  - [KaspaComWebWalletMessagesService](#kaspacomwebwalletmessagesservice)
  - [KaspaComWebWalletEip1193Provider](#kaspacomwebwalleteip1193provider)
- [L1 Actions (Kaspa Native)](#l1-actions-kaspa-native)
  - [KasTransfer](#kastransfer)
  - [SignMessage](#signmessage)
  - [CommitReveal](#commitreveal)
  - [SignPsktTransaction](#signpskttransaction)
  - [GetProtocolScriptData](#getprotocolscriptdata)
- [L2 Actions (EVM/EIP-1193)](#l2-actions-evmeip-1193)
  - [Account Management](#account-management)
  - [Transaction Methods](#transaction-methods)
  - [Signing Methods](#signing-methods)
  - [Network Methods](#network-methods)
  - [Query Methods](#query-methods)
- [Types](#types)
  - [WalletBalance](#walletbalance)
  - [WalletInfoPayloadInterface](#walletinfopayloadinterface)
  - [ProtocolScript](#protocolscript)
- [Error Codes](#error-codes)
  - [General Errors](#general-errors)
  - [Wallet Action Errors](#wallet-action-errors)
  - [EIP-1193 Errors](#eip-1193-errors)

---

## Services

### KaspaComWebWalletMessagesService

Main service for communicating with the Kaspa.com Web Wallet through an iframe.

#### Constructor

```typescript
constructor(walletUrl: string)
```

**Parameters:**
- `walletUrl`: The URL of the Kaspa.com Web Wallet (typically `https://wallet.kaspa.com`)

#### Methods

##### `startConnectionAndWaitForWalletSelection()`

Starts the connection with the wallet iframe and waits for wallet selection.

```typescript
async startConnectionAndWaitForWalletSelection(
  iframe: HTMLIFrameElement,
  eventHandlers: KaspaComWebWalletMessagesEventHandlers
): Promise<WalletInfoPayloadInterface>
```

**Parameters:**
- `iframe`: The HTML iframe element containing the wallet
- `eventHandlers`: Event handlers for wallet events
  - `onWalletInfoUpdate?: (newInfo?: WalletInfoPayloadInterface, oldInfo?: WalletInfoPayloadInterface) => void`
  - `onEip1193Event?: (event: any) => void`

**Returns:** Promise that resolves with the wallet info when connected

**Example:**
```typescript
const walletInfo = await walletMessagesService.startConnectionAndWaitForWalletSelection(
  iframe,
  {
    onWalletInfoUpdate: (newInfo, oldInfo) => {
      console.log('Wallet updated:', newInfo);
    }
  }
);
```

##### `sendWalletActionAndWaitForResponse()`

Sends a wallet action and waits for the response.

```typescript
async sendWalletActionAndWaitForResponse(
  action: WalletActionRequestPayloadInterface
): Promise<WalletActionResultPayloadInterface>
```

**Parameters:**
- `action`: The wallet action to perform (see [L1 Actions](#l1-actions-kaspa-native))

**Returns:** Promise that resolves with the action result

##### `getWalletInfo()`

Gets the current wallet information.

```typescript
getWalletInfo(): WalletInfoPayloadInterface | undefined
```

**Returns:** The current wallet info or undefined if not connected

##### `disconnect()`

Disconnects from the wallet and cleans up event listeners.

```typescript
async disconnect(): Promise<void>
```

##### `walletClosed()`

Handles wallet closure by rejecting pending actions.

```typescript
async walletClosed(): Promise<void>
```

##### `sendWalletMessage()`

Sends a message to the wallet iframe.

```typescript
sendWalletMessage(message: WalletMessageInterface): void
```

##### `isUserSelectedWallet()`

Checks if the user has selected a wallet.

```typescript
isUserSelectedWallet(): boolean
```

##### `addEventHandlers()`

Adds event handlers to the service.

```typescript
addEventHandlers(eventHandlers: KaspaComWebWalletMessagesEventHandlers): void
```

##### `removeEventHandlers()`

Removes event handlers from the service.

```typescript
removeEventHandlers(eventHandlers: KaspaComWebWalletMessagesEventHandlers): void
```

---

### KaspaComWebWalletEip1193Provider

EIP-1193 compatible provider for L2 (EVM) operations.

#### Constructor

```typescript
constructor(kaspaComWalletMessages: KaspaComWebWalletMessagesService)
```

**Parameters:**
- `kaspaComWalletMessages`: Instance of KaspaComWebWalletMessagesService

#### Methods

##### `request()`

Makes an EIP-1193 request to the wallet.

```typescript
async request<T extends EIP1193RequestType>(
  args: EIP1193RequestPayload<T>
): Promise<EIP1193RequestResults[T]>
```

**Parameters:**
- `args`: Request payload with method and params

**Returns:** Promise that resolves with the method-specific result

**Example:**
```typescript
const accounts = await provider.request({
  method: EIP1193RequestType.REQUEST_ACCOUNTS,
  params: []
});
```

##### `on()`

Adds an event listener.

```typescript
on(event: string, listener: (...args: any[]) => void): this
```

**Parameters:**
- `event`: Event name (e.g., 'accountsChanged', 'chainChanged')
- `listener`: Event listener function

##### `removeListener()`

Removes an event listener.

```typescript
removeListener(event: string, listener: (...args: any[]) => void): this
```

##### `getKaspaComWalletMessages()`

Gets the underlying KaspaComWebWalletMessagesService instance.

```typescript
getKaspaComWalletMessages(): KaspaComWebWalletMessagesService
```

---

## L1 Actions (Kaspa Native)

### KasTransfer

Transfer KAS to another address.

#### Request

```typescript
{
  action: WalletActionTypeEnum.KasTransfer,
  data: {
    amount: number;      // Amount in KAS
    to: string;          // Recipient address (kaspa:...)
    sendAll?: boolean;   // Optional: send all available balance
  }
}
```

#### Response (Success)

```typescript
{
  success: true;
  action: WalletActionTypeEnum.KasTransfer;
  data: {
    type: WalletActionResultType.KasTransfer;
    to: string;
    amount: bigint;
    sendAll?: boolean;
    transactionId: string;
  }
}
```

#### Example

```typescript
const result = await walletMessagesService.sendWalletActionAndWaitForResponse({
  action: WalletActionTypeEnum.KasTransfer,
  data: {
    amount: 1.5,
    to: 'kaspa:qz7ulu4c25dh7fzec9zjyrmlhnkzrg4wmf89q7gzr3gfrsj3uz6xjceef60sd'
  }
});

if (result.success) {
  console.log('Transaction ID:', result.data.transactionId);
}
```

---

### SignMessage

Sign a message with the wallet's private key.

#### Request

```typescript
{
  action: WalletActionTypeEnum.SignMessage,
  data: {
    message: string;  // Message to sign
  }
}
```

#### Response (Success)

```typescript
{
  success: true;
  action: WalletActionTypeEnum.SignMessage;
  data: {
    type: WalletActionResultType.MessageSigning;
    originalMessage: string;
    signedMessage: string;
    publicKey: string;
  }
}
```

#### Example

```typescript
const result = await walletMessagesService.sendWalletActionAndWaitForResponse({
  action: WalletActionTypeEnum.SignMessage,
  data: {
    message: 'Hello, Kaspa!'
  }
});

if (result.success) {
  console.log('Signed message:', result.data.signedMessage);
  console.log('Public key:', result.data.publicKey);
}
```

---

### CommitReveal

Perform a commit-reveal operation (used for KRC-20 tokens, inscriptions, etc.).

#### Request

```typescript
{
  action: WalletActionTypeEnum.CommitReveal,
  data: {
    actionScript: {
      type: string;           // Protocol type (e.g., 'KRC-20')
      stringifyAction: string; // JSON stringified action
    };
    options?: {
      priorityFee?: number;          // Priority fee for commit tx
      revealPriorityFee?: number;    // Priority fee for reveal tx
      additionalOutputs?: Array<{    // Additional outputs for commit tx
        address: string;
        amount: number;
      }>;
      commitTransactionId?: string;  // Existing commit tx ID
      revealPskt?: {                 // Reveal PSKT configuration
        outputs?: Array<{
          address: string;
          amount: number;
        }>;
        script: ProtocolScriptDataAndAddress;
      };
    };
  }
}
```

#### Response (Success)

```typescript
{
  success: true;
  action: WalletActionTypeEnum.CommitReveal;
  data: {
    type: WalletActionResultType.CommitReveal;
    commitTransactionId: string;
    revealTransactionId: string;
    protocol: string;
    protocolAction: string;
    revealPsktJson?: string;
  }
}
```

#### Example

```typescript
import { ProtocolType } from '@kaspacom/wallet-messages';

const result = await walletMessagesService.sendWalletActionAndWaitForResponse({
  action: WalletActionTypeEnum.CommitReveal,
  data: {
    actionScript: {
      type: ProtocolType.KRC20,
      stringifyAction: JSON.stringify({
        p: 'krc-20',
        op: 'mint',
        tick: 'NACHO'
      })
    },
    options: {
      priorityFee: 0.1,
      revealPriorityFee: 0.1
    }
  }
});

if (result.success) {
  console.log('Commit TX:', result.data.commitTransactionId);
  console.log('Reveal TX:', result.data.revealTransactionId);
}
```

---

### SignPsktTransaction

Sign a PSKT (Partially Signed Kaspa Transaction) and optionally submit it.

#### Request

```typescript
{
  action: WalletActionTypeEnum.SignPsktTransaction,
  data: {
    psktTransactionJson: string;      // JSON stringified PSKT
    submitTransaction?: boolean;      // Whether to submit after signing
    protocol?: string;                // Protocol identifier
    protocolAction?: string;          // Protocol action
  }
}
```

#### Response (Success)

```typescript
{
  success: true;
  action: WalletActionTypeEnum.SignPsktTransaction;
  data: {
    type: WalletActionResultType.SignPsktTransaction;
    transactionId?: string;           // Present if submitted
    psktTransactionJson: string;      // Signed PSKT JSON
  }
}
```

#### Example

```typescript
const result = await walletMessagesService.sendWalletActionAndWaitForResponse({
  action: WalletActionTypeEnum.SignPsktTransaction,
  data: {
    psktTransactionJson: '{"version":0,"inputs":[...],"outputs":[...]}',
    submitTransaction: true,
    protocol: 'KRC-20',
    protocolAction: 'transfer'
  }
});

if (result.success) {
  console.log('Transaction ID:', result.data.transactionId);
  console.log('Signed PSKT:', result.data.psktTransactionJson);
}
```

---

### GetProtocolScriptData

Get protocol script data and address for a specific action.

#### Request

```typescript
{
  action: WalletActionTypeEnum.GetProtocolScriptData,
  data: {
    type: string;           // Protocol type
    stringifyAction: string; // JSON stringified action
  }
}
```

#### Response (Success)

```typescript
{
  success: true;
  action: WalletActionTypeEnum.GetProtocolScriptData;
  data: {
    scriptPublicKey: string;
    address: string;
  }
}
```

#### Example

```typescript
const result = await walletMessagesService.sendWalletActionAndWaitForResponse({
  action: WalletActionTypeEnum.GetProtocolScriptData,
  data: {
    type: 'KRC-20',
    stringifyAction: JSON.stringify({
      p: 'krc-20',
      op: 'deploy',
      tick: 'TEST'
    })
  }
});

if (result.success) {
  console.log('Script address:', result.data.address);
  console.log('Script public key:', result.data.scriptPublicKey);
}
```

---

## L2 Actions (EVM/EIP-1193)

All L2 actions use the `provider.request()` method with different method types.

### Account Management

#### `eth_requestAccounts`

Request user's Ethereum accounts.

```typescript
const accounts = await provider.request({
  method: EIP1193RequestType.REQUEST_ACCOUNTS,
  params: []
});
// Returns: string[] - Array of account addresses
```

#### `eth_accounts`

Get currently connected accounts (doesn't prompt user).

```typescript
const accounts = await provider.request({
  method: EIP1193RequestType.GET_ACCOUNTS,
  params: []
});
// Returns: string[] - Array of account addresses
```

---

### Transaction Methods

#### `eth_sendTransaction`

Send an Ethereum transaction.

```typescript
const txHash = await provider.request({
  method: EIP1193RequestType.SEND_TRANSACTION,
  params: [{
    from: '0x...',
    to: '0x...',
    value: BigInt('1000000000000000000'), // 1 ETH in wei
    data: '0x',
    gasLimit: '21000',
    gasPrice: '20000000000'
  }]
});
// Returns: string - Transaction hash
```

#### `kas_sendTransaction`

Send a Kaspa L2 transaction with additional Kaspa-specific parameters.

```typescript
const txHash = await provider.request({
  method: EIP1193RequestType.KAS_SEND_TRANSACTION,
  params: [
    {
      from: '0x...',
      to: '0x...',
      value: BigInt('1000000000000000000'),
      data: '0x'
    },
    {
      outputs: [
        {
          address: 'kaspa:...',
          amount: BigInt('100000000')
        }
      ]
    }
  ]
});
// Returns: string - Transaction hash
```

#### `eth_getTransactionByHash`

Get transaction details by hash.

```typescript
const tx = await provider.request({
  method: EIP1193RequestType.GET_TRANSACTION_BY_HASH,
  params: ['0x...']
});
// Returns: Transaction object or null
```

#### `eth_getTransactionReceipt`

Get transaction receipt.

```typescript
const receipt = await provider.request({
  method: EIP1193RequestType.GET_TRANSACTION_RECEIPT,
  params: ['0x...']
});
// Returns: TransactionReceipt object or null
```

#### `eth_getTransactionCount`

Get the number of transactions sent from an address.

```typescript
const nonce = await provider.request({
  method: EIP1193RequestType.GET_TRANSACTION_COUNT,
  params: ['0x...', 'latest']
});
// Returns: string - Hex-encoded nonce
```

---

### Signing Methods

#### `personal_sign`

Sign a message with the user's private key.

```typescript
const signature = await provider.request({
  method: EIP1193RequestType.PERSONAL_SIGN,
  params: ['Hello, Kaspa L2!', '0x...'] // [message, address]
});
// Returns: string - Signature
```

#### `eth_sign`

Sign data with an Ethereum account.

```typescript
const signature = await provider.request({
  method: EIP1193RequestType.SIGN,
  params: ['0x...', '0x...'] // [address, data]
});
// Returns: string - Signature
```

#### `eth_signTypedData_v4`

Sign typed structured data (EIP-712).

```typescript
const signature = await provider.request({
  method: EIP1193RequestType.SIGN_TYPED_DATA_V4,
  params: [
    '0x...', // address
    JSON.stringify({
      types: { ... },
      primaryType: 'Mail',
      domain: { ... },
      message: { ... }
    })
  ]
});
// Returns: string - Signature
```

---

### Network Methods

#### `eth_chainId`

Get the current chain ID.

```typescript
const chainId = await provider.request({
  method: EIP1193RequestType.GET_CHAIN_ID,
  params: []
});
// Returns: string - Hex-encoded chain ID (e.g., '0x1' for mainnet)
```

#### `net_version`

Get the current network ID.

```typescript
const networkId = await provider.request({
  method: EIP1193RequestType.GET_NETWORK_VERSION,
  params: []
});
// Returns: string - Network ID
```

#### `wallet_switchEthereumChain`

Switch to a different Ethereum chain.

```typescript
await provider.request({
  method: EIP1193RequestType.WALLET_SWITCH_ETHEREUM_CHAIN,
  params: [{ chainId: '0x89' }] // Polygon
});
// Returns: null on success
```

#### `wallet_addEthereumChain`

Add a new Ethereum chain to the wallet.

```typescript
await provider.request({
  method: EIP1193RequestType.WALLET_ADD_ETHEREUM_CHAIN,
  params: [{
    chainId: '0x89',
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://polygonscan.com']
  }]
});
// Returns: null on success
```

---

### Query Methods

#### `eth_getBalance`

Get the balance of an address.

```typescript
const balance = await provider.request({
  method: EIP1193RequestType.GET_BALANCE,
  params: ['0x...', 'latest'] // [address, block]
});
// Returns: string - Hex-encoded balance in wei
```

#### `eth_blockNumber`

Get the current block number.

```typescript
const blockNumber = await provider.request({
  method: EIP1193RequestType.GET_BLOCK_NUMBER,
  params: []
});
// Returns: string - Hex-encoded block number
```

#### `eth_getBlockByNumber`

Get block information by block number.

```typescript
const block = await provider.request({
  method: EIP1193RequestType.GET_BLOCK_BY_NUMBER,
  params: ['latest', false] // [blockNumber, includeTransactions]
});
// Returns: Block object or null
```

#### `eth_getBlockByHash`

Get block information by block hash.

```typescript
const block = await provider.request({
  method: EIP1193RequestType.GET_BLOCK_BY_HASH,
  params: ['0x...', false] // [blockHash, includeTransactions]
});
// Returns: Block object or null
```

#### `eth_call`

Execute a message call (read-only).

```typescript
const result = await provider.request({
  method: EIP1193RequestType.ETH_CALL,
  params: [
    {
      from: '0x...',
      to: '0x...',
      data: '0x...'
    },
    'latest'
  ]
});
// Returns: string - Return data
```

#### `eth_estimateGas`

Estimate gas for a transaction.

```typescript
const gasEstimate = await provider.request({
  method: EIP1193RequestType.GET_ESTIMATE_GAS,
  params: [{
    from: '0x...',
    to: '0x...',
    value: '0x0',
    data: '0x...'
  }]
});
// Returns: string - Hex-encoded gas estimate
```

#### `eth_gasPrice`

Get the current gas price.

```typescript
const gasPrice = await provider.request({
  method: EIP1193RequestType.GET_GAS_PRICE,
  params: []
});
// Returns: string - Hex-encoded gas price in wei
```

#### `eth_getCode`

Get the code at an address.

```typescript
const code = await provider.request({
  method: EIP1193RequestType.GET_CODE,
  params: ['0x...', 'latest'] // [address, block]
});
// Returns: string - Hex-encoded bytecode
```

#### `eth_getLogs`

Get logs matching a filter.

```typescript
const logs = await provider.request({
  method: EIP1193RequestType.GET_LOGS,
  params: [{
    fromBlock: '0x0',
    toBlock: 'latest',
    address: '0x...',
    topics: ['0x...']
  }]
});
// Returns: Log[] - Array of log objects
```

---

## Types

### WalletBalance

```typescript
interface WalletBalance {
  current: number;   // Current confirmed balance (in sompi for L1, wei for L2)
  pending: number;   // Pending incoming balance
  outgoing: number;  // Pending outgoing balance
}
```

### WalletInfoPayloadInterface

```typescript
interface WalletInfoPayloadInterface {
  walletAddress?: string;  // Current wallet address
  balance?: WalletBalance; // Current balance information
}
```

### ProtocolScript

```typescript
interface ProtocolScript {
  type: string;           // Protocol type (e.g., 'KRC-20')
  stringifyAction: string; // JSON stringified action
}
```

### ProtocolScriptDataAndAddress

```typescript
interface ProtocolScriptDataAndAddress {
  scriptPublicKey: string; // Script public key
  address: string;         // Kaspa address for the script
}
```

### EthTransactionParams

```typescript
interface EthTransactionParams {
  from: string;
  to: string;
  value: bigint;
  data?: string;
  gasLimit?: string;
  gasPrice?: string;
  maxPriorityFeePerGas?: string;
  maxFeePerGas?: string;
  nonce?: string;
}
```

### KasTransactionParams

```typescript
interface KasTransactionParams {
  outputs?: Array<{
    address: string;
    amount: bigint;
  }>;
}
```

---

## Error Codes

All error responses follow this structure:

```typescript
{
  success: false;
  action: WalletActionTypeEnum;
  errorCode: number;
}
```

Use `ERROR_CODES_MESSAGES[errorCode]` to get a human-readable error message.

### General Errors

| Code | Constant | Message |
|------|----------|---------|
| `1` | `ERROR_CODES.GENERAL.UNKNOWN_ERROR` | Unknown error |

### Wallet Action Errors

| Code | Constant | Message |
|------|----------|---------|
| `1001` | `ERROR_CODES.WALLET_ACTION.WALLET_NOT_SELECTED` | Wallet not selected |
| `1002` | `ERROR_CODES.WALLET_ACTION.INVALID_ACTION_TYPE` | Invalid action type |
| `1003` | `ERROR_CODES.WALLET_ACTION.INVALID_AMOUNT` | Invalid amount |
| `1004` | `ERROR_CODES.WALLET_ACTION.INVALID_ADDRESS` | Invalid address |
| `1005` | `ERROR_CODES.WALLET_ACTION.INSUFFICIENT_BALANCE` | Insufficient balance |
| `1007` | `ERROR_CODES.WALLET_ACTION.TICKER_NOT_FOUND` | Ticker not found |
| `1008` | `ERROR_CODES.WALLET_ACTION.TOKEN_NOT_IN_MINTABLE_STATE` | Token not in mintable state |
| `1009` | `ERROR_CODES.WALLET_ACTION.NO_UTXOS_TO_COMPOUND` | No utxos to compound |
| `1010` | `ERROR_CODES.WALLET_ACTION.REVEAL_WITH_NO_COMMIT_ACTION` | Reveal with no commit action |
| `1011` | `ERROR_CODES.WALLET_ACTION.REVEAL_TRANSACTION_NOT_FOUND` | Reveal transaction not found |
| `1012` | `ERROR_CODES.WALLET_ACTION.INVALID_PSKT_TX` | Invalid pskt tx |
| `1013` | `ERROR_CODES.WALLET_ACTION.SEND_TRANSACTION_ALREADY_SPENT` | Send transaction already spent |
| `1014` | `ERROR_CODES.WALLET_ACTION.KASPLEX_API_ERROR` | Kasplex api error |
| `1015` | `ERROR_CODES.WALLET_ACTION.INVALID_DEPLOY_DATA` | Invalid deploy data |
| `1016` | `ERROR_CODES.WALLET_ACTION.INVALID_TICKER` | Invalid ticker |
| `1017` | `ERROR_CODES.WALLET_ACTION.TOKEN_NAME_IS_NOT_AVAILABLE_TO_DEPLOY` | Token name is not available to deploy |
| `1018` | `ERROR_CODES.WALLET_ACTION.INVALID_MESSAGE_TO_SIGN` | Invalid message to sign |
| `1019` | `ERROR_CODES.WALLET_ACTION.INVALID_COMMIT_REVEAL_DATA` | Invalid commit reveal data |

### EIP-1193 Errors

| Code | Constant | Message |
|------|----------|---------|
| `4001` | `ERROR_CODES.EIP1193.USER_REJECTED` | User rejected |
| `4100` | `ERROR_CODES.EIP1193.UNAUTHORIZED` | Unauthorized |
| `4200` | `ERROR_CODES.EIP1193.UNSUPPORTED_METHOD` | Unsupported method |
| `4900` | `ERROR_CODES.EIP1193.DISCONNECTED` | Disconnected |
| `4901` | `ERROR_CODES.EIP1193.CHAIN_DISCONNECTED` | Chain disconnected |
| `4902` | `ERROR_CODES.EIP1193.CHAIN_NOT_ADDED` | Chain not added |
| `-32602` | `ERROR_CODES.EIP1193.INVALID_PARAMETERS` | Invalid parameters |
| `-32601` | `ERROR_CODES.EIP1193.METHOD_NOT_FOUND` | Method not found |
| `-32603` | `ERROR_CODES.EIP1193.INTERNAL_ERROR` | Internal error |

### Error Handling Example

```typescript
import { ERROR_CODES, ERROR_CODES_MESSAGES } from '@kaspacom/wallet-messages';

const result = await walletMessagesService.sendWalletActionAndWaitForResponse({
  action: WalletActionTypeEnum.KasTransfer,
  data: { amount: 1000000, to: 'kaspa:...' }
});

if (!result.success) {
  switch (result.errorCode) {
    case ERROR_CODES.WALLET_ACTION.INSUFFICIENT_BALANCE:
      console.error('Not enough balance!');
      break;
    case ERROR_CODES.WALLET_ACTION.INVALID_ADDRESS:
      console.error('Invalid recipient address!');
      break;
    case ERROR_CODES.EIP1193.USER_REJECTED:
      console.error('User rejected the transaction');
      break;
    default:
      console.error('Error:', ERROR_CODES_MESSAGES[result.errorCode]);
  }
}
```

---

## Enums

### WalletActionTypeEnum

```typescript
enum WalletActionTypeEnum {
  SignMessage = 'sign-message',
  CommitReveal = 'commit-reveal',
  KasTransfer = 'kas-transfer',
  SignPsktTransaction = 'sign-pskt-transaction',
  GetProtocolScriptData = 'get-protocol-script-data',
  EIP1193ProviderRequest = 'eip-1193-provider-request'
}
```

### ProtocolType

```typescript
enum ProtocolType {
  KRC20 = 'KRC-20',
  // Add other protocol types as needed
}
```

### PsktActionsEnum

```typescript
enum PsktActionsEnum {
  // Protocol-specific action types
  DEPLOY = 'deploy',
  MINT = 'mint',
  TRANSFER = 'transfer',
  // ... other actions
}
```

---

## Events

### EIP-1193 Events

When using the EIP-1193 provider, you can listen to standard Ethereum events:

```typescript
// Account changes
provider.on('accountsChanged', (accounts: string[]) => {
  console.log('Accounts changed:', accounts);
});

// Chain changes
provider.on('chainChanged', (chainId: string) => {
  console.log('Chain changed:', chainId);
});

// Connection
provider.on('connect', (connectInfo: { chainId: string }) => {
  console.log('Connected to chain:', connectInfo.chainId);
});

// Disconnection
provider.on('disconnect', (error: { code: number; message: string }) => {
  console.log('Disconnected:', error);
});
```

---

## Additional Resources

- [Main README](./README.md) - Getting started guide and examples
- [GitHub Repository](https://github.com/KASPIANO/kaspacom-wallet-messages)
- [Kaspa.com Wallet](https://wallet.kaspa.com)

---

## License

MIT © KaspaCom
