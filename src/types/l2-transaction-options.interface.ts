export interface L2TransactionOptions {
    /**
     *  The transaction type.
     */
    type?: null | number;

    /**
     *  The target of the transaction.
     */
    to?: null | string;

    /**
     *  The sender of the transaction.
     */
    from?: null | string;

    /**
     *  The nonce of the transaction, used to prevent replay attacks.
     */
    nonce?: null | number;

    /**
     *  The maximum amount of gas to allow this transaction to consume.
     */
    gasLimit?: null | number | string;

    /**
     *  The gas price to use for legacy transactions or transactions on
     *  legacy networks.
     *
     *  Most of the time the ``max*FeePerGas`` is preferred.
     */
    gasPrice?: null | number | string;

    /**
     *  The [[link-eip-1559]] maximum priority fee to pay per gas.
     */
    maxPriorityFeePerGas?: null | number | string;

    /**
     *  The [[link-eip-1559]] maximum total fee to pay per gas. The actual
     *  value used is protocol enforced to be the block's base fee.
     */
    maxFeePerGas?: null | number | string;

    /**
     *  The transaction data.
     */
    data?: null | string;

    /**
     *  The transaction value (in wei).
     */
    value?: null | number | string;

    /**
     *  The chain ID for the network this transaction is valid on.
     */
    chainId?: null | number | string;

    /**
     *  The [[link-eip-2930]] access list. Storage slots included in the access
     *  list are //warmed// by pre-loading them, so their initial cost to
     *  fetch is guaranteed, but then each additional access is cheaper.
     */
    accessList?: null | Array<[string, Array<string>]> |
    Record<string, Array<string>>;

    /**
     *  A custom object, which can be passed along for network-specific
     *  values.
     */
    customData?: any;

    // Only meaningful when used for call

    /**
     *  When using ``call`` or ``estimateGas``, this allows a specific
     *  block to be queried. Many backends do not support this and when
     *  unsupported errors are silently squelched and ``"latest"`` is used. 
     */
    blockTag?: string | number;

    /**
     *  When using ``call``, this enables CCIP-read, which permits the
     *  provider to be redirected to web-based content during execution,
     *  which is then further validated by the contract.
     *
     *  There are potential security implications allowing CCIP-read, as
     *  it could be used to expose the IP address or user activity during
     *  the fetch to unexpected parties.
     */
    enableCcipRead?: boolean;

    /**
     *  The blob versioned hashes (see [[link-eip-4844]]).
     */
    blobVersionedHashes?: null | Array<string>

    /**
     *  The maximum fee per blob gas (see [[link-eip-4844]]).
     */
    maxFeePerBlobGas?: null | number | string;

    /**
     *  Any blobs to include in the transaction (see [[link-eip-4844]]).
     */
    blobs?: null | Array<string>;
};