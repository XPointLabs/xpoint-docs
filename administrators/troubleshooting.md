---
icon: screwdriver-wrench
---

# Диагностика инфраструктуры

## Compose не выходит в healthy

```bash
docker compose --env-file ./.env.node.prod -f ./docker-compose.node.prod.yml config --quiet
docker compose --env-file ./.env.node.prod -f ./docker-compose.node.prod.yml ps
docker compose --env-file ./.env.node.prod -f ./docker-compose.node.prod.yml logs --tail 300
```

Проверьте exact required env, secret file permissions, image availability, DNS и внутренние dependency health. Не удаляйте volume до снятия безопасной копии и определения владельца данных.

## Ingress не запускается

Типовые причины: неверный SAN, cert/key mismatch, одинаковые current/next keys, неверный SPKI input, слишком широкий coordinator CIDR или stale preflight attestation. Исправьте material и заново создайте `ingress-preflight`; не обходите dependency condition.

## Узел не виден в registry/portal

Проверьте xnode readiness и heartbeat logs, соответствие Ed25519 public key файлу identity, BLS key, public endpoint, registry URL и staking projection. Heartbeat не делает узел active on-chain: после открытия onboarding нужна подтверждённая регистрационная транзакция и indexer ingestion.

## Клиенты видят TLS-ошибку после renewal

Сначала проверьте обслуживаемую цепочку, hostname, часы, OCSP/CRL и reload процесса. Не добавляйте статический file/registry pin в приложение. Для node ingress отдельно проверьте current/next topology generation и ingress attestation.

## Вызовы не соединяются

Проверьте, что `/api/calls/` направлен в registry, registry call readiness имеет состояние `ready`, а unsigned signal/inbox/ICE запросы получают `401`. Затем проверьте наличие durable `Calls__StatePath`, доступность файлов `Calls__TurnSharedSecretFile` и `Calls__PushNotifyBearerTokenFile`, ICE URLs, firewall и advertised TURN address. Открыты должны быть `3478/tcp+udp`, `5349/tcp+udp` и relay range `49160–49200/tcp+udp`. После этого отдельно запустите direct ICE и forced relay test; успех signaling не доказывает media path, а Cloud proxy на HTTPS-порту не заменяет TURN listeners.

## Физический тест не видит Android

Сверьте `adb devices -l`, выберите один точный serial и устраните duplicate USB/Wi‑Fi connection. USB-управление не заменяет доказательство Wi‑Fi/Bluetooth transport. Устройство должно быть API 28 или новее.

## UAT база не читается

Ошибка SQLCipher `file is not a database`/wrong key означает mismatch owned UAT DB и SecureStorage key. Используйте только явный UAT reset runner, который проверяет пути и package. Не удаляйте production data и не очищайте общий SecureStorage-файл целиком.
