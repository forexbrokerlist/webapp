import {
  createStandardSchemaV1,
  type inferParserType,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server"
import * as z from "zod"
import type { Post } from "~/.generated/prisma/browser"
import { getSortingStateParser } from "~/lib/parsers"

export const postListParams = {
  title: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(25),
  sort: getSortingStateParser<Post>().withDefault([{ id: "publishedAt", desc: true }]),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  operator: parseAsStringEnum(["and", "or"]).withDefault("and"),
}

export const postListSchema = createStandardSchemaV1(postListParams)
export type PostListParams = inferParserType<typeof postListParams>

export const postSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  content: z.string().min(1, "Content is required"),
  image: z.string().optional(),
  status: z.enum(["Draft", "Scheduled", "Pending", "Published"]).default("Published"),
  publishedAt: z.date().optional(),
  authorId: z.string().optional(),
  locale: z.string().default("en"),
})

export type PostSchema = z.infer<typeof postSchema>
