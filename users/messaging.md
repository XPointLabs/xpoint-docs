---
icon: comments
---

# Сообщения и медиа

## Текстовые сообщения

Новый direct-message контур пока не доступен конечному пользователю. Локальные
DPH2/DPE2, session storage и durable pending-handshake срезы реализованы, но
отправка DPH2 через verified privacy path, подтверждение доставки, активация
сессии и цельный message runtime ещё не скомпонованы. Поэтому наличие экрана
чата или старого состояния «Отправлено» не является доказательством работы
текущего протокола.

Не используйте текущую тестовую сборку для реальной переписки. После активации
нового контура повтор будет использовать один durable logical message, а
статус доставки не будет означать прочтение получателем. До этого поведения
остаётся release gate; см. [актуальный статус](../release-readiness.md).

## Файлы и изображения

Архитектура требует шифровать вложение до загрузки и не передавать файловому
сервису открытый файл. UI/domain срезы выбора и подготовки существуют, но
отправка через новый direct-message runtime и физическая payload matrix ещё не
закрыты. Файлы и изображения пока не являются end-user функцией текущего RC.

## Голосовые сообщения

UI записи и воспроизведения существует, но голосовое вложение ещё не прошло
новый direct-message transport и физическую Android↔Windows приёмку. Оно пока
не является end-user функцией текущего RC.

## Звонки

Целевой клиент использует WebRTC-звонки. Invite/offer/answer/ICE control
передаются как ratcheted E2EE сообщения через выбранный transport; Registry не
является отдельным plaintext signaling authority. Медиапоток защищён
DTLS-SRTP. Official v1 `RelayOnly` запрещает host/srflx direct candidate и
не раскрывает peer IP собеседнику. `DirectPeer` зарезервирован для будущей
отдельной opt-in policy и не входит в первый релиз.

В ограниченной сети клиент использует подписанный rotating media-relay catalog
и TLS/HTTPS-compatible fallback. DNS-only TURN/TLS сам по себе не считается
обходом блокировок. Серверная схема текущего поколения реализована, но новый
signaling binding, rotating relay distribution и двусторонняя физическая
приёмка ещё являются блокерами релиза.

## Группы, ответы и реакции

Малые закрытые группы ещё не доступны конечному пользователю. Реализованы
локальный GroupV1 composer и проверяемый GroupControl transport, но durable
invitation outbox, fanout, acceptance/activation и новый group-chat runtime
ещё не скомпонованы и не прошли физический RC. Целевое поведение и лимиты
задаются в
[master sprint](https://github.com/XPointLabs/deep-platform/blob/main/docs/NEXT-SPRINT.md),
а эта страница не дублирует протокольную спецификацию.
