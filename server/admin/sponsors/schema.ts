import {
  createStandardSchemaV1,
  type inferParserType,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server"
import * as z from "zod"
import { type Sponsor, SponsorCategory } from "~/.generated/prisma/browser"
import { getSortingStateParser } from "~/lib/parsers"

export const sponsorListParams = {
  name: parseAsString.withDefault(""),
  isActive: parseAsBoolean.withDefault(true),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(25),
  sort: getSortingStateParser<Sponsor>().withDefault([{ id: "order", desc: false }]),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  operator: parseAsStringEnum(["and", "or"]).withDefault("and"),
  category: parseAsStringEnum(Object.values(SponsorCategory)),
}

export const sponsorListSchema = createStandardSchemaV1(sponsorListParams)
export type SponsorListParams = inferParserType<typeof sponsorListParams>

export const sponsorSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  logoUrl: z.url({ protocol: /^https?$/, normalize: true }).min(1, "Logo URL is required"),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
  order: z.number().int().default(0),
  category: z.nativeEnum(SponsorCategory).default(SponsorCategory.BrokerListing),
})

export type SponsorSchema = z.infer<typeof sponsorSchema>
