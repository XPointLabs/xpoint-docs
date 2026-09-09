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

## Сетевой контур

Compose публикует только `ingress:443`. Публичный message API содержит единственный `POST /api/ingress/v1/frame`; direct MAU2 и Session RPC отсутствуют. Внутренний `POST /api/peer/privacy/v1/frame`, остальные xnode API, Xray container port и storage не имеют host publisher. HAProxy разделяет точный HTTPS SNI и Reality SNI, удаляет входные `Forwarded` headers и пропускает только allowlisted routes. Quorum-signing endpoint ограничен coordinator `/32`.

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
