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

Notes:
- Never commit env files. The repo ignores `**/.env*`.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` must be the **anon/public** key (not `service_role`, not `sb_secret_*`).
- `SUPABASE_SERVICE_ROLE_KEY` is server-only (should never be used from client components).

### 4) Database schema
Supabase Dashboard → **SQL Editor** → run:
- `supabase/schema.sql`

### 5) Start dev server

```bash
npm run dev
```

Open http://localhost:3000

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
