---
icon: user-gear
---

# Руководство администратора

Этот раздел описывает предрелизную эксплуатационную baseline. Production ещё не открыт, поэтому запрещено заменять недостающие release evidence ручным исключением, временным HTTP или ослаблением проверки сертификата.

## Зоны ответственности

| Компонент | Источник реализации | Ответственность |
| --- | --- | --- |
| MAUI client | `deep-client-maui` | UI, platform integration, release composition |
| Client domain | `deep-client-shared` | сообщения, outbox, файлы, звонки, persistence |
| Protocol | `deep-protocol` | wire formats и криптографические контракты |
| Registry | `deep-registry-api` | nodes, signed membership/mailbox/network/media policy; legacy call signaling/ICE удаляется при clean-break cutover |
| XPoint node | `xnode` | route ingress, relay, storage dispatch, heartbeat, quorum signing |
| Staking | `xpoint-staking-*` | контракты, indexer/backend, portal |
| Deployment | `deep-devops` | Compose, TLS, gates, evidence, recovery |
| Physical E2E | `deep-client-maui/eng` и UI tests | Android/Windows UAT, reset, payload, calls, restart/chaos |

## Обязательные принципы

- один и тот же production transport path проверяется в UAT без HTTP-компромиссов;
- secrets не коммитятся, не печатаются и не попадают в артефакты;
- release endpoint не использует permissive TLS callback;
- health endpoint не публикуется там, где достаточно внутренней проверки;
- состояние registry не является источником истины для on-chain membership;
- тестовая очистка затрагивает только отдельный UAT package/data root;
- после работы Compose teardown и git worktrees должны быть проверены явно.

Начните с [локального физического UAT](uat.md) или [развёртывания узла](node.md).
