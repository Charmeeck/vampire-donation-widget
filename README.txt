VAMPIRE DONATION WIDGET — UNIVERSAL

Готовая версия для GitHub Pages + OBS.

Файлы:
- index.html — страница настройки и OAuth callback.
- setup.html — копия страницы настройки.
- liquid-vial.html — динамическая колба.
- vial-frame-clean.png — оформление колбы.
- config.js — Client ID DonationAlerts.

Текущий Client ID: 21478
Redirect URL: https://charmeeck.github.io/vampire-donation-widget/

ВАЖНО:
- Client ID можно использовать в браузерном приложении.
- Client Secret/API-ключ никому не передавайте и не размещайте в GitHub.
- В DonationAlerts Redirect URL должен точно совпадать с адресом выше.

Проверка:
1. Загрузите файлы в репозиторий vampire-donation-widget.
2. Откройте GitHub Pages URL.
3. Введите сумму/цель и нажмите «Подключить DonationAlerts».
4. Разрешите доступ в DonationAlerts.
5. После возврата откроется колба.
6. В OBS добавьте liquid-vial.html как Browser Source, 380x411.

Примечание:
Интеграция использует OAuth implicit grant и канал обновлений целей DonationAlerts.
Если браузер блокирует CORS-запросы DonationAlerts, понадобится небольшой промежуточный backend/Worker; сам дизайн колбы при этом менять не нужно.
