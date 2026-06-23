---
icon: route
---

# Onion routing and message flow

XPoint follows the Session routing model: clients do not submit messages directly to the final storage node. They build a route through several relays and send layered encrypted envelopes through that path.

## Default path model

The production client path is expected to use three distinct XPoint nodes:

1. Entry node: sees the client connection and forwards to the middle node.
2. Middle node: sees only the previous relay and the next relay.
3. Exit node: unwraps the final routing layer and calls the storage RPC sidecar.

Each hop has only the information needed for its own forwarding step. The path selection logic must avoid duplicate relays inside a path and should prefer healthy nodes from the current bootstrap inventory.

## Relay contacts

Every node publishes a signed relay contact through heartbeat. A relay contact includes:

- Ed25519 node/router identity;
- public host and public transport port;
- transport profile, including VLESS/Reality fields;
- RPC endpoint used by other relays for Session RPC;
- capabilities such as `session-rpc`, `client-bootstrap`, and `vless-ingress`;
- signature over the advertised contact data.

Clients should display the actual selected route on the route/path page, not just a generic list of registry nodes.

## Storage delivery

The exit hop sends the final request to storage. In production, storage runs as a per-node sidecar. This keeps message state close to node infrastructure and avoids a single global storage service becoming the routing bottleneck.

## Calls

Voice/video call support is intentionally tracked separately from the message path. Do not infer call readiness from message routing readiness.

