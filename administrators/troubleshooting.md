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

Для нового first-release local profile `Config` уже проходит, но `Up/Verify`
на текущей реализации ожидаемо останавливается до запуска контейнеров, если
нет полного production Registry authority package. Это известный release
blocker. Не подставляйте DEV/UAT authority и не отключайте preflight; актуальный
состав незавершённой работы ведётся в
[master sprint](https://github.com/XPointLabs/deep-platform/blob/main/docs/NEXT-SPRINT.md).

## Контейнер запущен, но узел unready

Liveness и readiness проверяют разное: работающий процесс ещё не означает,
что у него есть свежая проверенная сетевая authority. В обновлённом DID2
runtime временный отказ Registry, timeout или истёкшее доказательство оставляет
узел unready; фоновый цикл повторяет получение свежего состояния, учитывая
ограниченный `Retry-After` при 429/503. Health-проверка не расходует клиентский
nonce. Это локально проверенное поведение candidate, а не подтверждение
длительного production recovery или завершённого device E2E.

Проверьте зависимости, актуальность подписанного view и доверенного времени.
Не продлевайте expiry вручную, не удаляйте anti-rollback state и не заменяйте
identity. Повреждение state, fork или несовпадение установленного ключа —
отдельная ошибка, которую повтор сетевого запроса не исправляет.
Технические причины и обязательные fault cases находятся в
[recovery runbook](https://github.com/XPointLabs/deep-devops/blob/main/docs/NETWORK_STABILITY_RECOVERY.md).

В текущем локальном candidate доверенное время получается автоматически от
аутентифицированных источников, а пропущенная история каталога догоняется
порциями с независимой проверкой подписей. Это не повод удалять локальный
floor или переносить DEV trust в production. Для разработки используйте
[единый deep-dev стенд](https://github.com/XPointLabs/deep-devops/blob/main/docs/DEEP_DEV.md);
его проверка требует текущего Registry proof и verified ONION-ready всех трёх
нод. Обычный `healthy` в Development сам по себе этого не подтверждает.
Короткие stop/start и >64-head catch-up проверены, но длительный soak,
неограниченная ротация ключей и доставка сообщений на устройствах ещё не закрыты.

## Ingress не запускается

Типовые причины: неверный SAN, cert/key mismatch, одинаковые current/next keys, неверный SPKI input, слишком широкий coordinator CIDR или stale preflight attestation. Исправьте material и заново создайте `ingress-preflight`; не обходите dependency condition.

## Узел не виден в registry/portal

Проверьте xnode readiness и heartbeat logs, соответствие Ed25519 public key файлу identity, BLS key, public endpoint, registry URL и staking projection. Heartbeat не делает узел active on-chain: после открытия onboarding нужна подтверждённая регистрационная транзакция и indexer ingestion.

## Клиенты видят TLS-ошибку после renewal

Сначала проверьте обслуживаемую цепочку, hostname, часы, OCSP/CRL и reload процесса. Не добавляйте статический file/registry pin в приложение. Для node ingress отдельно проверьте current/next topology generation и ingress attestation.

## Вызовы не соединяются

Для нового release profile сначала проверьте доставку typed call events через
обычный XPoint message path, актуальность signed media-relay catalog, relay-only
ICE и выбранный masked UDP/TCP carrier. Packet capture не должен показывать
public STUN, direct peer candidate, Registry call inbox или direct TURN origin.

Если проверяется только legacy UAT, `/api/calls/` должен быть направлен в
registry, readiness — `ready`, unsigned запросы — `401`, а coturn secret/ports
и relay range — доступны. Успех этого legacy path не является release evidence
нового поколения.

## Физический тест не видит Android

Сверьте `adb devices -l`, выберите один точный serial и устраните duplicate USB/Wi‑Fi connection. USB-управление не заменяет доказательство Wi‑Fi/Bluetooth transport. Устройство должно быть API 28 или новее.

## UAT база не читается

Ошибка SQLCipher `file is not a database`/wrong key означает mismatch owned UAT DB и SecureStorage key. Используйте только явный UAT reset runner, который проверяет пути и package. Не удаляйте production data и не очищайте общий SecureStorage-файл целиком.
