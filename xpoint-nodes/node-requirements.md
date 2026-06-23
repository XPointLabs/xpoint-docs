---
icon: clipboard-check
---

# Node requirements

## Host

Recommended production starting point:

| Resource | Minimum starting point |
| --- | --- |
| CPU | 2 vCPU |
| RAM | 4 GB |
| Disk | 60 GB SSD |
| OS | Ubuntu 22.04 LTS or newer |
| Runtime | Docker Engine with Compose plugin |
| Architecture | linux/amd64 or linux/arm64 |

Increase disk and memory as storage traffic grows. Monitor the storage sidecar volume and container restart count.

## Network

Required:

- Stable public IP or DNS name.
- Inbound TCP `443` to the Xray/VLESS transport.
- Private API reachability for `xnode` port `8080`.
- Private storage sidecar reachability for port `22021` if accessed outside the Compose network.
- Outbound HTTPS to registry, staking backend, Arbitrum RPC, and container registry.

Recommended:

- Keep `DEEP_NODE_API_BIND=127.0.0.1:8080`.
- Keep `DEEP_NODE_STORAGE_BIND=127.0.0.1:22021`.
- Expose node RPC and signing endpoints only through a private mesh, VPN, allowlisted reverse proxy, or controlled internal network.

Do not expose the node admin/API port broadly on the public internet.

## Wallet and stake

The operator needs:

- `25,000 XPNT` on Arbitrum One for a single-contributor node;
- ETH on Arbitrum One for gas;
- operator wallet address;
- rewards wallet address;
- access to the XPoint staking portal.

## Secrets

Each node host has unique secrets:

- Ed25519 node identity file: `key_ed25519`;
- BLS private key file: `key_bls`;
- VLESS client UUID;
- Xray Reality private key;
- Xray Reality short ID;
- host-local `.env.node.prod`.

Back up these files securely. Losing node identity files can make a staked node unrecoverable without an exit/re-registration flow.

