import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // Drizzle
    DATABASE_URL: z.string().url(),

    // Supabase (server-only, not exposed to browser)
    SUPABASE_URL: z.string().url(),
    SUPABASE_ANON_KEY: z.string().min(1),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

    // AI Providers
    OPENROUTER_API_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    // Company contact information (displayed in chat UI)
    NEXT_PUBLIC_COMPANY_WEBSITE: z.string().url(),
    NEXT_PUBLIC_COMPANY_WHATSAPP: z.string().min(1),
    NEXT_PUBLIC_COMPANY_EMAIL: z.string().email(),
  },
  runtimeEnv: {
    // Server variables
    DATABASE_URL: process.env.DATABASE_URL,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,

    // Client variables
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_COMPANY_WEBSITE: process.env.NEXT_PUBLIC_COMPANY_WEBSITE,
    NEXT_PUBLIC_COMPANY_WHATSAPP: process.env.NEXT_PUBLIC_COMPANY_WHATSAPP,
    NEXT_PUBLIC_COMPANY_EMAIL: process.env.NEXT_PUBLIC_COMPANY_EMAIL,
  },
});
