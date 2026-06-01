# LearnMap — Next.js App (`learnmap-app/`)

This directory contains the production app.

If you’re viewing the repo root, start here:
- `../README.md` (project overview)

---

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (Postgres, RLS, OAuth)
- Next.js Route Handlers (`src/app/api/*`)
- AI via HTTP wrapper (no provider SDKs)

---

## Run locally

### 1) Install Node.js
Install **Node.js LTS** from https://nodejs.org

### 2) Install dependencies

```bash
cd learnmap-app
npm install
```

### 3) Environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`.

**Required env vars**

| Variable | Required | Purpose |
|---|---:|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon/public key (not service role, not `sb_secret_*`) |
| `AI_ENDPOINT_URL` | ✅ | Base URL (or full URL) for an OpenAI-compatible `chat/completions` endpoint |
| `AI_API_KEY` | ◻️ | Optional, depends on your provider |
| `AI_MODEL_FAST` | ✅ | Used for quick tasks (questions, small generations) |
| `AI_MODEL_SMART` | ✅ | Used for roadmap/guide/quiz generation |

**Example `.env.local`**

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

AI_ENDPOINT_URL=https://YOUR_AI_PROVIDER_BASE_URL
AI_API_KEY=YOUR_AI_KEY
AI_MODEL_FAST=your-fast-model
AI_MODEL_SMART=your-smart-model
```

Notes:
- Never commit env files. The repo ignores `**/.env*`.
- `AI_ENDPOINT_URL` may be either:
  - `https://provider.example.com` (the app will append `/chat/completions`), or
  - `https://provider.example.com/chat/completions`

### 4) Supabase setup

1) Supabase Dashboard → **SQL Editor** → run:
- `supabase/schema.sql`

2) Supabase Dashboard → **Authentication → URL Configuration**
Add redirect URLs:
- `http://localhost:3000/auth/callback`
- `https://<your-domain>/auth/callback`

3) Enable providers you want in Supabase Auth (Google/Discord/email).

### 5) Start dev server

After env + schema are configured:

```bash
npm run dev
```

Open http://localhost:3000

---

## Deploy to Vercel

1) Import the GitHub repo into Vercel
2) Set **Root Directory** to: `learnmap-app`
3) Add env vars from `.env.example`
4) Deploy
5) Add your deployed callback URL in Supabase:
- `https://<your-vercel-domain>/auth/callback`

### Smoke test
- Visit `/` and `/demo`
- Sign in at `/auth`
- Create a roadmap from `/learn`

---

## API endpoints (MVP)

### POST `/api/ai/topic-questions`

```json
{ "topic": "Biology" }
```

### POST `/api/ai/roadmap`

```json
{
  "topic": "Biology",
  "topicAnswers": { "q1": "I am a beginner" },
  "ageGroup": "university",
  "learningStyle": "examples",
  "goal": "exam",
  "extraContext": ""
}
```

Returns:

```json
{ "roadmapId": "..." }
```

---

## AI wrapper rules (important)

- Do not import OpenAI/Anthropic SDKs directly.
- All AI calls must go through `src/lib/ai/client.ts`.
- All AI JSON output that is stored must be:
  1) parsed with try/catch
  2) validated with Zod
  3) retried once with a repair prompt on parse failure

---

## Notes for reviewers

- This app is built to be mobile-first and readable/maintainable.
- Errors returned to the UI are human-readable (no raw Postgres errors).
