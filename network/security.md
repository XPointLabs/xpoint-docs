---
icon: shield-halved
---

# Модель безопасности

## Уровни защиты

| Уровень | Что проверяет |
| --- | --- |
| Прикладная криптография | идентичность отправителя, шифрование и целостность сообщений/файлов |
| Mailbox protocol | credentials владельца, replay/ack, authority/revocation/topology generations |
| XPoint route | подписанные privacy contacts, независимые RouterId/X25519, ровно три hops и непересекающийся fallback |
| HTTPS | доверенная CA-цепочка, hostname, срок действия и отзыв сертификата |
| Локальное хранение | SQLCipher и platform SecureStorage |

Один слой не отменяет другой. Валидный TLS-сертификат не делает неподписанный registry artifact доверенным; сквозное шифрование не разрешает игнорировать ошибку TLS.

## Публичные HTTPS endpoints

Registry, file, push, staking и call signaling с публичными CA/Certbot-сертификатами проходят стандартный platform TLS validator. В клиенте нет общего или file-specific статического leaf-SPKI pinning для таких endpoints. Это позволяет штатно обновлять сертификат и ключ, сохраняя проверку CA и hostname.

Запрещены permissive callbacks, отключение hostname validation, `-k` и доверие ко всем сертификатам. UAT с частным CA описан отдельно и не попадает в release build.

## Подписанные protocol data

Клиент независимо проверяет:

- корневой ключ Mr. X для доверенного release/UAT-профиля;
- последовательные authority, revocation и topology generations;
- membership proofs и credentials;
- хеш exact privacy-route artifact внутри подписанной activation policy;
- app identity и code-transparency material для Android release;
- целостность зашифрованных сообщений и вложений.

Это не TLS pinning и не должно маршрутизироваться через file-service settings.

## Границы централизации

Эксплуатируемыми компонентами остаются public registry, file service, push bridge, staking API/portal, TURN, DNS, container registry, мониторинг и incident response. Узлы XPoint и on-chain staking распределены, однако эта распределённость не превращает operated services в несуществующие. Документация и UI должны называть их прямо.
