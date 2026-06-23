---
icon: coins
---

# XPNT Token and Staking

XPNT is the token used to stake XPoint nodes and reward operators for supporting the network. Production staking runs on Arbitrum One.

The staking flow has three parts:

1. A node operator runs an `xnode` host and publishes registration material.
2. The operator or contributors stake XPNT through the staking portal.
3. Active nodes sign reward, exit, and liquidation messages through BLS12-381 quorum signatures.

## Key values

| Item | Value |
| --- | --- |
| Chain | Arbitrum One |
| Chain ID | `42161` |
| XPNT token | `0x63B2cdb8B0d8774F1Fdca91D24803698582a079F` |
| Staking requirement | `25,000 XPNT` |
| Atomic staking requirement | `25000000000000` |
| Max contributors per node | `10` |
| BLS curve | `BLS12-381` |

Read [Production contracts](contracts.md) for the full address table.

