export var WalletActionResultType;
(function (WalletActionResultType) {
    WalletActionResultType["KasTransfer"] = "kas-transfer";
    WalletActionResultType["MessageSigning"] = "message-signing";
    WalletActionResultType["CompoundUtxos"] = "compound-utxos";
    WalletActionResultType["SignPsktTransaction"] = "sign-pskt-transaction";
    WalletActionResultType["SignL2EtherTransaction"] = "sign-l2-ether-transaction";
    WalletActionResultType["CommitReveal"] = "commit-reveal";
})(WalletActionResultType || (WalletActionResultType = {}));
