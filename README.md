# Sophia — Bilingual Gen-AI Business Mentor

> **Portfolio Case Study by Wilson Cely (`@grogngy`)** · Bilingual Generative AI mentor designed, customized, and launched for **IdentIA Lab** (Colombia) using **AI-assisted development** and the **ShipKit** low-code/template framework.

---

## My Role & How This Was Built

I built **Sophia** as an **AI Solution Builder & Product Architect** using a modern **low-code / AI-assisted workflow** on top of the **ShipKit `chat-simple` framework** (Next.js + Supabase + Drizzle ORM + OpenRouter). Rather than writing full-stack boilerplate from scratch, I leveraged ShipKit and AI coding tools to move quickly from concept to a working production MVP — focusing my work on product design, bilingual prompt architecture, business guardrails, cloud integration, and launch readiness.

| Area | What I Directly Designed & Delivered | ShipKit Foundation (Template Layer) |
| :--- | :--- | :--- |
| **AI & Prompt Design** | Bilingual (`ES / EN`) consultative persona, language-detection check, time-based ROI calculator prompt, lead-qualification strategy, and MVP boundary guardrails ([`route.ts`](app/api/chat/route.ts)) | Vercel AI SDK v5 streaming plumbing & OpenRouter provider integration |
| **Product & Localization** | IdentIA Lab brand identity, LATAM Spanish landing copy, chat welcome experience, business-focused prompt examples, and QA/component tracking | Next.js 15 App Router scaffold, Tailwind CSS, and shadcn/ui component library |
| **Cost & Usage Controls** | 50-message/day quota design, model-selection strategy (Gemini Flash Lite / Flash / GPT-4o Mini), and admin model toggles to keep API spend predictable | Supabase Auth, PostgreSQL schema boilerplate, and Drizzle ORM migration runner |
| **Cloud & Production Ops** | End-to-end Supabase, OpenRouter, and Vercel wiring, environment-variable hygiene, user-sync recovery ([`production-fix.sql`](production-fix.sql)), and conversation-export workflows | Base deployment guides and template scripts |

---

## Live Demo & Interface Preview

