import { type Prisma } from "~/.generated/prisma/client"
import { db } from "~/services/db"
import type { SubcategoryListParams } from "~/server/admin/subcategories/schema"

export const findSubcategories = async (
  search: SubcategoryListParams,
  where?: Prisma.SubcategoryWhereInput,
) => {
  const { name, categoryId, sort, page, perPage } = search

  const skip = (page - 1) * perPage
  const take = perPage
  const [sortField, sortOrder] = sort.length ? [sort[0]?.id as string, sort[0]?.desc ? "desc" : "asc"] : ["id", "desc"]

  const whereQuery: Prisma.SubcategoryWhereInput = {
    ...(name && { name: { contains: name, mode: "insensitive" } }),
    ...(categoryId && { categoryId }),
  }

  const [subcategories, total] = await Promise.all([
    db.subcategory.findMany({
      orderBy: { [sortField]: sortOrder },
      where: { ...whereQuery, ...where },
      include: {
        category: { select: { id: true, name: true } },
        _count: { select: { tools: true, brokers: true } },
      },
      take,
      skip,
    }),

    db.subcategory.count({
      where: { ...whereQuery, ...where },
    }),
  ])

  const pageCount = Math.ceil(total / perPage)

  return { subcategories, total, pageCount }
}

export const findSubcategoryList = async ({ ...args }: Prisma.SubcategoryFindManyArgs = {}) => {
  return db.subcategory.findMany({
    ...args,
    select: { id: true, name: true, categoryId: true },
    orderBy: { name: "asc" },
  })
}

export const findSubcategoryById = async (id: string) => {
  return db.subcategory.findUnique({
    where: { id },
    include: {
      tools: {
        select: {
          id: true,
        },
      },
    },
  })
}
