# LearnMap

Mobile-first, AI-powered learning roadmap app for university students (and lifelong learners). LearnMap turns a topic into a structured learning path with guides, quizzes, and progress tracking.

> Repo note: the actual Next.js app lives in **`learnmap-app/`**.

---

## What this project is

LearnMap is built around one core loop:

1. **Topic input** → user enters what they want to learn
2. **AI clarifying questions** → the app asks a few questions to tailor the roadmap
3. **User profile** → learning style, goal, etc.
4. **AI roadmap generation** → chapters + guide titles are generated and stored
5. **Visual roadmap** → shows what’s locked vs available
6. **Guide reading** (AI-generated on demand) → read and mark complete
7. **Quiz** → pass threshold is **4/5** to unlock progress

This repo is an MVP-first implementation with a focus on:
- clean UX on **mobile (375px)**
- simple, readable code (avoid clever abstractions)
- server-side safety for AI JSON (parse + validate before DB)

---

## Current state (what already works)

Implemented end-to-end:
- Auth via **Supabase OAuth** (Google + magic link)
- Gated personal pages with server-side `requireUser()` redirects
- Topic → AI clarifying questions (`/api/ai/topic-questions`)
- Roadmap generation + persistence (`/api/ai/roadmap`)
- Visual roadmap page (`/roadmap/[id]`)
- Guide generation on demand (`/api/ai/guide`) + guide reading UI (`/guide/[id]`)
- Quiz generation on demand (`/api/ai/quiz`) + real scoring UI (`/quiz/[chapterId]`)
- Progress endpoints:
  - complete guide → award XP + unlock next guide
  - complete quiz → unlock next chapter only if score **≥ 4/5**

Known gaps (planned next):
- Landing page (`/`)
- Profile page with XP/level/streak UI
- Hearts system
- Better loading UX for roadmap generation
- Markdown rendering improvements in guides

---

## Tech stack

**Frontend**
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui

**Backend**
- Next.js Route Handlers (`/app/api/*`)

**Database + Auth**
- Supabase (Postgres + RLS + OAuth)

**AI**
- Provider-agnostic HTTP wrapper (OpenAI-compatible *or* Anthropic-style responses)
- All AI calls go through: `learnmap-app/src/lib/ai/client.ts`

**Deployment**
- Vercel (Next.js)
- Supabase (DB/Auth)

---

## Repository layout

```text
LearnMap/
  learnmap-app/          # Next.js app (this is what you run/deploy)
  design/                # Static design references
  ProjectDescription.txt # Product brief
  README.md              # You are here
```

---

## Run locally

### 1) Install prerequisites
- Node.js **LTS**: https://nodejs.org

### 2) Install dependencies

```bash
cd learnmap-app
npm install
```

### 3) Configure environment variables

```bash
cd learnmap-app
cp .env.example .env.local
```

Fill in `.env.local` with your Supabase + AI values.

Important notes:
- Never commit `.env.local` (this repo ignores all `**/.env*`).
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` must be the **anon/public** key (not `service_role`, not `sb_secret_*`).

### 4) Create the database schema
In Supabase Dashboard → **SQL Editor** → run:
- `learnmap-app/supabase/schema.sql`

### 5) Start the dev server

```bash
cd learnmap-app
npm run dev
```

Open http://localhost:3000

---

## AI safety + data integrity

All AI outputs that are stored in the database are handled defensively:
- parsed via `JSON.parse()` with try/catch
- validated with **Zod** schemas
- if parsing fails: one repair retry, otherwise a human-readable UI error

AI wrapper handles both response formats:
- OpenAI-compatible: `data.choices[0].message.content`
- Anthropic-style: `data.content[0].text`

---

## Deploy (Vercel)

High level:
1. Create a Supabase project, apply schema, configure OAuth redirect URLs.
2. Create a Vercel project from this repo.
3. Add the environment variables in Vercel project settings.

(Full step-by-step instructions are in `learnmap-app/README.md`.)

---

## License

Private / job-application demo. Add a license if you plan to open-source this.
