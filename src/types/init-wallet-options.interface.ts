import { EnvironmentUrlEnum } from "../consts/enviroment-urls.enum";
import { KaspaComWebWalletMessagesEventHandlers } from "./event-handlers.interface";

export interface InitWalletOptions {
    environment?: EnvironmentUrlEnum;
    eventHandlers?: KaspaComWebWalletMessagesEventHandlers;
    walletWindow?: Window;
}