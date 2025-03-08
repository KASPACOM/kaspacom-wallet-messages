import { ConnectAppActionInterface } from "../types/actions/requests/payloads/connect-app-action.interface";
import { SignMessageActionInterface } from "../types/actions/requests/payloads/sign-message-action.interface";
import { WalletActionRequestPayloadInterface } from "../types/actions/requests/wallet-action-request-payload-interface";
import { ConnectAppActionResult } from "../types/actions/results/payloads/connect-app-action-result.interface";
import { SignedMessageActionResult } from "../types/actions/results/payloads/sign-message-action-result.interface";
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
    openAndShowWalletWindowIfNotOpened(): Promise<boolean>;
    private handleWalletOpeningClosingAndError;
    connectApp(options?: ConnectAppActionInterface): Promise<ConnectAppActionResult>;
    signMessageAndGetPublicKey(options: SignMessageActionInterface): Promise<SignedMessageActionResult>;
    private startListeningForMessages;
    private setCurrentWindow;
    private stopListeningForMessages;
    getWalletInfo(): WalletInfoPayloadInterface | undefined;
    private handleWalletInfoUpdate;
    private handleRequestResponse;
    sendWalletMessage(message: WalletMessageInterface): void;
    sendWalletActionAndWaitForResponse(action: WalletActionRequestPayloadInterface): Promise<WalletActionResultPayloadInterface>;
    private walletClosed;
    isWalletWindowOpened(): boolean;
}
//# sourceMappingURL=kaspacom-web-wallet-messages-service.d.ts.map