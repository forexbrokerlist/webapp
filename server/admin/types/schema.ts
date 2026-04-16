import {
  createStandardSchemaV1,
  type inferParserType,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server"
import * as z from "zod"
import type { Type } from "~/.generated/prisma/browser"
import { getSortingStateParser } from "~/lib/parsers"

export const typeListParams = {
  name: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(25),
  sort: getSortingStateParser<Type>().withDefault([{ id: "name", desc: false }]),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  operator: parseAsStringEnum(["and", "or"]).withDefault("and"),
}

export const typeListSchema = createStandardSchemaV1(typeListParams)
export type TypeListParams = inferParserType<typeof typeListParams>

export const typeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  label: z.string().optional(),
  description: z.string().optional(),
  brokers: z.array(z.string()).optional(),
})

export type TypeSchema = z.infer<typeof typeSchema>
