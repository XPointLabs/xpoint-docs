---
icon: list-check
---

# Статус готовности к релизу

Актуально на 30 августа 2026 года. Это точка отсчёта, а не GA-объявление. «Реализовано» означает наличие production-path кода и автоматических контрактов; «проверено физически» требует успешный run текущей commit matrix с сохранённым evidence.

## Клиент и транспорт

| Возможность | Реализация | Физический UAT | Релизный вывод |
| --- | --- | --- | --- |
| Создание/восстановление identity | локальное, без сетевого вызова | airplane-mode create-account evidence не сохранён | блокер physical evidence |
| XPoint three-hop privacy route | есть: exact 3-hop, disjoint fallback, direct MAU2 удалён | текущий path не прогнан полностью | блокер physical evidence |
| XPoint anti-blocking carrier | серверный Xray/Reality есть, но MAUI mailbox идёт direct HTTPS | нет | фундаментальный blocker до v1 |
| Двусторонний текст | код/автотесты есть | актуальный phone run не прошёл; новый APK не установлен | не подтверждено |
| Статус «Отправлено» | код/автотесты есть | прежний marker не доказывает текущую доставку | не подтверждено |
| Произвольные контакты и группы | code path и GroupText harness есть | актуальный roundtrip/cold restart не пройден | блокер |
| Выбор и отправка файла | есть | Android staging не завершён | блокер |
| Изображения/превью | есть | ожидает продолжения payload matrix | блокер |
| Голосовая запись/воспроизведение | есть | ожидает физического run | блокер |
| Звонки WebRTC | client + registry code есть | end-to-end run не завершён | блокер: deployment/routing/TURN/UAT |
| Push | есть | текущий physical cycle не закрыт | блокер evidence |
| Restart/outbox durability | есть | фазы не завершены | блокер |
| Before-forward fallback + outcome-unknown/ACK crash | opaque-ingress harness есть | chaos phases на новом path не завершены | блокер |
| Direct P2P | policy/interface и nearby scaffolding | verified peer adapter отсутствует | фундаментальный blocker до v1 |
| User-managed/on-prem MAU2 | dormant SHR1/mode contract | runtime profile отсутствует | позднее; сохранять architecture seam |
| iOS/iPadOS и Mac Catalyst | target frameworks есть | macOS signing/device evidence отсутствует | явно не проверено; не блокирует Android/Windows RC и не является release-supported |

## Инфраструктура

| Область | Состояние |
| --- | --- |
| Physical UAT TLS | частный CA, HTTPS ingress и app-scoped Android trust реализованы |
| Публичный registry/file TLS | системная CA/hostname validation; статический leaf pin не требуется |
| Production node ingress | hardened Compose и current/next preflight contract реализованы; нужен deployment evidence |
| Registry calls API | authenticated signaling и ICE credential code реализованы |
| Production calls routing | `/api/calls` должен быть направлен в registry; standalone Node calls service запрещён |
| TURN | deployment и direct/forced relay evidence обязательны до release |
| On-chain staking | контракты развёрнуты; production onboarding/GA не открыт |

## Критерий выпуска

Релиз нельзя подписывать только по успешной сборке. Обязательны:

1. MAU2 message frame проходит через реальный client Xray/VLESS Reality carrier при заблокированном direct HTTPS ingress;
2. arbitrary contact, двусторонний text и group roundtrip проходят на текущей signed commit matrix;
3. Direct P2P проходит на двух поддерживаемых устройствах без official mailbox;
4. offline account creation, restart durability и retry/ACK crash phases подтверждены физически;
5. production bootstrap/rotation переживает долгий offline без потери identity/history/outbox;
6. заявленные для v1 media/call функции имеют отдельное physical evidence;
7. отсутствуют UAT trust/secrets и debug package identity в release binaries;
8. production DNS и public TLS issuance/renewal/expiry alerting подтверждены;
9. snapshot→restore сохраняет XNode identity и пользовательский контур, а production rollback отрепетирован;
10. source repositories чисты и release manifest воспроизводим.

iOS/iPadOS и Mac Catalyst входят в отдельную Apple lane. До появления назначенной macOS build/signing authority и физического device evidence они явно `unverified` и `non-blocking` для выпуска Android/Windows RC и не могут рекламироваться как проверенно поддерживаемые.
