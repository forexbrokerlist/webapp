import * as z from "zod";
import { ToolStatus, ToolTier } from "~/.generated/prisma/browser";

import {
  createSearchParamsCache,
  createStandardSchemaV1,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  parseAsBoolean,
} from "nuqs/server";
import { type Brokers } from "~/.generated/prisma/browser";
import { getSortingStateParser } from "~/lib/parsers";

export const brokerListParams = {
  broker_name: parseAsString.withDefault(""),
  sort: getSortingStateParser<Brokers>().withDefault([
    { id: "createdAt", desc: true },
  ]),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(25),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  operator: parseAsStringEnum(["and", "or"]).withDefault("and"),
  status: parseAsArrayOf(
    parseAsStringEnum(Object.values(ToolStatus)),
  ).withDefault([]),
  type: parseAsString,
  beginner_friendly: parseAsBoolean,
};

export const brokerListSchema = createStandardSchemaV1(brokerListParams);
export const brokerListCache = createSearchParamsCache(brokerListParams);
export type BrokerListParams = Awaited<
  ReturnType<typeof brokerListCache.parse>
>;

export const brokerSchema = z.object({
  id: z.number().optional(),
  broker_name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  broker_website: z.string().url().or(z.literal("")).optional(),
  overall_rating: z.string().optional(),
  description: z.string().optional(),
  headquarters: z.string().optional(),
  year_established: z.number().optional().nullable(),
  regulators: z.string().optional(),
  minimum_deposit: z.string().optional(),
  execution_types: z.string().optional(),
  trading_platforms: z.string().optional(),
  funding_methods: z.string().optional(),
  deposit_options: z.string().optional(),
  withdrawal_options: z.string().optional(),
  deposit_fees: z.string().optional(),
  withdrawal_fee: z.string().optional(),
  inactivity_fee: z.string().optional(),
  profit_share: z.string().optional(),
  retail_loss_rate: z.string().optional(),
  pros: z.string().optional(),
  cons: z.string().optional(),
  submitterName: z.string().optional(),
  submitterEmail: z.string().optional(),
  submitterNote: z.string().optional(),
  publishedAt: z.coerce.date().nullish(),
  status: z.enum(ToolStatus).default("Draft"),
  notifySubmitter: z.boolean().default(true),
  categoryIds: z.array(z.string()).optional(),
  subcategoryIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
  maximum_evaluation_fee: z.string().optional(),
  daily_loss_limit: z.string().optional(),
  minimum_raw_spreads: z.string().optional(),
  minimum_standard_spreads: z.string().optional(),
  minimum_commission_for_forex: z.string().optional(),
  average_trading_cost_eur_usd: z.string().optional(),
  average_trading_cost_gbp_usd: z.string().optional(),
  average_trading_cost_gold: z.string().optional(),
  average_trading_cost_bitcoin: z.string().optional(),
  average_trading_cost_wti_crude_oil: z.string().optional(),
  subtitle: z.string().optional(),
  screenshotUrl: z.string().url().or(z.literal("")).optional(),
  bannerUrl: z.string().url().or(z.literal("")).optional(),
  logoUrl: z.string().url().or(z.literal("")).optional(),
  typeId: z.string().nullish(),
  isSponsor: z.boolean().default(false),
  isMainSponsor: z.boolean().default(false),
  features: z.array(z.string()).optional(),
  socialProof: z.string().optional(),
  highlightedPoint: z.string().optional(),
  maxLeverage: z.string().optional(),
  totalInstruments: z.string().optional(),
  availableInIndia: z.boolean().default(false),
  islamicAccount: z.boolean().default(false),
  demoAccount: z.boolean().default(false),
  copyTrading: z.boolean().default(false),
  accountTypes: z.array(z.string()).optional(),
  beginner_friendly: z.boolean().default(false),
  review_article: z.string().optional(),
  seo_title: z.string().optional(),
  seo_meta_description: z.string().optional(),
  newer_traders_rating: z.number().optional().nullable(),
  scalpers_rating: z.number().optional().nullable(),
  swing_traders_rating: z.number().optional().nullable(),
  news_traders_rating: z.number().optional().nullable(),
  day_traders_rating: z.number().optional().nullable(),
  copy_traders_rating: z.number().optional().nullable(),
  automated_traders_rating: z.number().optional().nullable(),
  investors_rating: z.number().optional().nullable(),
  faqs: z.array(z.object({
    id: z.string().optional(),
    question: z.string().min(1, "Question is required"),
    answer: z.string().min(1, "Answer is required"),
  })).optional(),
});

export type BrokerSchema = z.infer<typeof brokerSchema>;
