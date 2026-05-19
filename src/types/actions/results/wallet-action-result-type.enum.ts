export enum WalletActionResultType {
    KasTransfer = 'kas-transfer',
    MessageSigning = 'message-signing',
    CompoundUtxos = 'compound-utxos',
    SignPsktTransaction = 'sign-pskt-transaction',
    CommitReveal = 'commit-reveal',
    CovenantDeploy = 'deploy-covenant',
    CovenantSpend = 'spend-covenant',
    EIP1193ProviderRequest = 'eip-1193-provider-request',
}
