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

- `.env.node.prod` без вынесенных private key bytes;
- `key_ed25519`, `key_bls`, Reality material;
- ingress certificate profile metadata и protected secret versions;
- Docker volumes `xnode-state`, `xnode-config`, `node-storage-state`;
- reverse proxy/firewall/monitoring configuration;
- последний подтверждённый image/release manifest.

Проверяйте восстановление на изолированном host. Для staked node нельзя генерировать новую identity вместо утраченной: это другой узел и требует штатного exit/re-registration.

## Registry и staking services

Registry snapshot, staking backend/indexer state и signing/turn secrets имеют отдельные backup и recovery procedures. On-chain state остаётся источником истины для membership/rewards, но не восстанавливает автоматически operational state, mailbox credentials или filesystem snapshots.

## Логи и evidence

Не записывайте recovery phrases, private keys, full credentials, plaintext attachments, full Deep IDs или push tokens. Release evidence должен содержать hashes, версии, timestamps, outcomes и ограниченные counters, а не секретный payload.
