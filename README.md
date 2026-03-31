# QCI AGI (Claude Agent)

Веб-приложение на **Next.js** с чатом к **Anthropic Claude**.

## Что внутри

- Chat UI (React + Tailwind)
- API-роут `app/api/chat/route.ts`
- Интеграция с `@anthropic-ai/sdk`
- Готово к деплою на Vercel

## Live

- GitHub: https://github.com/cyber-dev0x/QCI-AGI
- Deploy: https://qci-agi-claude-agent.vercel.app

> Сейчас API-чат заработает после добавления `ANTHROPIC_API_KEY` в Vercel Project Settings → Environment Variables.

## Быстрый старт

```bash
npm install
cp .env.example .env.local
# добавь свой ANTHROPIC_API_KEY
npm run dev
```

Открой: `http://localhost:3000`

## Переменные окружения

- `ANTHROPIC_API_KEY` — ключ Anthropic
- `ANTHROPIC_MODEL` — модель Claude (по умолчанию `claude-3-5-sonnet-latest`)

## Deploy (Vercel)

1. Подключить GitHub репозиторий к Vercel
2. Добавить env переменные:
   - `ANTHROPIC_API_KEY`
   - `ANTHROPIC_MODEL` (опционально)
3. Сделать redeploy

---

Автор: QCI AGI bootstrap.
