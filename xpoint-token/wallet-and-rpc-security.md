---
icon: lock
---

# Wallet and RPC security

Wallet and RPC configuration must avoid leaking private provider tokens into frontend bundles.

## Browser-safe rule

Do not put private provider URLs in any variable that starts with `NEXT_PUBLIC_`.

Bad:

```bash
NEXT_PUBLIC_RPC_URL_ARB=https://arb-mainnet.g.alchemy.com/v2/<private-key>
```

Good:

```bash
NEXT_PUBLIC_RPC_URL_ARB=/api/network/rpc/arbitrum
Contracts__EthereumRpcUrl=https://arb-mainnet.g.alchemy.com/v2/<private-key>
Contracts__EthereumFallbackRpcUrls=https://arb1.arbitrum.io/rpc
```

The browser calls the staking portal same-origin proxy. The proxy forwards through the staking backend, and only backend-side services know the private RPC URL.

## Production RPC defaults

Use a private RPC provider as primary if needed:

```bash
DEEP_ARBITRUM_RPC_URL=https://arb-mainnet.g.alchemy.com/v2/<alchemy-key>
DEEP_ARBITRUM_FALLBACK_RPC_URLS=https://arb1.arbitrum.io/rpc
```

Keep the provider key in a secret store, host-local `.env`, or orchestrator secret. Never commit it.

## Wallets

Operators need:

- XPNT on Arbitrum One for staking;
- ETH on Arbitrum One for gas;
- the wallet address used as `DEEP_OPERATOR_ADDRESS`;
- the reward recipient used as `DEEP_REWARDS_ADDRESS`.

The operator wallet and reward wallet can be the same address, but they do not have to be.

