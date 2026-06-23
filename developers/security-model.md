---
icon: user-shield
---

# Security model

## Node identities

Every node has two important identities:

- Ed25519 identity: node/router identity used for signed relay contacts.
- BLS12-381 identity: staking quorum identity used for registration proof and lifecycle signatures.

Production nodes load private keys from files mounted as Docker secrets. Do not pass private key material directly as environment variables in production.

## RPC provider tokens

Provider tokens such as Alchemy keys must remain backend-only.

Allowed:

- `.env.node.prod` on a server;
- secret store;
- backend service environment;
- CI/CD secret.

Not allowed:

- `NEXT_PUBLIC_*`;
- committed `.env` files;
- static frontend bundles;
- screenshots or logs shown to users.

## Frontend blockchain access

The staking portal should call a same-origin proxy:

```bash
/api/network/rpc/arbitrum
```

The backend proxy forwards to private primary RPC and public fallback RPC.

## BLS quorum path

Reward, exit, and liquidation signatures must come from active obligation-eligible nodes. UAT and production should share this architecture.

## Push notifications

Push providers are centralized by platform design. Payloads should remain encrypted and metadata should be minimized, but provider gateways cannot be removed while mobile operating systems require them.

