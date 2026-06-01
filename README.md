# LearnMap

Mobile-first, AI-powered learning roadmap app for university students (and lifelong learners).

> The production Next.js app lives in **`learnmap-app/`**.

**Live demo:** *working on it*

---

## Recruiter quickstart (10–15 minutes)

This repo contains a real full-stack MVP. The **full generation flow** requires:
- a **Supabase** project (Auth + Postgres)
- an **AI endpoint** that supports OpenAI-compatible `/chat/completions` (or a compatible proxy)

If you only want to understand the product quickly:
- open **`/demo`** after running the app (no auth needed)

### 1) Run locally

```bash
git clone <your-repo-url>
cd LearnMap/learnmap-app
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000

### 2) Configure Supabase (required for real generation)

1. Create a Supabase project.
2. Supabase Dashboard → **SQL Editor** → run: `learnmap-app/supabase/schema.sql`
3. Supabase Dashboard → **Project Settings → API**:
   - copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - copy **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Supabase Dashboard → **Authentication → URL Configuration**:
   - add redirect URL: `http://localhost:3000/auth/callback`

### 3) Configure the AI endpoint

Set these in `.env.local`:
- `AI_ENDPOINT_URL`
- `AI_API_KEY` (if your provider requires it)
- `AI_MODEL_FAST`, `AI_MODEL_SMART`

---

## What this project is

LearnMap is built around one core loop:

1. Topic input
2. AI clarifying questions
3. Learner profile
4. AI roadmap generation (chapters + guide titles)
5. Visual roadmap
6. Guide reading (generated on demand)
7. Quiz (pass threshold is **4/5**) to unlock progress

---

## Code tour (the “agentic” bits)

If you only read a few files, start here:

- AI transport wrapper (provider-agnostic):
  - `learnmap-app/src/lib/ai/client.ts`
- JSON parse + repair retry:
  - `learnmap-app/src/lib/ai/parse.ts`
- Zod schemas (AI contracts):
  - `learnmap-app/src/lib/ai/schemas.ts`
- Prompt library:
  - `learnmap-app/src/lib/ai/prompts.ts`
- Roadmap generation route (best end-to-end example):
  - `learnmap-app/src/app/api/ai/roadmap/route.ts`

---

## AI review prompt (copy/paste)

If you’re reviewing this repo with an AI coding assistant (Claude Code / Cursor / Copilot), use:

> Explain the end-to-end flow from `/learn` → `/api/ai/roadmap` → Supabase inserts → `/roadmap/[id]`.
> Point to the exact files. Highlight validation/guardrails (JSON parse, Zod validation, repair retry) and auth/ownership checks.

---

## Tech stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (mobile-first UI)
- Supabase (Postgres + RLS + OAuth)
- Next.js Route Handlers (`/app/api/*`)

---

## Deploy to Vercel (fast path)

1. Import the GitHub repo into Vercel.
2. Set **Root Directory** to: `learnmap-app`
3. Add environment variables from `learnmap-app/.env.example`
4. Deploy
5. In Supabase Auth settings, add redirect URL:
   - `https://<your-vercel-domain>/auth/callback`

---

## AI-assisted development (brief)

I use AI tools to speed up implementation and iteration (UI scaffolding, debugging, refactors), but I treat the final system as my responsibility:
- define the constraints (schemas, validation rules, product logic)
- review outputs critically
- validate changes with builds and real usage

---

## Current state (what works)

Implemented end-to-end:
- Auth via Supabase (OAuth + email/password)
- Topic → AI clarifying questions (`/api/ai/topic-questions`)
- Roadmap generation + persistence (`/api/ai/roadmap`)
- Guide generation on demand (`/api/ai/guide`)
- Quiz flow + pass rule enforcement (`/quiz/[chapterId]`)

---

## Repo layout

```text
LearnMap/
  learnmap-app/          # Next.js app (run/deploy this)
  design/                # Static design references
  ProjectDescription.txt # Product brief
  README.md              # You are here
```
