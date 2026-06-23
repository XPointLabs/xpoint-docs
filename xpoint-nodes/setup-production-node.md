---
icon: terminal
---

# Production node setup

This guide describes the manual production path for one XPoint node host.

Run the same process on every node host. Each host must have unique Ed25519 identity, BLS identity, VLESS UUID, Reality key pair, public DNS/IP, and persistent storage volumes.

## 1. Install Docker

Ubuntu example:

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker "$USER"
newgrp docker
docker version
docker compose version
```

## 2. Create the node directory

```bash
sudo mkdir -p /opt/xpoint/node
sudo chown "$USER":"$USER" /opt/xpoint/node
cd /opt/xpoint/node
```

## 3. Authenticate to XPointLabs

If `deep-devops` or the container images are private, the node host needs read access.

Use a deploy key, machine user, or short-lived token with the minimum required permissions:

- repository read access for `XPointLabs/deep-devops`;
- `read:packages` for GHCR images.

GHCR login example:

```bash
export GITHUB_USER=<github-user-or-machine-user>
export GHCR_TOKEN=<token-with-read-packages>
echo "$GHCR_TOKEN" | docker login ghcr.io -u "$GITHUB_USER" --password-stdin
```

Do not put GitHub or GHCR tokens in `.env.node.prod`.

## 4. Download the production compose files

Recommended private-repo path:

```bash
git clone https://github.com/XPointLabs/deep-devops.git /tmp/deep-devops
cp /tmp/deep-devops/docker-compose.node.prod.yml .
cp /tmp/deep-devops/.env.node.prod.example ./.env.node.prod
mkdir -p scripts secrets
cp /tmp/deep-devops/scripts/new-xnode-identity.mjs ./scripts/new-xnode-identity.mjs
```

Authenticated raw download alternative:

```bash
export GITHUB_TOKEN=<token-with-repo-read-access>
curl -fsSL -H "Authorization: Bearer $GITHUB_TOKEN" \
  -o docker-compose.node.prod.yml \
  https://raw.githubusercontent.com/XPointLabs/deep-devops/main/docker-compose.node.prod.yml
curl -fsSL -H "Authorization: Bearer $GITHUB_TOKEN" \
  -o .env.node.prod \
  https://raw.githubusercontent.com/XPointLabs/deep-devops/main/.env.node.prod.example
mkdir -p scripts secrets
curl -fsSL -H "Authorization: Bearer $GITHUB_TOKEN" \
  -o scripts/new-xnode-identity.mjs \
  https://raw.githubusercontent.com/XPointLabs/deep-devops/main/scripts/new-xnode-identity.mjs
```

PowerShell from a Windows administration workstation with Git credentials already configured:

```powershell
New-Item -ItemType Directory -Force C:\xpoint\node\scripts, C:\xpoint\node\secrets | Out-Null
Set-Location C:\xpoint\node
git clone https://github.com/XPointLabs/deep-devops.git $env:TEMP\deep-devops
Copy-Item $env:TEMP\deep-devops\docker-compose.node.prod.yml .
Copy-Item $env:TEMP\deep-devops\.env.node.prod.example .env.node.prod
Copy-Item $env:TEMP\deep-devops\scripts\new-xnode-identity.mjs scripts\new-xnode-identity.mjs
```

## 5. Generate node identity files

Install Node.js if it is not already present. Then generate the XPoint node identity:

```bash
node ./scripts/new-xnode-identity.mjs --as-env --out-dir ./secrets
chmod 600 ./secrets/key_ed25519 ./secrets/key_bls
```

The script prints values similar to:

```bash
DEEP_NODE_ED25519_PUBLIC_KEY=<64-hex-public-key>
DEEP_NODE_ED25519_PRIVATE_KEY_FILE=/opt/xpoint/node/secrets/key_ed25519
DEEP_NODE_BLS_PRIVATE_KEY_FILE=/opt/xpoint/node/secrets/key_bls
DEEP_NODE_VLESS_CLIENT_ID=<uuid>
```

Copy the printed values into `.env.node.prod`.

Do not paste private key material directly into `.env.node.prod`. The production compose file mounts `key_ed25519` and `key_bls` as Docker secrets.

## 6. Generate Xray Reality keys

Use the final image to generate a Reality key pair:

```bash
docker run --rm --entrypoint xray ghcr.io/xpointlabs/xnode:latest x25519
openssl rand -hex 8
```

Put the generated values into:

```bash
DEEP_NODE_REALITY_PUBLIC_KEY=<xray-public-key>
DEEP_NODE_REALITY_PRIVATE_KEY=<xray-private-key>
DEEP_NODE_REALITY_SHORT_ID=<8-byte-hex>
```

Use a unique short ID for every host.

## 7. Fill `.env.node.prod`

Required production values:

```bash
XNODE_IMAGE=ghcr.io/xpointlabs/xnode:latest
DEEP_STORAGE_SERVICE_IMAGE=ghcr.io/xpointlabs/deep-storage-service:latest
DEEP_NETWORK=mainnet

