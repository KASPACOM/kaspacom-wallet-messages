import { EnvironmentUrlEnum } from "../consts/enviroment-urls.enum";
import { ERROR_CODES, ERROR_CODES_MESSAGES } from "../consts/error-codes.consts";
import { ConnectAppActionInterface } from "../types/actions/requests/payloads/connect-app-action.interface";
import { SignMessageActionInterface } from "../types/actions/requests/payloads/sign-message-action.interface";
import { WalletActionRequestPayloadInterface } from "../types/actions/requests/wallet-action-request-payload-interface";
import { WalletActionTypeEnum } from "../types/actions/requests/wallet-action-type.enum";
import { ConnectAppActionResult } from "../types/actions/results/payloads/connect-app-action-result.interface";
import { SignedMessageActionResult } from "../types/actions/results/payloads/sign-message-action-result.interface";
import { WalletActionResultPayloadInterface } from "../types/actions/results/wallet-action-result-payload-interface";
import { KaspaComWebWalletMessagesEventHandlers } from "../types/event-handlers.interface";
import { InitWalletOptions } from "../types/init-wallet-options.interface";
import { WalletInfoPayloadInterface } from "../types/payloads/wallet-info-payload.interface";
import { WalletMessageTypeEnum } from "../types/wallet-message-type.enum";
import { WalletMessageInterface } from "../types/wallet-message.interface";


export class KaspaComWebWalletMessagesService {
  private onMessageWithBind: (event: any) => void;
  private eventHandlers: KaspaComWebWalletMessagesEventHandlers | undefined;
  private walletWindow: Window | undefined = undefined;

  private walletInfo: WalletInfoPayloadInterface | undefined = undefined;

  private messagesWaitingToBeResolved: {
    [id: string]: {
      promise: Promise<WalletActionResultPayloadInterface>;
      resolve: (value: WalletActionResultPayloadInterface) => void;
      reject: (reason?: any) => void;
      action: WalletActionRequestPayloadInterface;
      isApprovedByUser?: boolean;
    };
  } = {};

  constructor(private readonly options: InitWalletOptions = {}) {
    // set default options
    options.environment = options.environment || EnvironmentUrlEnum.MAINNET;

    this.walletWindow = options.walletWindow;

    this.onMessageWithBind = this.onMessage.bind(this);
  }


  private async onMessage(event: any): Promise<void> {
    console.log('Message Received on front', event.data);
    if (
      event.origin === this.options.environment &&
      event.data &&
      event.data?.type
    ) {
      const eventData: WalletMessageInterface =
        event.data as WalletMessageInterface;

      // Handle responses from requests
      if (
        eventData.uuid
      ) {
        if (eventData.type === WalletMessageTypeEnum.WalletActionResponse) {
          await this.handleRequestResponse(eventData);
          return;
        }

        if (eventData.type === WalletMessageTypeEnum.WalletActionApproved) {
          if (this.messagesWaitingToBeResolved[eventData.uuid!]) {
            this.messagesWaitingToBeResolved[eventData.uuid!].isApprovedByUser = true;
          }
          return;
        }

      }

      // Handle events like wallet connected, disconnected, changed, balance changed and more
      switch (eventData.type) {
        case WalletMessageTypeEnum.WalletInfo:
          this.handleWalletInfoUpdate(eventData.payload);
          break;
        default:
          console.error('Unknown message', eventData);
          throw new Error(`Unknown message type ${eventData.type}`);
      }
    }
  }

