export var WalletMessageTypeEnum;
(function (WalletMessageTypeEnum) {
    // Info Events
    WalletMessageTypeEnum["WalletInfo"] = "wallet-info";
    WalletMessageTypeEnum["WalletActionApproved"] = "wallet-action-approved";
    // Action Requests
    WalletMessageTypeEnum["WalletActionRequest"] = "wallet-action-request";
    // Action Response
    WalletMessageTypeEnum["WalletActionResponse"] = "wallet-action-response";
    // Actions Without Response
    WalletMessageTypeEnum["OpenWalletInfo"] = "open-wallet-info";
    WalletMessageTypeEnum["RejectWalletActionRequest"] = "reject-wallet-action-request";
})(WalletMessageTypeEnum || (WalletMessageTypeEnum = {}));
