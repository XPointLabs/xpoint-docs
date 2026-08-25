---
icon: list-check
---

# Статус готовности к релизу

Актуально на 25 августа 2026 года. Это точка отсчёта, а не GA-объявление. «Реализовано» означает наличие production-path кода и автоматических контрактов; «проверено физически» требует успешный Android↔Windows run с сохранённым evidence.

## Клиент и транспорт

| Возможность | Реализация | Физический UAT | Релизный вывод |
| --- | --- | --- | --- |
| Создание/восстановление identity | есть | использовано в текущей паре | продолжить negative/reset gates |
| XPoint authenticated MAU2 | есть | реальный трёхузловой HTTPS path работает | основной кандидат |
| Двусторонний текст | есть | пройден Android↔Windows | подтверждено в текущем run |
| Статус «Отправлено» | есть | пройден exact UI marker | подтверждено в текущем run |
| Выбор и отправка файла | есть | Android staging не завершён | блокер |
| Изображения/превью | есть | ожидает продолжения payload matrix | блокер |
| Голосовая запись/воспроизведение | есть | ожидает физического run | блокер |
| Звонки WebRTC | client + registry code есть | end-to-end run не завершён | блокер: deployment/routing/TURN/UAT |
| Push | есть | текущий physical cycle не закрыт | блокер evidence |
| Restart/outbox durability | есть | фазы не завершены | блокер |
| Manual/automatic retry + ACK crash | harness есть | chaos phases не завершены | блокер |
| Direct P2P Wi‑Fi/Bluetooth | только scaffolding/contracts | нет verified peer adapter | недоступно, fail-closed |
| User-managed MAU2 | mode contract есть | release profile отсутствует | не выпускать как готовое |

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

1. полный payload matrix на двух физических устройствах;
2. direct ICE и forced TURN call;
3. restart durability и все retry/ACK crash phases;
4. negative TLS/runtime проверки;
5. production endpoint, DNS, certificate renewal и rollback evidence;
6. отсутствие UAT trust/secrets и debug package identity в release binaries;
7. чистые, локально закоммиченные source repositories и воспроизводимый release manifest.
