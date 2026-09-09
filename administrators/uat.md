---
icon: flask
---

# Локальный физический UAT

Survival/physical lane из `deep-devops` остаётся полезным regression-стендом с
HTTPS, частным UAT CA и прежними сервисными сценариями, но после clean break он
не является evidence нового first-release path. Новый локальный bootstrap уже
создаёт отдельные identity/state и проходит Compose `Config`, однако `Up/Verify`
намеренно fail closed: Registry authority closure для полной production
topology ещё не скомпонована. Обходить этот gate поддельным authority package
нельзя.

Этот lane пока доказывает direct HTTPS managed ingress, а не клиентский
VLESS/Reality carrier. Для anti-blocking release gate нужен отдельный real-Xray
профиль: direct HTTPS ingress блокируется, а тот же MAU2 roundtrip проходит
через Reality.

HAProxy не обязателен для быстрого внутреннего developer lane: контейнерные
тесты могут обращаться к private Xray/ingress listeners напрямую. Но такой
lane не является production evidence. Общий public 443, SNI separation,
сертификаты, header suppression и Docker DNS re-resolution обязательно
проверяются отдельным production-representative UAT профилем.

## Подготовка TLS и стека

Из корня `deep-devops`:

```powershell
.\scripts\Initialize-SurvivalUatTls.ps1 `
  -LanHost <LAN-IP-рабочей-станции> `
  -SecretRoot <внешний-защищённый-каталог>

.\scripts\survival-dev.ps1 -Action Prepare -LanHost <LAN-IP-рабочей-станции>
$env:SURVIVAL_BIND_HOST = '<LAN-IP-рабочей-станции>'
$env:SURVIVAL_UAT_TLS_SECRET_DIR = '<защищённый-каталог-сертификатов>'

docker compose -p deep-survival-dev `
  -f docker-compose.survival.dev.yml `
  -f docker-compose.survival-uat-tls.dev.yml `
  up -d --build --remove-orphans --wait
```

Всегда передавайте точный LAN host в `Prepare`: authority/coordinator URL подписывается для этого адреса.

## Доверие сертификату

- Android physical E2E build включает только публичный UAT CA как app-scoped trust anchor. Обычные Debug и Release сборки его не содержат.
- Windows требует осознанного импорта CA в `CurrentUser\Root` и CRL в хранилище текущего пользователя с предварительной сверкой SHA-256.
- Публичные application ports принимают только HTTPS. Единственное cleartext-исключение — узкий CRL publisher, если он указан в leaf certificate.

Нельзя использовать `-k`, `DangerousAcceptAnyServerCertificateValidator` или общий callback `return true`.

## Устройства

Проверьте уникальные ADB serials: один телефон может одновременно отображаться по USB и Wi‑Fi. Выбирайте конкретный serial в команде runner. Устройство ниже Android API 28 не участвует в приёмке текущего клиента.

USB допустим как канал управления ADB, но он не доказывает сетевой transport path. Для XPoint/Direct P2P evidence отдельно фиксируйте фактическую Wi‑Fi/Bluetooth технологию и route usage.

## Целевая физическая матрица

Следующие фазы станут исполняемым release gate после запуска first-release
stack и завершения client composition. Сейчас `GroupText`, direct messaging и
calls не могут считаться пройденными по старому survival path.

Рекомендуемый порядок runner из `deep-client-maui/eng`:

1. `ProvisionIdentity` и `Attach`;
2. `GroupText`: arbitrary contact, группа, text в обе стороны, at-least-once retry без дубликата пользовательского эффекта и cold restart;
3. `PayloadMatrix`: двусторонний текст, статусы, файл, изображение, голос;
4. `Call`: E2EE message-plane signaling, relay-only ICE и UDP-blocked masked
   TCP fallback; direct ICE не входит в official v1;
5. `RestartDurability`;
6. `ManualResendAfterRestart`;
7. `AutomaticRetryAfterRestart`;
8. `AckCrashWindow`;
9. `NegativeRuntime`.

Нельзя отмечать фазу пройденной по unit tests или визуальному наблюдению без сохранённого machine-readable evidence.

## Сброс UAT-данных

Автоматизированный сброс разрешён только для UAT app/data root и только явным параметром runner, например `-ResetWindowsUatLocalState`. До удаления runner проверяет процессы, путь и package identity. Production package `network.xpoint.deep`, его данные и системный SecureStorage вне UAT namespace не затрагиваются.

Не удаляйте целиком platform `securestorage.dat`: очищаются только owned slots/keys, относящиеся к UAT lane.
