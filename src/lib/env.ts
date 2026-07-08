import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  IYZICO_API_KEY: z.string().min(1),
  IYZICO_SECRET_KEY: z.string().min(1),
  IYZICO_BASE_URL: z.string().url(),
  NEXT_PUBLIC_PAYMENTS_LIVE: z
    .string()
    .optional()
    .transform((v) => v === "true"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  RESEND_API_KEY: z.string().min(1).optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),
  ORDER_NOTIFICATION_EMAIL: z.string().email().optional(),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  IYZICO_API_KEY: process.env.IYZICO_API_KEY,
  IYZICO_SECRET_KEY: process.env.IYZICO_SECRET_KEY,
  IYZICO_BASE_URL: process.env.IYZICO_BASE_URL,
  NEXT_PUBLIC_PAYMENTS_LIVE: process.env.NEXT_PUBLIC_PAYMENTS_LIVE,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
  ORDER_NOTIFICATION_EMAIL: process.env.ORDER_NOTIFICATION_EMAIL,
});

if (!parsed.success) {
  console.error(
    "Invalid environment variables:",
    parsed.error.flatten().fieldErrors,
  );
  throw new Error(
    "Missing or invalid environment variables — check .env.local against .env.example",
  );
}

export const env = parsed.data;
