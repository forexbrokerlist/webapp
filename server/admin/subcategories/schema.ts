import {
  createStandardSchemaV1,
  type inferParserType,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server"
import * as z from "zod"
import type { Subcategory } from "~/.generated/prisma/browser"
import { getSortingStateParser } from "~/lib/parsers"

export const subcategoryListParams = {
  name: parseAsString.withDefault(""),
  categoryId: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(25),
  sort: getSortingStateParser<Subcategory>().withDefault([{ id: "name", desc: false }]),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  operator: parseAsStringEnum(["and", "or"]).withDefault("and"),
}

export const subcategoryListSchema = createStandardSchemaV1(subcategoryListParams)
export type SubcategoryListParams = inferParserType<typeof subcategoryListParams>

export const subcategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  label: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  tools: z.array(z.string()).optional(),
})

export type SubcategorySchema = z.infer<typeof subcategorySchema>
