---
icon: wrench
---

# Troubleshooting

## The node does not appear in the staking portal

Check:

```bash
curl http://127.0.0.1:8080/health/ready
curl http://127.0.0.1:8080/status
docker compose --env-file ./.env.node.prod -f ./docker-compose.node.prod.yml logs --tail 200 xnode
curl https://registry.xpoint.example/api/nodes
```

Likely causes:

- registry URL is wrong;
- heartbeat endpoint is not reachable;
- node Ed25519 public key in `.env.node.prod` does not match `key_ed25519`;
- BLS key file is missing;
- signing endpoint is not reachable by the staking backend;
- node has not published registration material yet.

## Contract call fails with `ContractNotStarted`

`ServiceNodeRewards` has not been started. Manual portal registration requires the contract to be started first. If operations chooses owner-seeded bootstrap, the initial public key list must be seeded before calling `start()`.

## Contract call fails with insufficient BLS signatures

The backend could not collect enough signatures from active obligation-eligible nodes.

Check:

- enough nodes are active on-chain;
- active nodes publish signing endpoints;
- signing endpoints are reachable from staking backend;
- nodes use the expected BLS12-381 keys;
- obligation checks are not excluding the signer set.

## Wallet balance looks wrong

Confirm the wallet is connected to the correct chain and token:

- chain: Arbitrum One;
- XPNT token: `0x63B2cdb8B0d8774F1Fdca91D24803698582a079F`.

The staking portal must display XPNT, not SESH.

## RPC provider key appears in browser tools

This is a deployment bug. Browser code must call:

```bash
NEXT_PUBLIC_RPC_URL_ARB=/api/network/rpc/arbitrum
```

Private RPC URLs belong only in backend-side configuration such as `Contracts__EthereumRpcUrl` or `DEEP_ARBITRUM_RPC_URL`.

