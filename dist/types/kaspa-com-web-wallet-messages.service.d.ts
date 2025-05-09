import { KaspaComWebWalletMessagesEventHandlers } from './event-handlers.interface';
import { WalletActionResultPayloadInterface, WalletMessageInterface } from 'kaspacom-wallet-messages';
import { WalletActionRequestPayloadInterface } from 'kaspacom-wallet-messages';
export declare class KaspaComWebWalletMessagesService {
    private onMessageWithBind;
    private eventHandlers;
    private iframe;
    private walletInfo;
    private messagesWaitingToBeResolved;
    constructor();
    private onMessage;
    startListeningForMessages(eventHandlers: KaspaComWebWalletMessagesEventHandlers): void;
    setCurrentIframe(iframe: HTMLIFrameElement | undefined): void;
    stopListeningForMessages(): void;
    getWalletInfo(): any;
    private handleWalletInfoUpdate;
    private handleRequestResponse;
    sendWalletMessage(message: WalletMessageInterface): void;
    sendWalletActionAndWaitForResponse(action: WalletActionRequestPayloadInterface): Promise<WalletActionResultPayloadInterface>;
    walletClosed(): Promise<void>;
}
//# sourceMappingURL=kaspa-com-web-wallet-messages.service.d.ts.map