  async openAndShowWalletWindowIfNotOpened(): Promise<boolean> {
    if (!this.isWalletWindowOpened()) {
      const walletWindow = window.open(this.options.environment, 'kaspaComWebWallet', 'height=200,width=150');

      if (!walletWindow) {
        return false;
      }


      this.setCurrentWindow(walletWindow);
      this.startListeningForMessages(this.options.eventHandlers);

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    // this.walletWindow!.focus();
    this.walletWindow?.blur();
    console.log('blurrreed');

    return true;
  }

  private async handleWalletOpeningClosingAndError<T>(actionData: WalletActionRequestPayloadInterface): Promise<T> {
    const isOpened = await this.openAndShowWalletWindowIfNotOpened();


    if (!isOpened) {
      throw new Error(ERROR_CODES_MESSAGES[ERROR_CODES.WALLET_ACTION.FAILED_OPENING_WALLET]);
    }

    try {
      const result =
        await this.sendWalletActionAndWaitForResponse(actionData);

      if (!result.success) {
        console.error('error from wallet', result);
        throw new Error(ERROR_CODES_MESSAGES[result.errorCode || ERROR_CODES.GENERAL.UNKNOWN_ERROR]);
      }

      return result.data as T;

    } catch (error) {
      console.error(error);
      throw error;
    }
  }


  async connectApp(options?: ConnectAppActionInterface): Promise<ConnectAppActionResult> {
    return await this.handleWalletOpeningClosingAndError<ConnectAppActionResult>({
      action: WalletActionTypeEnum.ConnectApp,
      data: options || {},
    });
  }

  async signMessageAndGetPublicKey(options: SignMessageActionInterface): Promise<SignedMessageActionResult> {
    return await this.handleWalletOpeningClosingAndError<SignedMessageActionResult>({
      action: WalletActionTypeEnum.SignMessage,
      data: options,
    });
  }

  private startListeningForMessages(eventHandlers: KaspaComWebWalletMessagesEventHandlers = {
    onWalletInfoUpdate: () => { },
  }) {
    this.eventHandlers = eventHandlers;
    window.addEventListener("message", this.onMessageWithBind);
  }

  private setCurrentWindow(walletWindow: Window | undefined) {
    this.walletWindow = walletWindow;
  }

  private stopListeningForMessages() {
    this.walletWindow?.removeEventListener('message', this.onMessageWithBind);
    this.eventHandlers = undefined;

    for (const key of Object.keys(this.messagesWaitingToBeResolved)) {
      const value = this.messagesWaitingToBeResolved[key];
      value.reject();
      delete this.messagesWaitingToBeResolved[key];
    }
  }

  getWalletInfo() {
    return this.walletInfo;
  }

  private handleWalletInfoUpdate(data: WalletInfoPayloadInterface | undefined) {
    const oldWalletInfo: WalletInfoPayloadInterface | undefined = this.walletInfo;
    this.walletInfo = data;
    this.eventHandlers?.onWalletInfoUpdate(data, oldWalletInfo);
  }

  private handleRequestResponse(data: WalletMessageInterface) {
    const defferObject = this.messagesWaitingToBeResolved[data.uuid!];
    if (!defferObject) {
      console.warn(
        `Message with uuid ${data.uuid} not found in messagesWaitingToBeResolved`
      );

      return;
    }

    const payload: WalletActionResultPayloadInterface = data.payload as WalletActionResultPayloadInterface;

    defferObject.resolve(payload);
    delete this.messagesWaitingToBeResolved[data.uuid!];
  }

  sendWalletMessage(message: WalletMessageInterface) {
    if (!this.walletWindow) {
      throw new Error('Wallet window not exists.');
    }

    console.log('sending message', message, '*')

    this.walletWindow.postMessage(
      message,
      '*',
    );
  }

  async sendWalletActionAndWaitForResponse(
    action: WalletActionRequestPayloadInterface,
  ): Promise<WalletActionResultPayloadInterface> {
    if (!this.isWalletWindowOpened()) {
      return {
        success: false,
        errorCode: ERROR_CODES.WALLET_ACTION.WALLET_NOT_SELECTED,
        action: action.action,
      };
    }

    const uuid = crypto.randomUUID();

    const defferObject = { action } as {
      promise: Promise<WalletActionResultPayloadInterface>;
      resolve: (value: WalletActionResultPayloadInterface) => void;
      reject: (reason?: any) => void;
      action: WalletActionRequestPayloadInterface;
    };
    defferObject.promise = new Promise<WalletActionResultPayloadInterface>(
      (resolve, reject) => {
        defferObject.resolve = resolve;
        defferObject.reject = reject;
      }
    );

    this.messagesWaitingToBeResolved[uuid] = defferObject;

    this.sendWalletMessage({
      type: WalletMessageTypeEnum.WalletActionRequest,
      uuid,
      payload: action,
    })

    return await defferObject.promise;
  }



  private async walletClosed() {
    if (this.messagesWaitingToBeResolved) {
      for (const key of Object.keys(this.messagesWaitingToBeResolved)) {
        if (this.messagesWaitingToBeResolved[key].isApprovedByUser) {
          continue;
        }


        this.sendWalletMessage({
          type: WalletMessageTypeEnum.RejectWalletActionRequest,
          payload: {
            actionUuid: key,
          }
        })
        const value = this.messagesWaitingToBeResolved[key];
        value.resolve({
          success: false,
          errorCode: ERROR_CODES.WALLET_ACTION.USER_REJECTED,
          action: value.action.action,
        });
        delete this.messagesWaitingToBeResolved[key];
      }
    }
  }

  isWalletWindowOpened(): boolean {
    return !!(this.walletWindow && !this.walletWindow.closed);
  }
}
