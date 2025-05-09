/**
 * Enum for wallet action types
 */
export var WalletActionTypeEnum;
(function (WalletActionTypeEnum) {
    WalletActionTypeEnum["KasTransfer"] = "KasTransfer";
    WalletActionTypeEnum["SignMessage"] = "SignMessage";
    WalletActionTypeEnum["CommitReveal"] = "CommitReveal";
    WalletActionTypeEnum["SignPsktTransaction"] = "SignPsktTransaction";
    WalletActionTypeEnum["GetProtocolScriptData"] = "GetProtocolScriptData";
})(WalletActionTypeEnum || (WalletActionTypeEnum = {}));
