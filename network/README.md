---
icon: network-wired
---

# Сеть и транспорты

Deep не связывает модель переписки с одним сетевым провайдером. Прикладной слой формирует сквозно зашифрованные сообщения, а выбранный transport adapter отвечает за доставку, получение, подтверждение и повтор.

Текущий кандидат использует `authenticated-mau2` с `official-managed` ownership и трёхузловым маршрутом через XPoint. Он включает:

- подписанные authority, revocation и topology artifacts;
- выданные конкретному владельцу mailbox credentials;
- бинарную послойную маршрутизацию через ровно три различных узла;
- best-effort резервный маршрут только для доказанного отказа до пересылки;
- persistent outbox с идемпотентными попытками;
- отдельные сервисы файлов, push и media relay, подчинённые общей
  anti-censorship policy; call signaling передаётся как E2EE control message.

Первые три production XNode дают один маршрут из трёх разных узлов. Резервный
маршрут может переиспользовать эти узлы и не считается независимым failure
domain. Полностью непересекающийся primary/fallback будет заявлен только после
появления не менее шести узлов с подтверждённым operator/host/ASN diversity.

Это ещё не готовый anti-blocking release path. Клиент сейчас отправляет
зашифрованный privacy frame напрямую на HTTPS ingress; серверный Xray/Reality
и клиентский Reality runtime существуют, но не связаны с mailbox transport.
До v1 этот frame должен идти через маскированный carrier без direct-HTTPS
bypass. Direct P2P не входит в первый production-релиз: он перенесён в
более поздний этап и должен поддерживать не только прямой peer link, но и
multi-hop mesh. Production adapter пока отсутствует.

Registry публикует и обслуживает подписанные protocol data, но не является криптографическим владельцем пользовательской идентичности. On-chain state остаётся источником истины для стейкинга, а содержимое переписки защищает клиентский протокол.

On-prem/user-managed профиль выполняется позднее. Его отдельная authority и
consent-bound activation уже зарезервированы архитектурой и не должны
подменяться зависимостью от official Registry.

Подробности: [Транспортные режимы и «Путь»](transports.md), [Модель безопасности](security.md).
