export var WalletActionTypeEnum;
(function (WalletActionTypeEnum) {
    WalletActionTypeEnum["SignMessage"] = "sign-message";
    WalletActionTypeEnum["CommitReveal"] = "commit-reveal";
    WalletActionTypeEnum["KasTransfer"] = "kas-transfer";
    WalletActionTypeEnum["SignPsktTransaction"] = "sign-pskt-transaction";
    WalletActionTypeEnum["SignL2Transaction"] = "sign-l2-transaction";
    WalletActionTypeEnum["GetProtocolScriptData"] = "get-protocol-script-data";
})(WalletActionTypeEnum || (WalletActionTypeEnum = {}));
