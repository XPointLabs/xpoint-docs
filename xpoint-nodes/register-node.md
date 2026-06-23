---
icon: pen-to-square
---

# Register and stake a node

Node registration is a manual wallet action. Nodes should not self-register automatically on startup.

## Before staking

Confirm:

- the node is running and healthy;
- registry heartbeat is successful;
- the staking backend can see the node's signing endpoint;
- the operator wallet has at least `25,000 XPNT`;
- the operator wallet has ETH on Arbitrum One for gas;
- the staking portal shows the prepared registration for the node;
- `ServiceNodeRewards` has been started if the production flow uses manual portal registration.

## Staking portal flow

1. Open the XPoint staking portal.
2. Connect the operator wallet.
3. Open node registration or prepared registrations.
4. Select the node with the expected Ed25519 public key and BLS public key.
5. Review operator fee, rewards address, and stake amount.
6. Approve XPNT spending if the wallet asks for token allowance.
7. Submit the staking transaction.
8. Wait for Arbitrum confirmation and indexer ingestion.
9. Verify the node appears as active.

## Single contributor

For a single-contributor node, the operator stakes the full requirement:

```text
25,000 XPNT
25000000000000 atomic units
```

## Multicontributor

The production contract supports up to `10` contributors per node. Multicontributor flow must still meet the full staking requirement before the node can become active.

## After registration

Check:

```bash
curl https://staking.xpoint.example/obligations
curl https://registry.xpoint.example/api/nodes
```

The node must be:

- present in registry heartbeat;
- present on-chain;
- active in indexed contract state;
- obligation-eligible for rewards and lifecycle signatures.

