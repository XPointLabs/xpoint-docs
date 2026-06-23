---
icon: database
---

# Storage, files, avatars, and push

XPoint has different decentralization levels for different data paths.

## Message storage

Message storage is served by a storage sidecar next to each node. The XPoint node runtime can route final encrypted envelopes to that sidecar. Operators should treat the storage volume as production node state.

The storage sidecar stores encrypted payloads. It must not require plaintext access to messages.

## Files and avatars

File and avatar infrastructure remains operated infrastructure. Clients upload encrypted file payloads and share references through the messaging layer. The file service should be monitored and scaled separately from node routing.

## Push notifications

Push notifications are centralized by platform necessity:

- Android depends on FCM or Huawei delivery paths.
- iOS depends on APNs.
- Device tokens are issued by platform push providers.

XPoint can minimize metadata and keep push payloads encrypted, but mobile OS push gateways cannot be fully decentralized while the target platforms require provider delivery.

## Operator responsibility

Node operators are responsible for:

- keeping node and storage containers running;
- protecting identity keys;
- preserving storage sidecar volumes;
- keeping the public transport endpoint reachable;
- keeping private RPC/signing endpoints reachable only by approved network peers and backend services.

