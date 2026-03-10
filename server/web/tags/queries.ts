import { cacheLife, cacheTag } from "next/cache"
import { type Prisma, ToolStatus } from "~/.generated/prisma/client"
import { tagManyPayload, tagOnePayload } from "~/server/web/tags/payloads"
import type { TagsFilterParams } from "~/server/web/tags/schema"
import { db } from "~/services/db"

export const searchTags = async (search: TagsFilterParams, where?: Prisma.TagWhereInput) => {
  "use cache"

  cacheTag("tags")
  cacheLife("infinite")

  const { q, letter, sort, page, perPage } = search
  const skip = (page - 1) * perPage
  const take = perPage
  const [sortBy, sortOrder] = sort.split(".")

  const whereQuery: Prisma.TagWhereInput = {
    brokers: { some: { status: ToolStatus.Published } },
    ...(q && { name: { contains: q, mode: "insensitive" } }),
  }

  // Filter by letter if provided
  if (letter) {
    if (/^[A-Za-z]$/.test(letter)) {
      // Single alphabet letter - find tags starting with this letter
      whereQuery.name = {
        startsWith: letter.toUpperCase(),
        mode: "insensitive",
      }
    } else {
      // Non-alphabetic character (e.g., "#" for numbers/symbols) - find tags that don't start with alphabet letters
      whereQuery.NOT = {
        OR: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(char => ({
          name: { startsWith: char, mode: "insensitive" },
        })),
      }
    }
  }

  console.log("🚀 ~ searchTags ~ whereQuery:", whereQuery, where)
  const [tags, total] = await db.$transaction([
    db.tag.findMany({
      orderBy: sortBy ? { [sortBy]: sortOrder } : [{ brokers: { _count: "desc" } }, { name: "asc" }],
      where: { ...whereQuery, ...where },
      select: tagManyPayload,
      take,
      skip,
    }),

    db.tag.count({
      where: { ...whereQuery, ...where },
    }),
  ])
  console.log("🚀 ~ searchTags ~ total:", total, tags)

  return { tags, total, page, perPage }
}

export const findTagSlugs = async ({ where, orderBy, ...args }: Prisma.TagFindManyArgs) => {
  "use cache"

  cacheTag("tags")
  cacheLife("infinite")

  return db.tag.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { brokers: { some: { status: ToolStatus.Published } }, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const findTags = async ({
  where,
  orderBy,
  all,
  ...args
}: Prisma.TagFindManyArgs & { all?: boolean } = {}) => {
  "use cache"

  cacheTag("tags")
  cacheLife("infinite")

  const baseWhere: Prisma.TagWhereInput = all
    ? {}
    : {
        OR: [
          { tools: { some: { status: ToolStatus.Published } } },
          { brokers: { some: { status: ToolStatus.Published } } },
        ],
      }

  return db.tag.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { ...baseWhere, ...where },
    select: tagManyPayload,
  })
}

export const findTag = async ({ where, ...args }: Prisma.TagFindFirstArgs = {}) => {
  "use cache"

  cacheTag("tag", `tag-${where?.slug}`)
  cacheLife("infinite")

  return db.tag.findFirst({
    ...args,
    where,
    select: tagOnePayload,
  })
}
