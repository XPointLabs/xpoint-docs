# XPoint documentation agent rules

The workspace rules in `../AGENTS.md` apply.

## Owns

- Published Russian documentation for Deep users, node operators and administrators.
- `SUMMARY.md` navigation, release-readiness statements and static documentation assets.
- Exact user-facing configuration, recovery, security and troubleshooting guidance.

Internal sprint notes, protocol drafts, secret paths/values and unverified product claims do not
belong here. Link to public concepts; keep implementation backlog in `../docs/NEXT-SPRINT.md`.

## Repository rules

- `SUMMARY.md` is the navigation source of truth; every page must be reachable and non-orphaned.
- Describe only implemented behavior. Mark compile-only, UAT-only, disabled and untested features.
- Keep XPoint as one transport option. Direct P2P remains unavailable until its activation gate.
- Public TLS uses platform CA, hostname, validity and revocation checks; never document permissive
  callbacks or static Certbot leaf pins as a requirement.
- Never include credentials, recovery material, private filesystem paths or raw evidence payloads.
- Update user and administrator pages together when behavior/configuration affects both.

## Verify

```powershell
git diff --check
npx honkit build
```

Also verify UTF-8, all relative links, `SUMMARY.md` coverage and rendered Russian text before commit.
