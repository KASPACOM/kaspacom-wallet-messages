import { WalletActionRequestPayloadInterface } from "../types/actions/requests/wallet-action-request-payload-interface";
import { WalletActionResultPayloadInterface } from "../types/actions/results/wallet-action-result-payload-interface";
import { InitWalletOptions } from "../types/init-wallet-options.interface";
import { WalletInfoPayloadInterface } from "../types/payloads/wallet-info-payload.interface";
import { WalletMessageInterface } from "../types/wallet-message.interface";
export declare class KaspaComWebWalletMessagesService {
    private readonly options;
    private onMessageWithBind;
    private eventHandlers;
    private walletWindow;
    private walletInfo;
    private messagesWaitingToBeResolved;
    constructor(options?: InitWalletOptions);
    private onMessage;
    private startListeningForMessages;
    private setCurrentWindow;
    stopListeningForMessages(): void;
    getWalletInfo(): WalletInfoPayloadInterface | undefined;
    private handleWalletInfoUpdate;
    private handleRequestResponse;
    sendWalletMessage(message: WalletMessageInterface): void;
    sendWalletActionAndWaitForResponse(action: WalletActionRequestPayloadInterface): Promise<WalletActionResultPayloadInterface>;
    walletClosed(): Promise<void>;
}
//# sourceMappingURL=kaspacom-web-wallet.d.ts.map