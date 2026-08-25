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

Проверяйте unsigned request (`401`), direct ICE и forced TURN с двух реальных сетей. Cloud proxy, не поддерживающий TURN ports, нельзя считать работающим TURN ingress.

## UAT private CA

UAT CA существует только во внешнем secret root. В Android он встраивается только в physical E2E build; Windows import выполняется в профиле тестировщика. Никогда не переносите UAT root или `network_security_config` в Release.
