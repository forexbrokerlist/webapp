import { cacheLife, cacheTag } from "next/cache"
import { type Prisma, ToolStatus } from "~/.generated/prisma/client"
import { categoryManyPayload, categoryOnePayload } from "~/server/web/categories/payloads"
import { db } from "~/services/db"

export const findCategories = async ({ 
  where, 
  orderBy, 
  all,
  ...args 
}: Prisma.CategoryFindManyArgs & { all?: boolean } = {}) => {
  "use cache"

  cacheTag("categories")
  cacheLife("infinite")

  const baseWhere: Prisma.CategoryWhereInput = all 
    ? {} 
    : {
        OR: [
          { tools: { some: { status: ToolStatus.Published } } },
          { brokers: { some: { status: ToolStatus.Published } } }
        ]
      }

  return db.category.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { ...baseWhere, ...where },
    select: categoryManyPayload,
  })
}

export const findCategorySlugs = async ({
  where,
  orderBy,
  all,
  ...args
}: Prisma.CategoryFindManyArgs & { all?: boolean } = {}) => {
  "use cache"

  cacheTag("categories")
  cacheLife("infinite")

  const baseWhere: Prisma.CategoryWhereInput = all 
    ? {} 
    : {
        OR: [
          { tools: { some: { status: ToolStatus.Published } } },
          { brokers: { some: { status: ToolStatus.Published } } }
        ]
      }

  return db.category.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { ...baseWhere, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const findCategory = async ({ where, ...args }: Prisma.CategoryFindFirstArgs = {}) => {
  "use cache"

  cacheTag("category", `category-${where?.slug}`)
  cacheLife("infinite")

  return db.category.findFirst({
    ...args,
    where,
    select: categoryOnePayload,
  })
}
