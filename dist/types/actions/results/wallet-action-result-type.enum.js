export var WalletActionResultType;
(function (WalletActionResultType) {
    WalletActionResultType["KasTransfer"] = "kas-transfer";
    WalletActionResultType["MessageSigning"] = "message-signing";
    WalletActionResultType["CompoundUtxos"] = "compound-utxos";
    WalletActionResultType["SignPsktTransaction"] = "sign-pskt-transaction";
    WalletActionResultType["CommitReveal"] = "commit-reveal";
    WalletActionResultType["EIP1193ProviderRequest"] = "eip-1193-provider-request";
})(WalletActionResultType || (WalletActionResultType = {}));
