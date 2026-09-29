VAMPIRE DONATION WIDGET v6

Файлы для GitHub Pages:
- index.html — основной виджет для OBS
- setup.html — страница подключения DonationAlerts
- config.js — Client ID приложения
- altar.png — основная графика
- blood-texture.png — текстура крови

ПОДКЛЮЧЕНИЕ:
1. Открой https://charmeeck.github.io/vampire-donation-widget/setup.html
2. Нажми «Подключить DonationAlerts» и разреши доступ.
3. После возврата на виджет скопируй получившийся адрес страницы и вставь его в OBS -> Источник «Браузер».
4. Размер источника: 1672 x 941.

Виджет получает обновления цели DonationAlerts через канал goals и новые донаты через канал alerts. Токен OAuth используется только в браузере.

ТЕСТ БЕЗ DONATIONALERTS:
https://charmeeck.github.io/vampire-donation-widget/?current=2500&goal=10000
https://charmeeck.github.io/vampire-donation-widget/?current=7500&goal=10000
