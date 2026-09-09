---
icon: list-check
---

# Статус готовности к релизу

Актуально на 9 сентября 2026 года. Это не GA-объявление. «Реализовано» ниже
означает наличие production-path кода и автоматических контрактов;
«доступно пользователю» требует законченной release-композиции, а «проверено
физически» — успешного прогона одной текущей RC commit matrix с сохранённым
evidence. Полный незавершённый scope ведётся в
[master sprint](https://github.com/XPointLabs/deep-platform/blob/main/docs/NEXT-SPRINT.md),
а закрытые срезы — в
[истории спринтов](https://github.com/XPointLabs/deep-platform/blob/main/docs/SPRINT-HISTORY.md).

## Клиент и транспорт

| Возможность | Реализация | Физический UAT | Релизный вывод |
| --- | --- | --- | --- |
| Локальный Deep account и постоянный Deep ID | offline-first account/store startup и canonical `deep1…` реализованы; сеть не требуется | итоговый airplane-mode create/restore gate не закрыт | локально работает, RC ещё не подтверждён |
| Canonical contact import | `deep1…`/DIA1 принимаются; offline/unavailable сохраняется как pending, verified результат выдаётся только после проверки | UI/restart/QR matrix не закрыта | fail-closed; чат ещё не открывается |
| Initial DPH2 и ratcheted DPE2 | protocol, protected stores, durable pending handshake и atomic commit реализованы | delivery/activation roundtrip отсутствует | не доступно пользователю до privacy-routed delivery receipt и runtime composition |
| Двусторонний direct text/media | logical storage и отдельные срезы готовы | Android↔Windows RC отсутствует | не доступно пользователю |
| Малые закрытые группы | GroupV1 authoring, local composer и privacy-routed GroupControl transport реализованы | invitation/fanout/acceptance/chat matrix отсутствует | не доступно пользователю до GroupControl/DPE2 композиции |
| XPoint three-hop privacy route | XNode runtime и client control transport реализованы fail-closed; Contact и Group terminals обязательны для readiness, initial topology не обещает disjoint fallback | цельный client→stack run отсутствует | readiness остаётся `503 required-unavailable` до verified Contact/Group authority composition |
| XPoint anti-blocking carrier | серверная и клиентская Reality/Xray основы есть | mailbox path при заблокированном direct HTTPS не пройден | блокер первого релиза |
| Файлы, изображения и голос | UI/domain срезы существуют, но не подключены к готовому direct-message runtime | payload matrix отсутствует | не доступно в текущем RC |
| Звонки WebRTC | отдельные client/server основы существуют | новый E2EE signaling/media-relay path не пройден | не доступно в текущем RC |
| Push, restart/outbox и ACK-crash | отдельные persistence/harness срезы существуют | цельная RC matrix не закрыта | блокер evidence и композиции |
| Direct P2P mesh | policy/interface и nearby scaffolding | verified peer/mesh adapter отсутствует | будущее архитектурное требование; не блокирует первый релиз |
| User-managed/on-prem MAU2 | dormant SHR1/mode contract | runtime profile отсутствует | позднее; сохранять architecture seam |
| iOS/iPadOS и Mac Catalyst | target frameworks есть | macOS signing/device evidence отсутствует | явно не проверено; не блокирует Android/Windows RC и не является release-supported |

## Инфраструктура

| Область | Состояние |
| --- | --- |
| Physical UAT TLS | частный CA, HTTPS ingress и app-scoped Android trust реализованы |
| Публичный registry/file TLS | системная CA/hostname validation; статический leaf pin не требуется |
| First-release XPoint stack | bootstrap, file-only identities/secrets, ONION state и exact node roles подготовлены; Contact/Group terminals явно обязательны | `Up/Verify` не запускались, контейнеры остановлены; readiness fail closed до verified Registry genesis/leaf, GSR1/DCR1 и authority-bound ContactResolve replay epoch |
| Production node ingress | hardened Compose и current/next preflight contract реализованы; нужен deployment evidence |
| Legacy Registry calls API | authenticated signaling/ICE code существует, но не входит в новый clean-break steady-state path |
| Target call signaling | typed ratcheted events через XPoint message plane | не реализовано; blocker |
| Target media relay | relay-only ICE, rotating masked UDP/TCP catalog | не реализовано; blocker |
| On-chain staking | контракты развёрнуты; production onboarding/GA не открыт |

## Критерий выпуска

Релиз нельзя подписывать только по успешной сборке. Обязательны:

1. MAU2 message frame проходит через реальный client Xray/VLESS Reality carrier при заблокированном direct HTTPS ingress;
2. canonical contact import завершается verified activation, а двусторонний
   direct text и group roundtrip проходят на текущей signed commit matrix;
3. offline account creation, restart durability и retry/ACK crash phases подтверждены физически;
4. production bootstrap/rotation переживает долгий offline без потери identity/history/outbox; retention истёкших сообщений проверяется отдельно и не обещается бессрочно;
5. заявленные для v1 media/call функции имеют отдельное physical evidence;
6. отсутствуют UAT trust/secrets и debug package identity в release binaries;
7. production DNS и public TLS issuance/renewal/expiry alerting подтверждены;
8. snapshot→restore сохраняет XNode identity и пользовательский контур, а production rollback отрепетирован;
9. source repositories чисты и release manifest воспроизводим.

Direct P2P mesh не входит в scope первого production-релиза. До отдельной
будущей реализации режим остаётся скрытым/fail-closed и не может использовать
official mailbox как неявный fallback.

iOS/iPadOS и Mac Catalyst входят в отдельную Apple lane. До появления назначенной macOS build/signing authority и физического device evidence они явно `unverified` и `non-blocking` для выпуска Android/Windows RC и не могут рекламироваться как проверенно поддерживаемые.
