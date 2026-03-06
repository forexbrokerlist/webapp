import { isMimeTypeMatch } from "@primoui/utils"
import type { useTranslations } from "next-intl"
import { z } from "zod"
import { checkoutSchema } from "~/server/web/products/schema"

type TFunction = ReturnType<typeof useTranslations>

export const ALLOWED_MIMETYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
]

const createPathSchema = (t: TFunction) => {
  return z.object({
    path: z.string().regex(/^[a-z0-9/_-]+$/i, { error: t("invalidPath") }),
  })
}

export const createFileSchema = (t: TFunction) => {
  return z
    .instanceof(File)
    .refine(({ size }) => size > 0, { error: t("fileCannotBeEmpty") })
    .refine(({ size }) => size < 1024 * 512, { error: t("fileSizeTooLarge") })
    .refine(({ type }) => isMimeTypeMatch(type, ALLOWED_MIMETYPES), { error: t("fileTypeInvalid") })
}

export const createSubmitBrokerSchema = (t: TFunction) => {
  return z.object({
    broker_name: z.string().min(1, { error: t("required") }),
    broker_website: z.string().url({ error: t("invalidUrl") }).or(z.literal("")).optional(),
    description: z.string().optional(),
    headquarters: z.string().optional(),
    year_established: z.coerce.number().optional(),
    minimum_deposit: z.string().optional(),
    execution_types: z.string().optional(),
    regulators: z.string().optional(),
    trading_platforms: z.string().optional(),
    deposit_options: z.string().optional(),
    funding_methods: z.string().optional(),
    withdrawal_options: z.string().optional(),
    deposit_fees: z.string().optional(),
    inactivity_fee: z.string().optional(),
    withdrawal_fee: z.string().optional(),
    maximum_evaluation_fee: z.string().optional(),
    profit_share: z.string().optional(),
    daily_loss_limit: z.string().optional(),
    retail_loss_rate: z.string().optional(),
    minimum_raw_spreads: z.string().optional(),
    minimum_standard_spreads: z.string().optional(),
    minimum_commission_for_forex: z.string().optional(),
    average_trading_cost_eur_usd: z.string().optional(),
    average_trading_cost_gbp_usd: z.string().optional(),
    average_trading_cost_gold: z.string().optional(),
    average_trading_cost_bitcoin: z.string().optional(),
    average_trading_cost_wti_crude_oil: z.string().optional(),
    pros: z.string().optional(),
    cons: z.string().optional(),
    trading_hours: z.string().optional(),
    url: z.string().url().or(z.literal("")).optional(),
    newsletterOptIn: z.boolean().optional().default(true),
  })
}

export const createNewsletterSchema = (t: TFunction) => {
  return z.object({
    captcha: z.literal("").optional(),
    email: z.email({ error: t("invalidEmail") }),
  })
}

export const createReportToolSchema = (t: TFunction) => {
  return z.object({
    type: z.string().min(1, { error: t("required") }),
    email: z.email({ error: t("invalidEmail") }),
    message: z
      .string()
      .max(256, { error: issue => t("maxLength", { length: Number(issue.maximum) }) }),
    toolId: z.string(),
  })
}

export const createClaimToolEmailSchema = (t: TFunction) => {
  return z.object({
    toolId: z.string(),
    email: z.email({ error: t("invalidEmail") }),
  })
}

export const createClaimToolOtpSchema = (t: TFunction) => {
  return z.object({
    toolId: z.string(),
    otp: z.string().length(6, {
      error: issue => t("invalidLength", { length: Number(issue.minimum || issue.maximum) }),
    }),
  })
}

export const createAdDetailsSchema = (t: TFunction) => {
  return z.object({
    sessionId: z.string(),
    name: z.string().min(1, { error: t("required") }),
    description: z
      .string()
      .min(1, { error: t("required") })
      .max(160, { error: issue => t("maxLength", { length: Number(issue.maximum) }) }),
    websiteUrl: z
      .url({ protocol: /^https?$/, normalize: true, error: t("invalidUrl") })
      .min(1, { error: t("required") }),
    faviconUrl: z.string().optional(),
    bannerUrl: z.string().optional(),
    buttonLabel: z.string().optional(),
  })
}

export const createPreCheckoutAdSchema = (t: TFunction) => {
  return createAdDetailsSchema(t).omit({ sessionId: true }).and(checkoutSchema)
}

export const createFetchMediaSchema = (t: TFunction) => {
  return createPathSchema(t).extend({
    url: z
      .url({ protocol: /^https?$/, normalize: true, error: t("invalidUrl") })
      .min(1, { error: t("required") }),
    type: z.enum(["favicon", "screenshot"]).default("favicon"),
  })
}

export const createUploadMediaSchema = (t: TFunction) => {
  return createPathSchema(t).extend({
    file: createFileSchema(t),
  })
}
