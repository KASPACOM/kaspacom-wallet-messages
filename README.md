# @kaspacom/wallet-messages

TypeScript library for integrating with the [Kaspa.com Web Wallet](https://wallet.kaspa.com). This package provides type-safe interfaces and services to enable seamless communication between dApps and the Kaspa.com wallet through an iframe.

---

## ✨ Features

- ✅ **Type-safe** message structures and interfaces
- 🔁 Built-in support for wallet communication via iframe
- 🧩 Easy integration with dApps using Kaspa.com wallet
- 🛠️ Lightweight and framework-agnostic
- 🌐 Support for both **L1 (Kaspa native)** and **L2 (EVM-compatible)** operations
- 🔐 Secure message passing with origin validation

---

## 📦 Installation

```bash
npm install @kaspacom/wallet-messages
# or
yarn add @kaspacom/wallet-messages
```

---

## 🚀 Quick Start

### Setting Up the Iframe

First, you need to add an iframe element to your HTML that will host the Kaspa.com wallet:

#### Vanilla HTML

```html
<iframe 
  id="wallet-iframe" 
  class="wallet-iframe" 
  src="https://wallet.kaspa.com" 
  title="Kaspa Com Web Wallet"
  allow="camera; clipboard-write"
  sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox">
</iframe>
```

**URL Parameters:**

You can specify which view to open by adding a query parameter to the URL:

- **L1 View (Kaspa Native)**: `https://wallet.kaspa.com/?view=l1`
- **L2 View (EVM Compatible)**: `https://wallet.kaspa.com/?view=l2`

```html
<!-- Open wallet in L1 mode -->
<iframe src="https://wallet.kaspa.com/?view=l1" ...></iframe>

<!-- Open wallet in L2 mode -->
<iframe src="https://wallet.kaspa.com/?view=l2" ...></iframe>
```

**Important iframe attributes:**
- `allow="camera; clipboard-write"` - Required for QR code scanning and copying addresses
- `sandbox` - Security permissions needed for the wallet to function properly:
  - `allow-storage-access-by-user-activation` - Access to storage
  - `allow-scripts` - Execute JavaScript
  - `allow-same-origin` - Access same-origin resources
  - `allow-forms` - Submit forms
  - `allow-popups` - Open popups
  - `allow-popups-to-escape-sandbox` - Allow popups to escape sandbox

**Styling the iframe:**

```css
.wallet-iframe {
  width: 480px;
  height: 680px;
  border: none;
  border-radius: 8px;
}
```

---

### Basic Setup (L1 - Kaspa Native)

```typescript
import { 
  KaspaComWebWalletMessagesService,
  WalletActionTypeEnum,
  ERROR_CODES,
  ERROR_CODES_MESSAGES
} from '@kaspacom/wallet-messages';

// 1. Initialize the service
// For devevelopment, you can use https://dev-wallet.kaspa.com
const walletMessagesService = new KaspaComWebWalletMessagesService(
  'https://wallet.kaspa.com'
);

// 2. Get reference to your iframe element
const iframe = document.getElementById('wallet-iframe') as HTMLIFrameElement;

// 3. Start connection and wait for wallet selection
try {
  const walletInfo = await walletMessagesService.startConnectionAndWaitForWalletSelection(
    iframe,
    {
      onWalletInfoUpdate: (newInfo, oldInfo) => {
        console.log('Wallet info updated:', newInfo);
        if (newInfo?.walletAddress) {
          console.log('Connected to:', newInfo.walletAddress);
          console.log('Balance:', newInfo.balance);
        }
      }
    }
  );
  
  console.log('Wallet connected!', walletInfo);
} catch (error) {
  console.error('Failed to connect wallet:', error);
}
```

### Basic Setup (L2 - EVM Compatible)

```typescript
import { 
  KaspaComWebWalletMessagesService,
  KaspaComWebWalletEip1193Provider,
  EIP1193RequestType
} from '@kaspacom/wallet-messages';

// 1. Initialize the messages service
const walletMessagesService = new KaspaComWebWalletMessagesService(
  'https://wallet.kaspa.com'
);

// 2. Create EIP-1193 provider
const provider = new KaspaComWebWalletEip1193Provider(walletMessagesService);

// 3. Get reference to your iframe element
const iframe = document.getElementById('wallet-iframe') as HTMLIFrameElement;

// 4. Start connection
await walletMessagesService.startConnectionAndWaitForWalletSelection(
  iframe,
  {
    onWalletInfoUpdate: (walletInfo) => {
      console.log('Wallet info updated:', walletInfo);
    },
    onEip1193Event: (event) => {
      console.log('EIP-1193 event:', event);
    }
  }
);

// 5. Use EIP-1193 methods
const accounts = await provider.request({
  method: EIP1193RequestType.REQUEST_ACCOUNTS,
  params: []
});

console.log('Connected accounts:', accounts);
```

---

## 📖 Common Usage Examples

### Send KAS (L1)

```typescript
// Send 1.5 KAS to an address
const result = await walletMessagesService.sendWalletActionAndWaitForResponse({
  action: WalletActionTypeEnum.KasTransfer,
  data: {
    amount: 1.5, // Amount in KAS
    to: 'kaspa:qz...' // Recipient address
  }
});

if (result.success) {
  console.log('Transaction ID:', result.data.transactionId);
} else {
  console.error('Transfer failed:', ERROR_CODES_MESSAGES[result.errorCode]);
}
```

### Sign a Message (L1)

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

### Commit-Reveal Operation (L1)

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

### Send Transaction (L2 - EVM)

```typescript
const txHash = await provider.request({
  method: EIP1193RequestType.SEND_TRANSACTION,
  params: [{
    from: '0x...',
    to: '0x...',
    value: BigInt('1000000000000000000'), // 1 ETH in wei
    data: '0x'
  }]
});

console.log('Transaction hash:', txHash);
```

### Sign Message (L2 - EVM)

```typescript
const signature = await provider.request({
  method: EIP1193RequestType.PERSONAL_SIGN,
  params: ['Hello, Kaspa L2!', '0x...'] // [message, address]
});

console.log('Signature:', signature);
```

---

## 🎯 Handling Wallet State

### Get Current Wallet Info

```typescript
const walletInfo = walletMessagesService.getWalletInfo();

if (walletInfo) {
  console.log('Address:', walletInfo.walletAddress);
  console.log('Balance:', walletInfo.balance);
  // Balance has: current, pending, outgoing
}
```

### Listen to Balance Changes

```typescript
await walletMessagesService.startConnectionAndWaitForWalletSelection(
  iframe,
  {
    onWalletInfoUpdate: (newInfo, oldInfo) => {
      // Check if balance changed
      if (JSON.stringify(newInfo?.balance) !== JSON.stringify(oldInfo?.balance)) {
        console.log('Balance updated:', newInfo?.balance);
      }
      
      // Check if wallet address changed
      if (newInfo?.walletAddress !== oldInfo?.walletAddress) {
        if (newInfo?.walletAddress) {
          console.log('Wallet connected:', newInfo.walletAddress);
        } else {
          console.log('Wallet disconnected');
        }
      }
    }
  }
);
```

### Disconnect Wallet

```typescript
await walletMessagesService.disconnect();
```

---

## � Error Handling

All wallet actions return a result object with a `success` field. Always check this before accessing the data:

```typescript
const result = await walletMessagesService.sendWalletActionAndWaitForResponse({
  action: WalletActionTypeEnum.KasTransfer,
  data: { amount: 1.5, to: 'kaspa:...' }
});

if (result.success) {
  // Success - access result.data
  console.log('Transaction ID:', result.data.transactionId);
} else {
  // Error - access result.errorCode
  const errorMessage = ERROR_CODES_MESSAGES[result.errorCode];
  console.error('Error:', errorMessage);
  
  // Common error codes:
  // - ERROR_CODES.WALLET_ACTION.INSUFFICIENT_BALANCE
  // - ERROR_CODES.WALLET_ACTION.INVALID_ADDRESS
  // - ERROR_CODES.WALLET_ACTION.INVALID_AMOUNT
  // - ERROR_CODES.EIP1193.USER_REJECTED
}
```

---

## 🌐 Complete Integration Example (Angular)

Here's a complete example of integrating the wallet into an Angular application:

```typescript
import { Injectable, signal } from '@angular/core';
import {
  KaspaComWebWalletMessagesService,
  WalletActionTypeEnum,
  ERROR_CODES_MESSAGES,
  WalletInfoPayloadInterface,
  WalletBalance
} from '@kaspacom/wallet-messages';

@Injectable({
  providedIn: 'root',
})
export class KaspaComWalletService {
  private showWallet = signal<boolean>(false);
  private walletMessagesService: KaspaComWebWalletMessagesService;
  private iframe: HTMLIFrameElement | undefined;

  constructor() {
    this.walletMessagesService = new KaspaComWebWalletMessagesService(
      'https://wallet.kaspa.com'
    );
  }

  async initializeWallet(): Promise<boolean> {
    this.showWallet.set(true);

    // Wait for iframe to be available
    for (let i = 0; i < 20; i++) {
      if (this.iframe) break;
      await new Promise((resolve) =>
        requestAnimationFrame(() => setTimeout(resolve, 0))
      );
    }

    if (!this.iframe) {
      console.error('Failed initializing iframe');
      return false;
    }

    try {
      await this.walletMessagesService.startConnectionAndWaitForWalletSelection(
        this.iframe,
        {
          onWalletInfoUpdate: this.onWalletInfoUpdate.bind(this),
        }
      );
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async sendKaspa(toAddress: string, amountKas: number): Promise<string> {
    const result = await this.walletMessagesService.sendWalletActionAndWaitForResponse({
      action: WalletActionTypeEnum.KasTransfer,
      data: {
        amount: amountKas,
        to: toAddress,
      },
    });

    if (!result.success) {
      throw new Error(ERROR_CODES_MESSAGES[result.errorCode]);
    }

    return result.data.transactionId;
  }

  async getBalance(): Promise<WalletBalance> {
    return this.walletMessagesService.getWalletInfo()?.balance || {
      current: 0,
      pending: 0,
      outgoing: 0,
    };
  }

  setIframe(iframe: HTMLIFrameElement | undefined) {
    this.iframe = iframe;
  }

  private onWalletInfoUpdate(
    walletInfo: WalletInfoPayloadInterface | undefined,
    oldWalletInfo: WalletInfoPayloadInterface | undefined
  ) {
    console.log('Wallet info updated:', walletInfo);
    
    if (!walletInfo?.walletAddress) {
      this.disconnect();
    }
  }

  async disconnect(): Promise<void> {
    this.showWallet.set(false);
    this.walletMessagesService.disconnect();
  }
}
```

---

## 📚 API Reference

For a complete list of all available actions, request/response types, and error codes, see the [API Reference](./API_REFERENCE.md).

---

## 🔗 Links

- [GitHub Repository](https://github.com/KASPIANO/kaspacom-wallet-messages)
- [Kaspa.com Wallet](https://wallet.kaspa.com)
- [API Reference](./API_REFERENCE.md)

---

## 📄 License

MIT © KaspaCom