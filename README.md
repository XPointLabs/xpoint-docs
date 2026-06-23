---
icon: shield-check
cover: .gitbook/assets/xpoint-cover.png
coverY: 0
---

# XPoint Network Docs

XPoint Network is the node, staking, and transport layer for the Deep messenger ecosystem. The network combines Session-style private message routing with XPNT staking on Arbitrum, BLS12-381 quorum signatures, node-local storage sidecars, and production-oriented Docker deployment.

The documentation in this repository is written for node operators, stakers, infrastructure engineers, and developers who need to understand how XPoint works and how to run it safely.

## Start here

| Goal | Page |
| --- | --- |
| Understand the network | [XPoint Network](xpoint-network/README.md) |
| Review the production contracts | [XPNT and staking contracts](xpoint-token/contracts.md) |
| Run a production node | [Production node setup](xpoint-nodes/setup-production-node.md) |
| Register and stake a node | [Register a node](xpoint-nodes/register-node.md) |
| Start local UAT | [Local UAT environment](developers/local-uat.md) |
| See what remains centralized | [Centralization boundaries](xpoint-network/centralization-boundaries.md) |

## Current production baseline

- Chain: Arbitrum One, chain ID `42161`.
- Token: XPNT at `0x63B2cdb8B0d8774F1Fdca91D24803698582a079F`.
- Staking requirement: `25,000 XPNT`.
- Service-node quorum crypto: `BLS12-381`.
- Node runtime: `xnode` with Session-compatible routing semantics and VLESS/Xray ingress.
- Storage model: per-node storage sidecar for message storage state.
- Push delivery: centralized provider bridge because mobile platforms depend on FCM, APNs, or Huawei gateways.

## Repository model

This portal follows the same lightweight GitBook-compatible shape as the official Session docs reference: `README.md`, `SUMMARY.md`, and a Markdown documentation tree. The text, branding, architecture, contract addresses, and operator flow are XPoint-specific.

