# Сайт-приглашение: Евгений & Наталья — 26.08.2026

Статичный сайт (HTML/CSS/JS, без сборки). Открыть локально: просто откройте `index.html` в браузере.

## Структура

```
index.html            — страница сайта
style.css             — стили
script.js             — таймер, анимации, отправка формы (⚠️ вверху — SCRIPT_URL)
google-apps-script.gs — код для Google Apps Script (форма → Таблица + Telegram)
assets/               — фотографии
```

## Подключение формы RSVP (≈10 минут, один раз)

Ответы гостей будут падать в Google Таблицу и приходить сообщением в Telegram.

### Шаг 1. Google Таблица + скрипт

1. Создайте новую таблицу на [sheets.google.com](https://sheets.google.com) (например, «Свадьба — гости»).
2. В меню: **Расширения → Apps Script**.
3. Удалите содержимое редактора и вставьте целиком код из файла `google-apps-script.gs`.

### Шаг 2. Chat ID для Telegram

1. Откройте в Telegram бота **@ENwedding_bot** и отправьте ему `/start` (любое сообщение).
2. Откройте в браузере (подставьте токен вашего бота):
   `https://api.telegram.org/bot<ТОКЕН_БОТА>/getUpdates`
3. В ответе найдите `"chat":{"id":123456789,...}` — это число и есть ваш chat ID.
4. Вставьте его в строку `TELEGRAM_CHAT_ID = "..."` в Apps Script.
5. Проверка: в редакторе Apps Script выберите функцию `testTelegram` и нажмите **Выполнить** (при первом запуске Google попросит выдать разрешения). В Telegram должно прийти тестовое сообщение.

### Шаг 3. Публикация скрипта

1. В Apps Script: **Развернуть → Новое развёртывание → Тип: Веб-приложение**.
2. Настройки: «Выполнять от имени» — **от моего имени**; «У кого есть доступ» — **у всех**.
3. Нажмите **Развернуть** и скопируйте **URL веб-приложения** (`https://script.google.com/macros/s/.../exec`).
4. Вставьте этот URL в `script.js`, в первую строку: `const SCRIPT_URL = "..."`.

Готово — форма работает. Проверьте, отправив тестовый ответ с сайта.

## Публикация на GitHub Pages

1. Создайте репозиторий на GitHub (например, `wedding`), можно приватный — Pages на приватном требует платный план, поэтому лучше **публичный**.
2. В папке проекта:
   ```bash
   git init
   git add .
   git commit -m "Wedding invitation site"
   git branch -M main
   git remote add origin https://github.com/ВАШ_ЛОГИН/wedding.git
   git push -u origin main
   ```
3. На GitHub: **Settings → Pages → Source: Deploy from a branch → main / (root) → Save**.
4. Через 1–2 минуты сайт будет доступен по адресу `https://ВАШ_ЛОГИН.github.io/wedding/`.

> ⚠️ Репозиторий публичный, а `google-apps-script.gs` содержит токен бота — **не заливайте этот файл на GitHub** (он нужен только для вставки в Apps Script). Файл уже добавлен в `.gitignore`.

## Что легко поменять

- **Фон формы RSVP**: замените `assets/rsvp-bg.jpg` (имя файла — в `style.css`, блок `.rsvp__bg`).
- **Дата/время таймера**: `script.js`, константа `WEDDING_DATE`.
- **Тексты**: всё в `index.html`, секции подписаны комментариями.
- **Дедлайн RSVP**: в `index.html`, секция RSVP.
