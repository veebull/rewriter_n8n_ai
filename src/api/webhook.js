const WEBHOOK_URL = 'https://n8n.permanare.ru/webhook-test/rewrite'
const AUTH = 'Basic ' + btoa('test-user:0Hx1#se@MSG5k^')

const STYLE_PROMPTS = {
  post: 'Перепиши как яркий пост для Telegram/Instagram. Добавь структуру, в конце призыв к действию. Без канцелярита.',
  expert: 'Перепиши как экспертный материал. Уверенный тон, конкретика, никакой воды.',
  friendly: 'Перепиши разговорным дружеским языком. Просто и тепло, как другу.',
  sell: 'Перепиши как продающий текст: боль → решение → выгоды → CTA.',
  short: 'Сократи текст в 2 раза, сохранив главную мысль. Убери лишнее.',
  fix: 'Исправь грамматику, пунктуацию и стилистику. Не меняй смысл и тон.',
}

export async function rewriteText(text, style) {
  const prompt = STYLE_PROMPTS[style] + '\n\nТекст:\n' + text

  const response = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Authorization': AUTH,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ textMessage: prompt }),
  })

  if (!response.ok) {
    throw new Error(`Ошибка сервера: ${response.status}`)
  }

  const data = await response.json()

  // Пробуем разные поля ответа n8n
  const result =
    data.output ||
    data.text ||
    data.message ||
    data.response ||
    data.result ||
    (Array.isArray(data) && (data[0]?.output || data[0]?.text || data[0]?.message)) ||
    null

  if (!result) {
    throw new Error('Неожиданный формат ответа от n8n: ' + JSON.stringify(data))
  }

  return result
}
