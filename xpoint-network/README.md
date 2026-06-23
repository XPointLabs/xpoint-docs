---
icon: network
---

# XPoint Network

XPoint Network provides routing, storage, and staking infrastructure for the Deep messenger. It is designed to preserve the important behavior of the Session network model while using XPoint-specific economics, deployment tooling, and transport choices.

The network has four major layers:

1. Client apps build Session-style routes through multiple nodes.
2. XPoint nodes publish signed transport metadata and route encrypted messages.
3. Staking contracts on Arbitrum decide which nodes are active and reward-eligible.
4. Backend control-plane services index chain state, expose bootstrap data, and coordinate operational checks.

## What is decentralized

- Node membership and stake state are anchored in Arbitrum contracts.
- Active nodes produce BLS12-381 signatures for reward, exit, and liquidation messages.
- Clients route messages through multi-hop paths instead of talking directly to a single central service.
- Storage state is attached to node infrastructure rather than one global storage database.

## What is operated infrastructure

The registry API, staking backend, chain indexer, staking portal, DNS, observability, push bridge, and public bootstrap endpoints are operated services. These services make the network usable and observable, but they should not be treated as the authority for staking membership when an on-chain source of truth exists.

Read [Centralization boundaries](centralization-boundaries.md) for the explicit list.

