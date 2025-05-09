export var WalletMessageTypeEnum;
(function (WalletMessageTypeEnum) {
    WalletMessageTypeEnum["WalletInfo"] = "wallet-info";
    WalletMessageTypeEnum["EIP1193Event"] = "eip-1193-event";
    WalletMessageTypeEnum["WalletActionRequest"] = "wallet-action-request";
    WalletMessageTypeEnum["WalletActionApproved"] = "wallet-action-approved";
    WalletMessageTypeEnum["WalletActionResponse"] = "wallet-action-response";
    WalletMessageTypeEnum["OpenWalletInfo"] = "open-wallet-info";
    WalletMessageTypeEnum["RejectWalletActionRequest"] = "reject-wallet-action-request";
})(WalletMessageTypeEnum || (WalletMessageTypeEnum = {}));
