---
icon: server
---

# Развёртывание узла XPoint

Production node compose находится в `deep-devops/docker-compose.node.prod.yml`.
Это целевой поддерживаемый путь; отдельные вручную запущенные Xray, storage или
xnode не образуют проверенную production topology. Public onboarding ещё не
открыт, а локальный first-release stack пока не запускается без полной Registry
authority closure, поэтому этот раздел не является объявлением deploy-ready
версии.

## Базовые требования

- Linux host с Docker Engine и Compose plugin;
- стабильный публичный IPv4/DNS;
- TCP 443 снаружи;
- 2 vCPU, 4 GB RAM и 60 GB SSD как начальная, а не гарантированная ёмкость;
- outbound HTTPS к registry, staking backend, RPC и container registry;
- ETH для gas и XPNT для стейкинга после открытия production onboarding.

Наращивайте диск и память по метрикам storage; фиксированный минимум не является capacity plan.

## Уникальные secrets узла

- Ed25519 identity: `key_ed25519`;
- независимый X25519 private key для privacy routing (не конвертируется из Ed25519);
- BLS12-381 private key: `key_bls`;
- VLESS client UUID;
- Reality key pair и short ID;
- TLS current/next certificate material для ingress-профиля;
- host-local `.env.node.prod` и backend RPC credential.

Файлы ключей хранятся вне Git с owner-only permissions. Не размещайте private key bytes непосредственно в env или CI artifacts.

## Подготовка

```bash
git clone https://github.com/XPointLabs/deep-devops.git /opt/xpoint/deep-devops
cd /opt/xpoint/deep-devops
cp .env.node.prod.example .env.node.prod
mkdir -p secrets/ingress
node ./scripts/new-xnode-identity.mjs --as-env --out-dir ./secrets
chmod 600 ./secrets/key_ed25519 ./secrets/key_x25519 ./secrets/key_bls
```

Скопируйте только выведенные public/config values в `.env.node.prod`. Reality key pair создавайте штатным Xray той же pinned версии/образа, который будет запущен.

Для DID2-кандидата используйте поддерживаемый `xpoint-node-installer` версии
0.8.1: сначала подготовка с `--no-start`, затем регистрация и получение
проверенного набора подписанных сетевых входов. Для существующего узла
`--did2-runtime-dir DIR` выбирает такой набор только после проверки сохранённой
identity, public trust anchors и certificate/key/pin bindings. Без него запуск
блокируется; public onboarding пока не открыт. Инструменты требуют Node.js 22+
или используют официальный Node.js 24 Docker image, закреплённый digest.
Контейнер проверки работает без сети с ограниченными mounts; системный Node.js
и package repositories не заменяются. Первый pull требует доступа к registry.
Активирующий запуск installer пересоздаёт service containers, чтобы изменения
смонтированных scripts/templates вступили в силу даже при прежнем image digest.
Volumes и ключи сохраняются; планируйте окно перезапуска.

Выбранные входы сохраняются в отдельной неизменяемой версии. Зарегистрированные
Ed25519/BLS ключи, Reality credentials и существующий volume состояния узла
не заменяются. Диагностическое состояние не переносится в volume, а несовместимое
защищённое состояние не удаляется для обхода ошибки. Повторный запуск сохраняет
выбор, штатный rollback восстанавливает прежнюю конфигурацию. Это не гарантирует
совместимость бинарника до clean break: старую V1-версию нельзя считать рабочим
rollback-кандидатом для DID2. Защищённые floors и history при откате не сбрасывают.

Текущий набор выбирает диагностический software profile `UAT`, но seed-машины
являются production, а не отдельным UAT-стендом. Это разрешённое владельцем
pre-release тестирование, не подтверждение готовности для пользователей.
Полный цикл сообщений, вложений и групп должен быть проверен физически на
Windows и Android до публикации релиза.

## Сетевой контур

Compose публикует только `ingress:443`. Публичный message API содержит единственный `POST /api/ingress/v1/frame`; direct MAU2 и Session RPC отсутствуют. Аутентифицированные privacy-peer и DID2 replica операции доступны через allowlist HTTPS ingress; выделенные HTTP2 backend-порты, остальные xnode API, Xray container port и storage не имеют host publisher. HAProxy разделяет точный HTTPS SNI и Reality SNI, удаляет входные `Forwarded` headers и пропускает только allowlisted routes. Quorum-signing endpoint ограничен coordinator `/32`.

Это описывает node-side topology. Текущий MAUI mailbox client ещё не направляет
frame через Reality/VLESS и использует direct HTTPS entry origin. До
client-binding и physical anti-blocking gate развёрнутый узел нельзя считать
доступным широкому кругу клиентов или готовым on-prem messenger profile.

Каждый узел должен иметь подписанный privacy contact и authority остальных допустимых peers: RouterId, внутренний peer origin, независимый X25519 public key и exact capability `privacy-routing-v1`. Повторяющиеся identity/key, неизвестный peer, неверная подпись или неканонический endpoint останавливают маршрут fail-closed.

## Preflight и запуск

```bash
node ./scripts/production-ingress-contracts.mjs
docker compose --env-file ./.env.node.prod \
  -f ./docker-compose.node.prod.yml config --quiet
docker compose --env-file ./.env.node.prod \
  -f ./docker-compose.node.prod.yml up -d --wait
docker compose --env-file ./.env.node.prod \
  -f ./docker-compose.node.prod.yml ps
```

Ingress запускается только после networkless certificate/key/profile preflight. Отсутствующий SAN, несовпадающий ключ, неверный SPKI input, слишком широкая coordinator network или устаревшая attestation останавливают запуск.

## Регистрация и стейкинг

Узел публикует heartbeat и подписанный registration material, но не выполняет on-chain staking автоматически. Оператор должен:

1. сверить Ed25519/BLS identities и публичный endpoint;
2. дождаться prepared registration в portal;
3. подключить правильный wallet/network;
4. проверить stake, fee и rewards address;
5. вручную подтвердить allowance и registration transaction;
6. дождаться indexer projection и obligation eligibility.

Текущая production onboarding ещё не открыта; параметры контрактов приведены для проверки, а не как приглашение переводить средства.
