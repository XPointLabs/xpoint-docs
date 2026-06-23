---
icon: server
---

# Run an XPoint Node

An XPoint node routes encrypted client traffic, publishes signed transport metadata, stores encrypted message state through a sidecar service, and participates in staking BLS quorum messages.

## Node components

- `xnode`: ASP.NET Core service that owns routing, heartbeat, bootstrap, Session RPC, and BLS signing endpoints.
- Xray: VLESS/Reality ingress transport used by clients.
- Storage sidecar: node-local encrypted message storage service.
- Docker Compose: production deployment shape for one node host.

## Operator flow

1. Prepare a Linux host with Docker.
2. Generate node Ed25519 and BLS identity files.
3. Generate Xray Reality keys.
4. Configure `.env.node.prod`.
5. Start `docker-compose.node.prod.yml`.
6. Verify health endpoints and registry heartbeat.
7. Stake `25,000 XPNT` or create a multicontributor registration through the staking portal.
8. Monitor logs, storage health, and staking obligation status.

Start with [Node requirements](node-requirements.md), then follow [Production node setup](setup-production-node.md).

