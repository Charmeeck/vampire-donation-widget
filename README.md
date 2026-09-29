# Vampire Donation Widget

Готовый виджет прогресса донатов в стиле вампирского алтаря.

## Ссылка для OBS

https://charmeeck.github.io/vampire-donation-widget/

В OBS добавьте источник **Браузер** и укажите эту ссылку.

Рекомендуемый размер: **1672 × 941**.

## Подключение DonationAlerts

1. Откройте:
   https://charmeeck.github.io/vampire-donation-widget/setup.html
2. Укажите стартовую сумму и цель.
3. Нажмите **«Подключить DonationAlerts»**.
4. После авторизации используйте основную ссылку выше как источник браузера OBS.

Виджет получает новые донаты через DonationAlerts и обновляет сумму и заполнение нижней колбы.

## Cloudflare Worker

Worker используется для безопасного проксирования необходимых запросов DonationAlerts из браузера.
