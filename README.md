# AI Рерайтер — React + n8n

Простое React приложение для рерайта текста через n8n webhook.

## Быстрый старт

```bash
npm install
npm run dev
```

Открыть: http://localhost:5173

## Структура

```
src/
  App.jsx          — главный компонент
  App.module.css   — стили
  api/webhook.js   — запрос к n8n
  index.css        — глобальные стили
  main.jsx         — точка входа
```

## Настройка

Все настройки в `src/api/webhook.js`:

```js
const WEBHOOK_URL = "https://n8n.permanare.ru/webhook-test/rewrite";
```

## Стили рерайта

| Стиль      | Описание                         |
| ---------- | -------------------------------- |
| Пост       | Telegram/Instagram пост с эмодзи |
| Экспертный | Уверенный тон без воды           |
| Дружеский  | Разговорный язык                 |
| Продающий  | Боль → решение → CTA             |
| Сократить  | Убрать лишнее                    |
| Исправить  | Грамматика и стилистика          |

## n8n workflow

Webhook принимает:

```json
{ "textMessage": "промпт + текст пользователя" }
```

Ответ должен содержать одно из полей: `output`, `text`, `message`, `response`, `result`
