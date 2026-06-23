---
icon: circle-nodes
---

# Centralization boundaries

This page is deliberately explicit. XPoint should not present operated infrastructure as more decentralized than it is.

## Decentralized or on-chain authoritative

- XPNT token on Arbitrum One.
- Service-node staking, contributors, exit requests, and reward state in Arbitrum contracts.
- Active service-node BLS12-381 quorum signatures.
- Signed node relay contacts.
- Client multi-hop message routing.
- Node-local storage sidecars.

## Centralized or operated by XPoint

- Registry API and bootstrap/control-plane cache.
- Staking backend, chain indexer, reward checkpoint keeper, and price endpoint.
- Staking portal and public DNS endpoints.
- File/avatar infrastructure.
- Push notification bridge.
- Container registry, CI/CD, observability, alerting, incident response, and release evidence.
- Contract ownership until final multisig/governance ownership is completed.

## Why the registry is not the staking authority

The registry publishes transport metadata and health information. It is not the final authority for active membership. The staking backend must derive active signer sets from chain state and use registry endpoints only to find the currently advertised signing address for a chain-active node.

## Next decentralization targets

The next practical decentralization target is replacing centralized bootstrap cache dependency with node-network discovery or gossip while keeping the mobile push bridge centralized by platform necessity.

