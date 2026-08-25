---
icon: gauge-high
---

# Эксплуатация и резервное копирование

## Ежедневные проверки узла

```bash
docker compose --env-file ./.env.node.prod -f ./docker-compose.node.prod.yml ps
docker compose --env-file ./.env.node.prod -f ./docker-compose.node.prod.yml logs --tail 200 xnode
docker compose --env-file ./.env.node.prod -f ./docker-compose.node.prod.yml logs --tail 200 storage-service
docker compose --env-file ./.env.node.prod -f ./docker-compose.node.prod.yml logs --tail 200 ingress
```

Контролируйте readiness из внутренней сети/контейнера, heartbeat age, registry projection, route success/error rate, storage bytes/messages, disk usage, restart count, TLS expiry и очереди push/calls. Публичные `/status`, `/metrics` и admin endpoints у node ingress должны оставаться закрыты.

## Обновление

1. зафиксируйте текущие image digests и backup IDs;
2. пройдите release/preflight gates;
3. `docker compose pull`;
4. обновляйте контролируемо, сохраняя quorum и route capacity;
5. проверяйте readiness, heartbeat и реальный payload;
6. храните rollback evidence до завершения окна наблюдения.

Не используйте floating `latest` без release manifest, даже если example env содержит его как placeholder.

## Резервная копия узла

Сохраняйте зашифрованно и раздельно:

- проверенную конфигурацию релиза без вынесенных private key bytes;
- Ed25519 identity, отдельный X25519 privacy-routing key, BLS key, VLESS client identity и Reality private/public material;
- ingress certificate profile metadata и protected secret versions;
- Docker volumes `xnode-state`, `xnode-config`, `node-storage-state`;
- подписанные membership/privacy-route artifacts и точные image/config digests;
- reverse proxy/firewall/monitoring configuration;
- последний подтверждённый image/release manifest.

Ed25519, X25519 и BLS — разные ключевые роли. Сохранность Ed25519 не компенсирует утрату X25519: опубликованный privacy-route contact больше не соответствует узлу. Проверяйте восстановление на изолированном host реальным snapshot→restore, сравнением хеша восстановленного дерева и повторным запуском canary-проверок. Для staked node нельзя генерировать новую identity вместо утраченной: это другой узел и требует штатного rotation либо exit/re-registration.

## Registry и staking services

Registry snapshot должен включать основной state и durable `calls-v2` signaling/replay state в том же защищённом volume. Staking backend/indexer state, TURN shared secret, push credentials и signing material имеют отдельные protected backup records. On-chain state остаётся источником истины для membership/rewards, но не восстанавливает автоматически operational state, mailbox credentials, pending encrypted call signals или filesystem snapshots.

## Recovery и rollback drill

Перед snapshot остановите все writers: архив работающей базы не считается согласованной копией. Восстанавливайте snapshot в новый изолированный volume, сравнивайте содержимое и metadata с источником, затем запускайте pinned recovery stack без production DNS, push и signing side effects.

После запуска проверьте неизменность публичных fingerprints Ed25519/X25519/BLS, readiness, извлечение canary message/file по прежнему хешу, registry counters и durable call inbox. Pending encrypted call signal должен выдаваться ровно один раз, а повтор того же signed nonce — отклоняться. Повторите проверки после ещё одного restart.

При rollback старые images разрешено подключать к новому state только при явно доказанной schema compatibility. Иначе восстанавливайте pre-upgrade snapshot вместе с предыдущим manifest и protected-material versions. Empty volume, regenerated identity и legacy reader не являются восстановлением.

## Логи и evidence

Не записывайте recovery phrases, private keys, full credentials, plaintext attachments, full Deep IDs или push tokens. Release evidence должен содержать только schema/tool versions, hashes, timestamps, outcomes и ограниченные counters. Имена volume/container/project, host paths, hostnames, stdout/stderr, raw logs и backup archives в evidence не входят.
