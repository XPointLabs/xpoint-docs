---
icon: file-contract
---

# Контракты Arbitrum One

Контракты текущей baseline были развёрнуты 22 июня 2026 года. Перед эксплуатационной операцией сверяйте адреса с deployment manifest репозитория `xpoint-staking-contracts` и непосредственно с chain explorer.

## Сеть

| Поле | Значение |
| --- | --- |
| Chain ID | `42161` |
| Start block | `476121260` |
| Owner/deployer snapshot | `0x62174f6e6a25E7D8135Bd172C1053D7ABd7D2750` |
| XPNT | `0x63B2cdb8B0d8774F1Fdca91D24803698582a079F` |

## Адреса

| Контракт | Адрес |
| --- | --- |
| XPNT token | `0x63B2cdb8B0d8774F1Fdca91D24803698582a079F` |
| RewardRatePool proxy | `0xEd894fb5f0BA3b141A562190D4c9941FEd348356` |
| ServiceNodeRewards proxy | `0xc52284b7aBAebbEF7BdE0E1ca8251B44AeA12F5f` |
| ServiceNodeContributionFactory proxy | `0x289d88A8C06881634Fb619Ec528361C7b88521f1` |
| RewardRatePool implementation | `0x6fc2A62B8a3A24E531F66A678FF2f0BEc86Ca5B5` |
| ServiceNodeRewards implementation | `0x12EB6963deA94CC253136854DbbEFC9E7464118f` |
| ServiceNodeContribution implementation | `0xd6af6Beb0d19396932e25429aF1828798a68c3EE` |
| ServiceNodeContributionFactory implementation | `0x98Fc499C1d09e4263379c017c97f48e2187FB868` |

## Экономические параметры deployment baseline

| Поле | Значение |
| --- | --- |
| Stake | `25 000 XPNT` / `25000000000000` atomic |
| Reward pool initial deposit | `40 000 000 XPNT` |
| Max contributors | `10` |
| Liquidation split | `3 / 17 / 9980` |

Доли liquidation соответствуют `0,03%` liquidator, `0,17%` reward pool и `99,8%` recipient/stakers.

## Важная оговорка о состоянии

Post-deployment snapshot фиксировал `ServiceNodeRewards.isStarted=false` и `totalNodes=0`. Это историческое состояние артефакта, а не гарантия текущего on-chain state. Перед открытием onboarding operations обязаны заново прочитать contract state и зафиксировать выбранный bootstrap flow и ownership/multisig evidence.
