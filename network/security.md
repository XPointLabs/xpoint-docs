---
icon: shield-halved
---

# Модель безопасности

## Уровни защиты

| Уровень | Что проверяет |
| --- | --- |
| Прикладная криптография | новое device-scoped ratcheted E2EE с PFS/PCS; текущий DPE1 не является release protocol |
| Mailbox protocol | credentials владельца, replay/ack, authority/revocation/topology generations |
| XPoint route | подписанные privacy contacts, разные RouterId/traffic keys внутри ровно трёх hops; initial fallback не является независимым failure domain |
| Anti-blocking carrier | подписанный rotating bridge catalog и несколько carriers без немаскированного direct fallback; Reality — первый carrier |
| HTTPS | доверенная CA-цепочка, hostname, срок действия и отзыв сертификата |
| Локальное хранение | SQLCipher и platform SecureStorage |

Один слой не отменяет другой. Валидный TLS-сертификат не делает неподписанный registry artifact доверенным; сквозное шифрование не разрешает игнорировать ошибку TLS.

Three-hop onion privacy и traffic masking — разные свойства. Первая уже
реализована; вторая не считается готовой, пока текущий MAUI message path
открывает direct HTTPS к entry origin.

Три первых production XNode принадлежат начальному bootstrap profile. Такой
профиль не даёт operator/ASN diversity и не называется максимально
децентрализованным. Независимый fallback требует не менее шести узлов и
отдельного evidence.

## Публичные HTTPS endpoints

Registry, file, push и staking endpoints с публичными CA/Certbot-сертификатами
проходят стандартный platform TLS validator. В новом generation call signaling
идёт внутри E2EE message plane и не имеет отдельного публичного Registry
endpoint. В клиенте нет общего или file-specific статического leaf-SPKI
pinning для CA-managed endpoints. Это позволяет штатно обновлять сертификат и
ключ, сохраняя проверку CA и hostname.

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

Direct P2P не должен неявно обращаться к этим official services. Будущий
peer mesh должен сохранять end-to-end origin/destination authentication через
каждый multi-hop route: relay не получает plaintext/keys и не может подменять
сторону сообщения. Для mesh обязательны TTL/loop/replay/flood protection,
relay consent, resource quotas и partition recovery.

Будущий user-managed/on-prem профиль может использовать собственные Registry,
signaling, TURN и file services, но только после явного consent-bound выбора
другой authority и с обязательной TLS/SPKI проверкой.
