export enum WalletMessageTypeEnum {
    // Info Events
    WalletInfo = 'wallet-info',
    WalletActionApproved = 'wallet-action-approved',

    // Action Requests
    WalletActionRequest = 'wallet-action-request',

    // Action Response
    WalletActionResponse = 'wallet-action-response',


    // Actions Without Response
    OpenWalletInfo = 'open-wallet-info',
    RejectWalletActionRequest = 'reject-wallet-action-request',
}