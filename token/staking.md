---
icon: chart-line
---

# Регистрация, награды и выход

## Регистрация

1. Узел запускается с уникальными Ed25519 и BLS identities.
2. Он публикует подписанный heartbeat и registration material.
3. Registry показывает transport health, а staking backend сверяет on-chain projection.
4. Оператор сверяет identities, endpoint, fee, rewards address и stake.
5. Wallet вручную подтверждает allowance и registration transaction.
6. Indexer фиксирует событие; только затем узел может стать active/obligation-eligible.

Registry cache не может сам добавить узел в on-chain active set.

## Награды

Reward state находится в контрактах. Backend и keeper собирают operational evidence и BLS12-381 quorum signatures только от chain-active obligation-eligible nodes. Специального UAT signer shortcut в production архитектуре нет.

## Выход и liquidation

Exit и liquidation используют подписанный quorum path и on-chain transaction. Недостаточный eligible signer set, устаревшая registry projection или недоступные signing endpoints должны приводить к безопасной ошибке, а не к обходу quorum.

Перед exit учитывайте contract timeouts и текущую документацию контракта. Перед liquidation требуется доказуемое нарушение obligations в пределах настроенных grace periods; одиночный кратковременный heartbeat gap не является достаточным основанием.

## RPC и wallet security

Private RPC provider keys остаются на backend:

```text
NEXT_PUBLIC_RPC_URL_ARB=/api/network/rpc/arbitrum
Contracts__EthereumRpcUrl=<backend-only-url>
Contracts__EthereumFallbackRpcUrls=https://arb1.arbitrum.io/rpc
```

Никогда не помещайте Alchemy/Infura tokens в `NEXT_PUBLIC_*`, frontend bundle, Git, screenshot или release evidence.
