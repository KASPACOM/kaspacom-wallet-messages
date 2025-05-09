import { WalletActionTypeEnum } from "../types/actions/requests/wallet-action-type.enum";
export class KaspaComWebWalletEip1193Provider {
    kaspaComWalletMessages;
    constructor(kaspaComWalletMessages) {
        this.kaspaComWalletMessages = kaspaComWalletMessages;
    }
    async request(args) {
        await this.openWallet();
        const result = await this.kaspaComWalletMessages.sendWalletActionAndWaitForResponse({
            action: WalletActionTypeEnum.EIP1193ProviderRequest,
            data: args,
        });
        await this.closeWallet();
        if (!result.success) {
            throw new Error("Error from kaspa-com-web-wallet-messages: " + result.errorCode);
        }
        return result.data;
    }
    async openWallet() {
        // override in subclass
    }
    async closeWallet() {
        // override in subclass
    }
}