- **Status:** Production MVP delivered for IdentIA Lab (Colombia); personal portfolio demo deployment coming soon.
- **Want to run the live chat locally?** Follow the [5-Minute Local Quick Start](#local-quick-start-for-reviewers) below — database migrations and model seeding are fully scripted.

---

## Overview

**Sophia** is a bilingual (Spanish-first, English-aware) conversational AI mentor built to help small businesses and startups across Latin America discover practical Generative AI and automation opportunities.

### Key Capabilities

- **Bilingual Consultative Persona (`ES / EN`)**: Detects English input automatically, asks the user to confirm their preferred language for continuity, and communicates in accessible, business-friendly language.
- **Multimodal Logo & Brand Feedback**: Accepts image uploads through the Vercel AI SDK v5 multimodal pipeline for logo and branding reviews.
- **Time-Based ROI & Automation Coaching**: Walks business owners through structured time-savings estimates (hours/week and hours/year saved) without making unverified financial promises.
- **Progressive Lead Qualification**: Tracks conversation depth and naturally invites high-intent prospects to connect with the consulting team.
- **Multi-Model Gateway & Admin Controls**: Routes across `OpenAI`, `Google`, `Anthropic`, and `xAI` via OpenRouter, with a role-protected Admin Dashboard (`/admin/models`) to enable or disable models dynamically.
- **Usage Guardrails & Persistence**: Enforces a 50-message/day limit (resetting at midnight Colombia time) and stores conversation history in PostgreSQL via Drizzle ORM.

---

## System Architecture

```mermaid
flowchart LR
    U[User Browser<br/>Landing · Auth · Chat · History] --> MW[Next.js Middleware<br/>Supabase SSR Session Guard]
    MW --> UI[Next.js 15 App Router<br/>React 19 · Tailwind · shadcn/ui]
    UI --> API[/api/chat Route Handler<br/>Zod Env · Multimodal Parser]
    API --> LIM[Daily Usage Counter<br/>50 msg/day Guardrail]
    API --> PROMPT[Sophia System Prompt<br/>Bilingual · ROI · Lead Qual]
    PROMPT --> OR[OpenRouter AI Gateway<br/>Vercel AI SDK v5]
    OR --> LLM[Gemini · GPT · Claude · xAI]
    UI --> AUTH[Supabase Auth & Storage]
    API --> DB[(Supabase PostgreSQL<br/>via Drizzle ORM)]
    ADMIN[Admin Dashboard<br/>Model Toggles] --> DB
```

### Stack & Framework Components

| Layer | Technologies |
| :--- | :--- |
| **Framework Foundation** | ShipKit `chat-simple` template (AI-assisted / low-code accelerator) |
| **Frontend** | Next.js 15 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion |
| **AI & Streaming** | Vercel AI SDK (`ai` v5), `@ai-sdk/react`, `@openrouter/ai-sdk-provider` |
| **Backend & Auth** | Supabase Auth (`@supabase/ssr`), PostgreSQL, Supabase Storage |
| **Data & Validation** | Drizzle ORM, `drizzle-kit`, Zod, `@t3-oss/env-nextjs` |
| **Operations** | CLI scripts for migrations, auth-to-public user reconciliation, storage setup, and conversation export |

### Key Project Files

- [`app/api/chat/route.ts`](app/api/chat/route.ts) — Chat route handler, multimodal input handling, daily quota check, and Sophia's bilingual consultative system prompt.
- [`lib/drizzle/schema/`](lib/drizzle/schema/) — Relational PostgreSQL schema for `users`, `conversations`, `messages`, and `ai_models`.
- [`lib/env.ts`](lib/env.ts) — Typed server/client environment validation via `@t3-oss/env-nextjs` and Zod.
- [`scripts/`](scripts/) & [`production-fix.sql`](production-fix.sql) — Database migration, auth/user sync recovery, storage setup, and conversation-retrieval utilities.

---

## Local Quick Start (For Reviewers)

Anyone can run Sophia locally in ~5 minutes using free-tier Supabase and OpenRouter accounts.

### 1. Prerequisites

- Node.js 20+
- A free [Supabase](https://supabase.com) project (PostgreSQL + Auth + Storage)
- An [OpenRouter](https://openrouter.ai) API key

### 2. Clone, Install & Configure

```bash
git clone https://github.com/grogngy/sophia-chat.git
cd sophia-chat
npm install
cp .env.local.example .env.local
```

Fill in `.env.local` (git-ignored — never commit secrets):

| Variable | Scope | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | Server | Supabase PostgreSQL connection string |
| `SUPABASE_URL` | Server | Supabase project URL |
| `SUPABASE_ANON_KEY` | Server | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | Supabase service role key (server-only) |
| `OPENROUTER_API_KEY` | Server | OpenRouter API key for multi-model inference |
| `NEXT_PUBLIC_APP_URL` | Client | App base URL (e.g., `http://localhost:3000`) |
| `NEXT_PUBLIC_COMPANY_WEBSITE` | Client | Organization or portfolio website URL |
| `NEXT_PUBLIC_COMPANY_WHATSAPP` | Client | Contact WhatsApp number (international format) |
| `NEXT_PUBLIC_COMPANY_EMAIL` | Client | Contact email address |

### 3. Initialize Database & Run

```bash
npm run db:migrate
npm run db:seed
npm run storage:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to explore the landing page, sign-up/login flow, and live Sophia chat interface.

---

## Security & Attribution

- **Strict secret isolation:** All credentials live in git-ignored `.env.local` files and are validated at startup in `lib/env.ts`; Supabase keys remain server-only (no `NEXT_PUBLIC_` browser exposure).
- **Attribution:** Built by **Wilson Cely (`@grogngy`)** for **IdentIA Lab** (Colombia) using the **ShipKit `chat-simple`** framework and AI-assisted development workflows. Company credentials, private brand files, and live production data are excluded from this personal portfolio repository.
