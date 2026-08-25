---
icon: flask
---

# Локальный физический UAT

Поддерживаемый путь клиентской приёмки — survival/physical lane из `deep-devops`. Он сохраняет production-свойства: HTTPS, проверенный частный CA, реальные XPoint nodes, authenticated MAU2, файловый сервис и signed mailbox artifacts. Cleartext application transport не является допустимым UAT-профилем.

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

## Фазы физической проверки

Рекомендуемый порядок runner из `deep-client-maui/eng`:

1. `ProvisionIdentity` и `Attach`;
2. `PayloadMatrix`: двусторонний текст, статусы, файл, изображение, голос;
3. `Call`: direct ICE и forced TURN;
4. `RestartDurability`;
5. `ManualResendAfterRestart`;
6. `AutomaticRetryAfterRestart`;
7. `AckCrashWindow`;
8. `NegativeRuntime`.

Нельзя отмечать фазу пройденной по unit tests или визуальному наблюдению без сохранённого machine-readable evidence.

## Сброс UAT-данных

Автоматизированный сброс разрешён только для UAT app/data root и только явным параметром runner, например `-ResetWindowsUatLocalState`. До удаления runner проверяет процессы, путь и package identity. Production package `network.xpoint.deep`, его данные и системный SecureStorage вне UAT namespace не затрагиваются.

Не удаляйте целиком platform `securestorage.dat`: очищаются только owned slots/keys, относящиеся к UAT lane.
