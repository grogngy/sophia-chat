# Sophia — Bilingual Gen-AI Business Mentor

> **Portfolio Case Study** · Full-stack production AI web application engineered for **IdentIA Lab** (Colombia) to help Latin American entrepreneurs discover practical Generative AI and automation opportunities.

---

## Live Demo & Interface Preview

- **Status:** Production MVP engineered for IdentIA Lab; personal portfolio demo deployment coming soon.
- **Want to inspect or run the live chat on your machine?** Follow the [5-Minute Local Quick Start](#local-quick-start-for-reviewers) below — database migrations and model seeding are fully scripted.

---

## Overview

**Sophia** is a bilingual (Spanish-first, English-aware) conversational AI mentor built for small businesses and startups across Latin America. Built with Next.js App Router, Supabase, Drizzle ORM, and OpenRouter's multi-model gateway, Sophia pairs a tailored consultative prompt architecture with multimodal logo analysis, daily rate-limiting, conversation persistence, and an admin model-management panel.

### Key Capabilities

- **Bilingual Consultative Persona (`ES / EN`)**: Detects English input automatically, asks the user to confirm their preferred language for continuity, and explains AI opportunities in plain, business-friendly language.
- **Multimodal Logo & Brand Feedback**: Supports image uploads through the Vercel AI SDK v5 multimodal pipeline for real-time logo and branding reviews.
- **Time-Based ROI & Automation Coaching**: Guides business owners through structured time-savings estimates (hours/week and hours/year saved) without making unverified financial claims.
- **Progressive Lead Qualification**: Tracks conversation depth and naturally invites high-intent prospects to connect with the consulting team.
- **Multi-Model Gateway & Admin Controls**: Routes across `OpenAI`, `Google`, `Anthropic`, and `xAI` via OpenRouter, with a role-protected Admin Dashboard (`/admin/models`) to enable or disable models dynamically in PostgreSQL.
- **Usage Guardrails & Persistence**: Enforces a 50-message/day limit (resetting at midnight Colombia time), persists conversations in PostgreSQL via Drizzle ORM, and includes CLI tooling for database maintenance and conversation analytics export.

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

### Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion |
| **AI & Streaming** | Vercel AI SDK (`ai` v5), `@ai-sdk/react`, `@openrouter/ai-sdk-provider` |
| **Backend & Auth** | Supabase Auth (`@supabase/ssr`), PostgreSQL, Supabase Storage |
| **Data & Validation** | Drizzle ORM, `drizzle-kit`, Zod, `@t3-oss/env-nextjs` |
| **Operations** | TypeScript CLI scripts for migrations, auth-to-public user reconciliation, storage setup, and conversation export |

### Notable Engineering Files

- [`app/api/chat/route.ts`](app/api/chat/route.ts) — Streaming chat handler, multimodal part extraction, daily quota enforcement, and Sophia's bilingual consultative prompt architecture.
- [`lib/drizzle/schema/`](lib/drizzle/schema/) — Relational PostgreSQL schema for `users`, `conversations`, `messages`, and dynamically managed `ai_models`.
- [`lib/env.ts`](lib/env.ts) — Strictly typed server/client environment validation via `@t3-oss/env-nextjs` and Zod.
- [`scripts/`](scripts/) & [`production-fix.sql`](production-fix.sql) — Production ops tooling for Drizzle migrations, auth/user sync recovery, storage provisioning, and conversation retrieval.

---

## Local Quick Start (For Reviewers)

Anyone can run Sophia locally on their computer in ~5 minutes using free-tier Supabase and OpenRouter accounts.

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
- **Attribution:** Originally architected and built as a production MVP for **IdentIA Lab** (Colombia) on top of the ShipKit `chat-simple` Next.js/Supabase foundation. Company credentials, private brand files, and live production data are excluded from this personal portfolio repository.