DEEP_NODE_PUBLIC_HOST=node-1.example.com
DEEP_NODE_PUBLIC_PORT=443
DEEP_NODE_VLESS_BIND=443
DEEP_NODE_API_BIND=127.0.0.1:8080
DEEP_NODE_STORAGE_BIND=127.0.0.1:22021

DEEP_NODE_RPC_ENDPOINT=https://node-1.mesh.example/api/session/rpc
DEEP_NODE_SIGNING_ENDPOINT=https://node-1.mesh.example/api/staking/quorum/sign
DEEP_STORAGE_RPC_URL=http://storage-service:8080
DEEP_PUSH_NOTIFY_URL=https://push.xpoint.example/_compat/push-notify

DEEP_REGISTRY_URL=https://registry.xpoint.example
DEEP_REGISTRY_HEARTBEAT_INTERVAL=00:00:30

DEEP_OPERATOR_ADDRESS=0xYourOperatorWallet
DEEP_REWARDS_ADDRESS=0xYourRewardsWallet
DEEP_OPERATOR_FEE_BPS=0
DEEP_STAKE_ATOMIC=25000000000000

DEEP_ARBITRUM_RPC_URL=https://arb-mainnet.g.alchemy.com/v2/<alchemy-key>
DEEP_ARBITRUM_FALLBACK_RPC_URLS=https://arb1.arbitrum.io/rpc
DEEP_ARBITRUM_CHAIN_ID=42161
DEEP_SERVICE_NODE_REWARDS_ADDRESS=0xc52284b7aBAebbEF7BdE0E1ca8251B44AeA12F5f

DEEP_NODE_ED25519_PUBLIC_KEY=<64-hex-public-key>
DEEP_NODE_ED25519_PRIVATE_KEY_FILE=./secrets/key_ed25519
DEEP_NODE_ED25519_SIGNATURE=
DEEP_NODE_BLS_PRIVATE_KEY_FILE=./secrets/key_bls

DEEP_NODE_VLESS_CLIENT_ID=<uuid>
DEEP_NODE_MASK_DOMAIN=www.microsoft.com
DEEP_NODE_REALITY_SERVER_NAME=www.microsoft.com
DEEP_NODE_REALITY_PUBLIC_KEY=<xray-public-key>
DEEP_NODE_REALITY_PRIVATE_KEY=<xray-private-key>
DEEP_NODE_REALITY_SHORT_ID=<8-byte-hex>
DEEP_NODE_REALITY_FINGERPRINT=chrome
DEEP_NODE_REALITY_SPIDER_X=/
```

### Endpoint guidance

`DEEP_NODE_PUBLIC_HOST:443` is the public VLESS/Reality transport clients use.

`DEEP_NODE_RPC_ENDPOINT` and `DEEP_NODE_SIGNING_ENDPOINT` are service endpoints used by relays, registry, and staking backend. Prefer a private mesh hostname or allowlisted reverse proxy. Do not publish an unauthenticated node API endpoint to the public internet.

If you use a reverse proxy, route these paths to `127.0.0.1:8080` on the node host:

```text
/api/session/rpc
/api/staking/quorum/sign
/health/live
/health/ready
/status
```

Keep the proxy on a private interface or behind an allowlist.

## 8. Validate the compose configuration

```bash
docker compose --env-file ./.env.node.prod -f ./docker-compose.node.prod.yml config --quiet
```

If this command prints nothing and exits successfully, Compose can resolve the file and all required variables.

## 9. Start the node

```bash
docker compose --env-file ./.env.node.prod -f ./docker-compose.node.prod.yml pull
docker compose --env-file ./.env.node.prod -f ./docker-compose.node.prod.yml up -d
docker compose --env-file ./.env.node.prod -f ./docker-compose.node.prod.yml ps
```

## 10. Verify local health

```bash
curl http://127.0.0.1:8080/health/live
curl http://127.0.0.1:8080/health/ready
curl http://127.0.0.1:8080/status
curl http://127.0.0.1:22021/health/ready
curl http://127.0.0.1:22021/stats
```

Expected:

- `xnode` health is ready.
- storage service health is ready.
- `/status` shows the node identity, transport status, and runtime state.
- logs do not show repeated Xray restarts or registry heartbeat failures.

## 11. Verify registry and staking backend visibility

From an operations workstation:

```bash
curl https://registry.xpoint.example/api/nodes
curl https://staking.xpoint.example/obligations
curl https://staking.xpoint.example/exit_liquidation_list
```

Your node should appear in the registry after heartbeat succeeds. It becomes active for staking only after the on-chain staking registration is submitted and indexed.

## 12. Register and stake

Open the staking portal, connect the operator wallet, find the prepared node registration, and stake `25,000 XPNT` or create a multicontributor registration. The portal should use the node registration material published by heartbeat. See [Register and stake a node](register-node.md).
