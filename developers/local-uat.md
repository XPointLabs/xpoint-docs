---
icon: flask
---

# Local UAT environment

The current UAT environment runs on the development workstation at LAN IP `192.168.1.44`.

## Services

UAT Docker Compose starts:

- 3 XPoint router nodes;
- registry API;
- staking backend;
- chain indexer;
- reward keeper;
- staking portal;
- storage, file, push, and calls compatibility services.

## Start UAT

From `C:\Work\DeepSession\XPointLabs\deep-devops`:

```powershell
docker compose --env-file .\.env.uat -f .\docker-compose.uat.yml up -d --build --wait
docker compose --env-file .\.env.uat -f .\docker-compose.uat.yml ps
```

Portal:

```text
http://192.168.1.44:28083
```

Registry:

```text
http://192.168.1.44:28080
```

Staking backend:

```text
http://192.168.1.44:28082
```

## UAT RPC security

The portal must not expose Alchemy or any private provider token. UAT should use:

```bash
UAT_BROWSER_ARBITRUM_RPC_URL=/api/network/rpc/arbitrum
ARB_SEPOLIA_RPC_URL=https://arb-sepolia.g.alchemy.com/v2/<alchemy-key>
ARB_SEPOLIA_FALLBACK_RPC_URLS=https://sepolia-rollup.arbitrum.io/rpc
```

Browser traffic goes through the staking backend RPC proxy.

## UAT chain

- Chain: Arbitrum Sepolia.
- Chain ID: `421614`.
- Fallback RPC: `https://sepolia-rollup.arbitrum.io/rpc`.

Use UAT only for QA and local-lan validation. Production node setup uses Arbitrum One.

