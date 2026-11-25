# Sophia — Bilingual Gen-AI Business Mentor

> **Portfolio Case Study** · Full-stack production AI web application architected and developed for **IdentIA Lab** (Colombia) to help Latin American entrepreneurs discover practical Generative AI and automation opportunities.

---

## Overview

**Sophia** is a bilingual (Spanish-first, English-aware) conversational AI mentor designed for micro-businesses and startups across Latin America. Built with Next.js App Router, Supabase, Drizzle ORM, and OpenRouter's multi-model gateway, Sophia pairs a tailored consultative system prompt with multimodal image analysis, daily rate-limiting, conversation persistence, and an admin model-management panel.

### Key Capabilities

- **Bilingual Consultative Persona (`ES / EN`)**: Automatically detects English input, offers seamless language continuity, and adapts guidance for non-technical small-business owners.
- **Multimodal Logo & Brand Feedback**: Supports image uploads through the Vercel AI SDK v5 multimodal pipeline for real-time logo and branding reviews.
- **Time-Based ROI & Automation Coaching**: Guides business owners through structured time-savings estimates and workflow automation ideas without making unverified financial promises.
- **Progressive Lead Qualification**: Tracks conversation depth and naturally invites high-intent prospects to connect with the consulting team.
- **Multi-Model Gateway & Admin Controls**: Powered by OpenRouter (`OpenAI`, `Google`, `Anthropic`, `xAI`), with a role-protected Admin Dashboard to activate, deactivate, or switch models in PostgreSQL.
- **Usage Guardrails & Persistence**: Enforces a 50-message/day limit (resetting at midnight Colombia time), stores full conversation history in PostgreSQL via Drizzle ORM, and includes production maintenance/export tooling.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion |
| **AI & Streaming** | Vercel AI SDK (`ai` v5), `@ai-sdk/react`, `@openrouter/ai-sdk-provider` |
| **Backend & Auth** | Supabase Auth (`@supabase/ssr`), PostgreSQL, Supabase Storage |
| **Data & Validation** | Drizzle ORM, `drizzle-kit`, Zod, `@t3-oss/env-nextjs` |
| **Operations** | Custom TypeScript CLI scripts for migrations, user-record reconciliation, storage setup, and conversation analytics export |

---

## Architecture Highlights

```text
Next.js App Router (Landing / Auth / Chat / History / Admin)
        │
        ├── Supabase Auth + Middleware (Session & Role Guard)
        ├── Drizzle ORM ──► PostgreSQL (users, conversations, messages, ai_models)
        └── /api/chat Route Handler
                ├── Daily Usage Counter (50 msg/day cap)
                ├── Sophia System Prompt & Bilingual Guardrails
                └── OpenRouter Provider ──► Gemini / GPT / Claude / xAI
```

### Notable Engineering Files

- `app/api/chat/route.ts` — Streaming chat handler, multimodal part extraction, daily quota check, and Sophia's bilingual consultative prompt architecture.
- `lib/drizzle/schema/` — Normalized relational schema for users, conversations, messages, and dynamically managed AI models.
- `lib/env.ts` — Strictly typed server/client environment validation via `@t3-oss/env-nextjs` and Zod.
- `scripts/` & `production-fix.sql` — Production operations scripts for Drizzle migrations, auth-to-public user sync, storage provisioning, and conversation retrieval.

---

## Local Setup

### 1. Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project (PostgreSQL + Auth + Storage)
- An [OpenRouter](https://openrouter.ai) API key

### 2. Install & Configure Environment

```bash
npm install
cp .env.local.example .env.local
```

Populate `.env.local` with your own credentials (never commit `.env.local`):

| Variable | Scope | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | Server | Supabase PostgreSQL connection string |
| `SUPABASE_URL` | Server | Supabase project URL |
| `SUPABASE_ANON_KEY` | Server | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | Supabase service role key (server-only) |
| `OPENROUTER_API_KEY` | Server | OpenRouter API key for multi-model inference |
| `NEXT_PUBLIC_APP_URL` | Client | App base URL (e.g., `http://localhost:3000`) |
| `NEXT_PUBLIC_COMPANY_WEBSITE` | Client | Organization website URL |
| `NEXT_PUBLIC_COMPANY_WHATSAPP` | Client | Contact WhatsApp number (international format) |
| `NEXT_PUBLIC_COMPANY_EMAIL` | Client | Contact email address |

### 3. Run Database Migrations & Start Dev Server

```bash
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Security & Attribution

- All secrets are isolated in git-ignored `.env.local` files and validated at runtime through `lib/env.ts`; Supabase keys remain server-only (no `NEXT_PUBLIC_` exposure).
- Originally engineered as a production MVP for **IdentIA Lab** (Colombia) on top of the ShipKit `chat-simple` Next.js/Supabase foundation. Company-specific credentials, private brand assets, and live contact endpoints are excluded from this portfolio repository.
