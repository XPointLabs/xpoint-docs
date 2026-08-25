---
icon: certificate
---

# TLS и публичные сервисы

## Публичные CA-managed сервисы

Registry, file, push, staking API/portal и call signaling должны обслуживаться по HTTPS с сертификатом публично доверенной CA, точным SAN/hostname, актуальным сроком и рабочим renewal. Клиенты используют системный TLS validator.

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

## Call signaling и TURN

Поддерживаемая production-схема:

- `/api/calls/*` маршрутизируется в `deep-registry-api`;
- signaling envelopes короткоживущие, сквозно зашифрованные и аутентифицированные account Ed25519 key;
- `/api/calls/ice-servers/{sessionId}` выдаёт ограниченные по времени coturn REST credentials только после подписи запроса;
- TURN передаёт DTLS-SRTP media и не расшифровывает её;
- отдельный параллельный signaling backend не развёртывается.

Release profile registry задаёт `Calls__Required=true`, `Calls__Enabled=true`, отдельный `Calls__StatePath`, `Calls__TurnSharedSecretFile`, `Calls__CredentialLifetimeSeconds` в диапазоне 300–3600 и непустой массив `Calls__IceUrls`. Push wake-up использует `Calls__PushNotifyUrl` и, если endpoint закрыт bearer-аутентификацией, `Calls__PushNotifyBearerTokenFile`. Секрет нельзя передавать через `Calls__TurnSharedSecret` в environment или командной строке.

Публичный сетевой контракт:

| Назначение | Протокол/порт |
| --- | --- |
| Registry signaling, inbox и ICE credentials | HTTPS `443/tcp` |
| STUN/TURN | `3478/udp` и `3478/tcp` |
| TURN over TLS/DTLS | `5349/tcp` и `5349/udp` |
| TURN relay range | `49160–49200/udp` и `49160–49200/tcp` |

Маршруты registry: `POST /api/calls/signal`, authenticated `GET /api/calls/inbox/{recipient}` и authenticated `GET /api/calls/ice-servers/{recipient}`. Все три используют account Ed25519 signatures и bounded nonce replay protection; call inbox и replay state сохраняются durable до ответа. Публичный reverse proxy направляет весь `/api/calls/` в registry API. TURN listeners публикуются напрямую или через DNS-only hostname: обычный HTTP/CDN proxy не переносит эти порты.

Проверяйте unsigned request (`401`), direct ICE и forced TURN с двух реальных сетей. Cloud proxy, не поддерживающий TURN ports, нельзя считать работающим TURN ingress.

## UAT private CA

UAT CA существует только во внешнем secret root. В Android он встраивается только в physical E2E build; Windows import выполняется в профиле тестировщика. Никогда не переносите UAT root или `network_security_config` в Release.
