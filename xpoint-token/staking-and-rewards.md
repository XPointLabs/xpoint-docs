---
icon: chart-line
---

# Staking, rewards, exits, and liquidation

XPoint staking follows the service-node model: a node proves it can participate in the network, XPNT is staked to that node, and the active network signs reward or lifecycle messages through a BLS quorum.

## Registration lifecycle

1. The operator starts an XPoint node.
2. The node publishes heartbeat metadata to the registry.
3. The heartbeat includes Ed25519 identity, BLS public key/proof material, public transport data, and a quorum signing endpoint.
4. The staking portal shows the prepared registration.
5. The operator or contributors stake XPNT to the node.
6. The staking transaction registers the node on-chain.
7. The chain indexer marks the node active after the event is indexed.
8. The node becomes reward-eligible when it is active and passes obligation checks.

## Rewards

Reward accounting is anchored in the staking contracts. The staking backend and reward keeper coordinate off-chain operational checks and checkpointing, but the contract state is the source of truth for reward claims.

Active nodes sign reward balance update messages with BLS12-381. The backend must aggregate signatures from the active obligation-eligible signer set.

## Exits

An exit is a lifecycle action for a staked node. The portal requests a BLS-signed exit message before sending the on-chain transaction. If the network does not have enough eligible active signers, the contract call can fail with an insufficient BLS signatures error.

## Liquidation

Liquidation is used when a node fails its service obligations beyond configured grace periods. The backend derives obligations from chain state plus registry heartbeat and transport health. Liquidation messages use the same production BLS quorum path as rewards and exits.

## No UAT-only signer path

Production architecture does not use a special UAT reward signer endpoint. UAT and production should both use the same pattern: active nodes publish signing endpoints, the backend discovers them, and the chain-active obligation-eligible quorum signs messages.

