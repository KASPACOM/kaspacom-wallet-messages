export enum WalletActionTypeEnum {
    SignMessage = 'sign-message',
    CommitReveal = 'commit-reveal',
    KasTransfer = 'kas-transfer',
    SignPsktTransaction = 'sign-pskt-transaction',
    CovenantDeploy = 'deploy-covenant',
    CovenantSpend = 'spend-covenant',
    CovenantCompletePartial = 'complete-covenant-partial',
    GetProtocolScriptData = 'get-protocol-script-data',
    EIP1193ProviderRequest = 'eip-1193-provider-request',
}
