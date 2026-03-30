import {
  createStandardSchemaV1,
  type inferParserType,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server"
import * as z from "zod"
import type { StandaloneFAQ } from "~/.generated/prisma/browser"
import { getSortingStateParser } from "~/lib/parsers"

export const faqListParams = {
  question: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(25),
  sort: getSortingStateParser<StandaloneFAQ>().withDefault([{ id: "createdAt", desc: true }]),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  operator: parseAsStringEnum(["and", "or"]).withDefault("and"),
}

export const faqListSchema = createStandardSchemaV1(faqListParams)
export type FAQListParams = inferParserType<typeof faqListParams>

export const faqSchema = z.object({
  id: z.string().optional(),
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
})

export type FAQSchema = z.infer<typeof faqSchema>
