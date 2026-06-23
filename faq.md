---
icon: circle-question
---

# FAQ

## Is XPoint the same as Session?

No. XPoint preserves important Session-style network behavior where it matters: private routing, signed relay contacts, service-node operation, and storage delivery semantics. XPoint has its own token, staking contracts, branding, deployment tooling, and client implementation.

## Why Arbitrum?

Production staking is deployed on Arbitrum One. Arbitrum supports the BLS12-381 precompiles needed by the current staking signature path.

## Why does the node use Xray/VLESS?

VLESS/Xray is the ingress transport used by XPoint nodes. It is not the application protocol. XPoint keeps Session-compatible routing semantics above the transport layer.

## Can push notifications be decentralized?

Not fully while Android and iOS depend on FCM, APNs, or Huawei push gateways. XPoint can minimize metadata and encrypt payloads, but delivery still crosses provider infrastructure.

## Should a node auto-register itself on-chain?

No. A node publishes registration material and appears in the staking portal. The operator manually stakes and submits the on-chain registration with a wallet.

## Can I use a private Alchemy RPC?

Yes, but only backend-side. Put it in `DEEP_ARBITRUM_RPC_URL`, `Contracts__EthereumRpcUrl`, or the equivalent server-side secret. Do not put it in `NEXT_PUBLIC_*`.

