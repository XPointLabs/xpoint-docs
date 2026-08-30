---
icon: certificate
---

# TLS и публичные сервисы

## Публичные CA-managed сервисы

Registry, file, push и staking API/portal должны обслуживаться по HTTPS с сертификатом публично доверенной CA, точным SAN/hostname, актуальным сроком и рабочим renewal. Клиенты используют системный TLS validator. В целевом clean-break release call signaling не является отдельным Registry HTTPS API.

Для Certbot-managed endpoints статические `DEEP_TLS_PUBLIC_KEY_PINS` и `DEEP_FILE_TLS_PUBLIC_KEY_PINS` не являются поддерживаемой моделью: смена ключа при штатном renewal не должна отключать все клиенты. Удаление pinning не разрешает permissive validation.

После renewal проверяйте:

```bash
openssl s_client -connect registry.example:443 -servername registry.example \
  -verify_return_error </dev/null
curl --fail https://registry.example/health/live
```

Внешний health route публикуйте только если это осознанная политика конкретного сервиса; node ingress скрывает health/status/admin routes.

## Node ingress profile

Текущий `docker-compose.node.prod.yml` отдельно требует current/next certificate и SPKI-файлы для networkless ingress attestation и подписанной ротации transport topology. Это ограниченный node-ingress контракт, а не универсальный pin для registry/file HTTPS и не callback клиентского leaf certificate validation.

Доступны `deep-managed` и `operator-managed` profiles. В обоих случаях private keys и pin inputs лежат в protected files, current и next keys различаются, а смена поколения выполняется без перезаписи уже опубликованного signed generation.

## Calls: текущий UAT и целевой release

Текущий pre-clean-break UAT содержит `/api/calls/*` в `deep-registry-api` и
обычный coturn. Он полезен только как reference/evidence и не является
production-схемой нового поколения.

Целевой public v1:

- signaling events идут как ratcheted E2EE messages через XPoint;
- `RelayOnly` использует только relay candidates;
- relay allocation и descriptors получаются через three-hop XPoint;
- signed rotating media catalog содержит masked UDP/443 и TCP/443 paths;
- public/direct ICE, static direct TURN origin и отдельный Registry signaling
  inbox отсутствуют.

До реализации target legacy UAT допускает следующие проверки:

- `/api/calls/*` маршрутизируется в `deep-registry-api`;
- signaling envelopes короткоживущие, сквозно зашифрованные и аутентифицированные account Ed25519 key;
- `/api/calls/ice-servers/{sessionId}` выдаёт ограниченные по времени coturn REST credentials только после подписи запроса;
- TURN передаёт DTLS-SRTP media и не расшифровывает её;
- отдельный параллельный signaling backend не развёртывается.

Эти `Calls__*` параметры относятся только к legacy UAT и должны быть удалены
из release composition при cutover. Секрет нельзя передавать через
`Calls__TurnSharedSecret` в environment или командной строке.

Полный anti-checklist удаляемой legacy-конфигурации: `Calls__Required=true`,
`Calls__Enabled=true`, `Calls__StatePath`, `Calls__TurnSharedSecretFile`,
`Calls__CredentialLifetimeSeconds`, `Calls__IceUrls`, `Calls__PushNotifyUrl` и
`Calls__PushNotifyBearerTokenFile`. Наличие любого из этих параметров после
clean-break означает ошибку release composition, а не включение fallback.

Legacy UAT network contract:

| Назначение | Протокол/порт |
| --- | --- |
| Registry signaling, inbox и ICE credentials | HTTPS `443/tcp` |
| STUN/TURN | `3478/udp` и `3478/tcp` |
| TURN over TLS/DTLS | `5349/tcp` и `5349/udp` |
| TURN relay range | `49160–49200/udp` и `49160–49200/tcp` |

Маршруты registry: `POST /api/calls/signal`, authenticated `GET /api/calls/inbox/{recipient}` и authenticated `GET /api/calls/ice-servers/{recipient}`. Все три используют account Ed25519 signatures и bounded nonce replay protection; call inbox и replay state сохраняются durable до ответа. Публичный reverse proxy направляет весь `/api/calls/` в registry API. TURN listeners публикуются напрямую или через DNS-only hostname: обычный HTTP/CDN proxy не переносит эти порты.

Проверяйте unsigned request (`401`) и forced TURN с двух реальных сетей только
как legacy regression. Public release evidence вместо этого блокирует direct
ICE/public TURN и доказывает relay-only masked UDP плюс UDP-blocked masked TCP.

## UAT private CA

UAT CA существует только во внешнем secret root. В Android он встраивается только в physical E2E build; Windows import выполняется в профиле тестировщика. Никогда не переносите UAT root или `network_security_config` в Release.
