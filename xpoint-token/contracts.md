---
icon: file-contract
---

# Production contracts

Production staking contracts were deployed on Arbitrum One on 2026-06-22.

## Network

| Field | Value |
| --- | --- |
| Network | Arbitrum One |
| Chain ID | `42161` |
| Start block | `476121260` |
| Owner / deployer | `0x62174f6e6a25E7D8135Bd172C1053D7ABd7D2750` |
| XPNT token | `0x63B2cdb8B0d8774F1Fdca91D24803698582a079F` |

## Contract addresses

| Contract | Address |
| --- | --- |
| XPNT token | `0x63B2cdb8B0d8774F1Fdca91D24803698582a079F` |
| RewardRatePool proxy | `0xEd894fb5f0BA3b141A562190D4c9941FEd348356` |
| ServiceNodeRewards proxy | `0xc52284b7aBAebbEF7BdE0E1ca8251B44AeA12F5f` |
| ServiceNodeContributionFactory proxy | `0x289d88A8C06881634Fb619Ec528361C7b88521f1` |
| RewardRatePool implementation | `0x6fc2A62B8a3A24E531F66A678FF2f0BEc86Ca5B5` |
| ServiceNodeRewards implementation | `0x12EB6963deA94CC253136854DbbEFC9E7464118f` |
| ServiceNodeContribution implementation | `0xd6af6Beb0d19396932e25429aF1828798a68c3EE` |
| ServiceNodeContributionFactory implementation | `0x98Fc499C1d09e4263379c017c97f48e2187FB868` |

## Economic parameters

| Field | Value |
| --- | --- |
| Staking requirement | `25,000 XPNT` |
| Atomic staking requirement | `25000000000000` |
| Reward pool initial deposit | `40,000,000 XPNT` |
| Atomic reward pool deposit | `40000000000000000` |
| Max contributors | `10` |
| Liquidation split | `3 / 17 / 9980` |

Liquidation split interpretation:

- `3`: liquidator share, `0.03%`.
- `17`: reward pool share, `0.17%`.
- `9980`: recipient and staker share, `99.8%`.

## Backend configuration

```bash
Contracts__TokenAddress=0x63B2cdb8B0d8774F1Fdca91D24803698582a079F
Contracts__ServiceNodeRewardsAddress=0xc52284b7aBAebbEF7BdE0E1ca8251B44AeA12F5f
Contracts__ServiceNodeContributionFactoryAddress=0x289d88A8C06881634Fb619Ec528361C7b88521f1
Contracts__RewardRatePoolAddress=0xEd894fb5f0BA3b141A562190D4c9941FEd348356
Contracts__StakingRequirementAtomic=25000000000000
Registry__StakingRequirementAtomic=25000000000000
```

## Important state

The committed post-deployment snapshot recorded `ServiceNodeRewards.isStarted=false` and `ServiceNodeRewards.totalNodes=0`. Before onboarding production nodes, operations must choose the bootstrap flow:

- owner-seeded initial node list while `isStarted == false`, then call `start()`;
- or manual staking portal registration after `start()` is called.

Subscription contracts were intentionally not deployed in this staking deployment.

