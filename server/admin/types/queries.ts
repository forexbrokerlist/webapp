import { isTruthy } from "@primoui/utils"
import { endOfDay, startOfDay } from "date-fns"
import type { Prisma } from "~/.generated/prisma/client"
import type { TypeListParams } from "~/server/admin/types/schema"
import { db } from "~/services/db"

export const findTypes = async (
  search: TypeListParams,
  where?: Prisma.TypeWhereInput,
) => {
  const { name, page, perPage, sort, from, to, operator } = search

  // Offset to paginate the results
  const offset = (page - 1) * perPage

  // Column and order to sort by
  const orderBy = sort.map(item => ({ [item.id]: item.desc ? "desc" : "asc" }) as const)

  // Convert the date strings to Date objects and adjust the range
  const fromDate = from ? startOfDay(new Date(from)) : undefined
  const toDate = to ? endOfDay(new Date(to)) : undefined

  const expressions: (Prisma.TypeWhereInput | undefined)[] = [
    // Filter by name
    name ? { name: { contains: name, mode: "insensitive" } } : undefined,

    // Filter by createdAt
    fromDate || toDate ? { createdAt: { gte: fromDate, lte: toDate } } : undefined,
  ]

  const whereQuery: Prisma.TypeWhereInput = {
    [operator.toUpperCase()]: expressions.filter(isTruthy),
  }

  // Transaction is used to ensure both queries are executed in a single transaction
  const [types, typesTotal] = await db.$transaction([
    db.type.findMany({
      where: { ...whereQuery, ...where },
      orderBy: [...orderBy, { createdAt: "asc" }],
      take: perPage,
      skip: offset,
      include: { _count: { select: { brokers: true } } },
    }),

    db.type.count({
      where: { ...whereQuery, ...where },
    }),
  ])

  const pageCount = Math.ceil(typesTotal / perPage)
  return { types, typesTotal, pageCount }
}

export const findTypeList = async ({ ...args }: Prisma.TypeFindManyArgs = {}) => {
  return db.type.findMany({
    ...args,
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })
}

export const findTypeById = async (id: string) => {
  return db.type.findUnique({
    where: { id },
    include: {
      brokers: { select: { id: true } },
    },
  })
}
