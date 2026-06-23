---
icon: rotate
---

# Upgrade, backup, and recovery

## Upgrade

Pull and restart the node:

```bash
cd /opt/xpoint/node
docker compose --env-file ./.env.node.prod -f ./docker-compose.node.prod.yml pull
docker compose --env-file ./.env.node.prod -f ./docker-compose.node.prod.yml up -d
docker compose --env-file ./.env.node.prod -f ./docker-compose.node.prod.yml ps
```

Check health immediately after restart:

```bash
curl http://127.0.0.1:8080/health/ready
curl http://127.0.0.1:22021/health/ready
```

## Backup

Back up:

- `.env.node.prod`;
- `secrets/key_ed25519`;
- `secrets/key_bls`;
- Xray Reality values;
- Docker volumes `xnode-state`, `xnode-config`, and `node-storage-state`;
- reverse proxy or private mesh configuration.

Recommended backup pattern:

```bash
cd /opt/xpoint
tar --numeric-owner -czf xpoint-node-secrets-$(date +%Y%m%d).tgz node/.env.node.prod node/secrets
docker run --rm \
  -v deep-node-prod_xnode-state:/from:ro \
  -v "$PWD":/backup \
  alpine tar -czf /backup/xnode-state-$(date +%Y%m%d).tgz -C /from .
docker run --rm \
  -v deep-node-prod_node-storage-state:/from:ro \
  -v "$PWD":/backup \
  alpine tar -czf /backup/node-storage-state-$(date +%Y%m%d).tgz -C /from .
```

Encrypt backups before moving them off the host.

## Recovery on a replacement host

1. Install Docker.
2. Restore `/opt/xpoint/node/.env.node.prod`.
3. Restore `secrets/key_ed25519` and `secrets/key_bls`.
4. Restore Docker volumes if available.
5. Start Compose.
6. Verify health and registry heartbeat.
7. Confirm the staking backend sees the same Ed25519 and BLS identities.

Do not generate new node identity keys for a staked node unless you intentionally plan to exit and register a new node.

