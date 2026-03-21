import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars.
   */
  server: {
    PORT: z.coerce.number().default(3000),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    NEXT_PHASE: z.string().optional(),
    DATABASE_URL: z.string().min(1),
    DATABASE_PUBLIC_URL: z.string().optional(),
    CRON_SECRET: z.string().optional(),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.url().min(1),
    AUTH_GOOGLE_ID: z.string().min(1),
    AUTH_GOOGLE_SECRET: z.string().min(1),
    REDIS_URL: z.string().optional(),
    RESEND_API_KEY: z.string().min(1),
    RESEND_SENDER_EMAIL: z.email().min(1),
    S3_ENDPOINT: z.string().optional(),
    S3_REGION: z.string().min(1),
    S3_BUCKET: z.string().min(1),
    S3_ACCESS_KEY: z.string().min(1),
    S3_SECRET_ACCESS_KEY: z.string().min(1),
    S3_PUBLIC_URL: z.string().optional(),
    CREJIS_PROJECT_ID: z.string().min(1),
    CREJIS_API_SECRET: z.string().min(1),
    CREJIS_PAYMENT_URL: z.string().url().default("https://api.cregis.com/"),
    CREJIS_WEBHOOK_URL: z.string().url().optional(),
    CREJIS_TOKENS: z.string().default('["USDT-TRC20","USDT-BEP20"]'),
    SCREENSHOTONE_ACCESS_KEY: z.string().min(1),
    SCREENSHOTONE_ACCESS_KEY1: z.string().min(1),
    SCREENSHOTONE_ACCESS_KEY2: z.string().min(1),
    SCREENSHOTONE_ACCESS_KEY3: z.string().min(1),
    PLAUSIBLE_API_KEY: z.string().optional(), // Plausible analytics disabled
    AI_GATEWAY_API_KEY: z.string().optional(),
    AI_CHAT_MODEL: z.string().default("openai/gpt-4o"),
    AI_COMPLETION_MODEL: z.string().default("openai/gpt-4o-mini"),
    JINA_API_KEY: z.string().optional(),
  },

  /**
   * Specify your client-side environment variables schema here.
   * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_SITE_URL: z.url().min(1),
    NEXT_PUBLIC_SITE_EMAIL: z.email().min(1),
    NEXT_PUBLIC_PLAUSIBLE_URL: z.url().optional(), // Plausible analytics disabled
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().optional(), // Plausible analytics disabled
  },

  /**
   * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
   */
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SITE_EMAIL: process.env.NEXT_PUBLIC_SITE_EMAIL,
    NEXT_PUBLIC_PLAUSIBLE_URL: process.env.NEXT_PUBLIC_PLAUSIBLE_URL,
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
  },

  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
})

export const isProd = process.env.NODE_ENV === "production"
export const isDev = !isProd
