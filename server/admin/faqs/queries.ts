import { isTruthy } from "@primoui/utils"
import { endOfDay, startOfDay } from "date-fns"
import type { Prisma } from "~/.generated/prisma/client"
import type { FAQListParams } from "~/server/admin/faqs/schema"
import { db } from "~/services/db"

export const findFAQs = async (
  search: FAQListParams,
  where?: Prisma.StandaloneFAQWhereInput,
) => {
  const { question, page, perPage, sort, from, to, operator } = search

  // Offset to paginate results
  const offset = (page - 1) * perPage

  // Column and order to sort by
  const orderBy = sort.map(
    (item) => ({ [item.id]: item.desc ? "desc" : "asc" }) as const,
  )

  // Convert date strings to Date objects and adjust range
  const fromDate = from ? startOfDay(new Date(from)) : undefined
  const toDate = to ? endOfDay(new Date(to)) : undefined

  const expressions: (Prisma.StandaloneFAQWhereInput | undefined)[] = [
    // Filter by question
    question ? { question: { contains: question, mode: "insensitive" } } : undefined,

    // Filter by date range
    fromDate || toDate
      ? { createdAt: { gte: fromDate, lte: toDate } }
      : undefined,
  ]

  const whereQuery: Prisma.StandaloneFAQWhereInput = {
    [operator.toUpperCase()]: expressions.filter(isTruthy),
    ...where,
  }

  // Transaction is used to ensure both queries are executed in a single transaction
  const [faqs, faqsTotal] = await db.$transaction([
    db.standaloneFAQ.findMany({
      where: whereQuery,
      orderBy: [...orderBy, { createdAt: "desc" }],
      take: perPage,
      skip: offset,
    }),

    db.standaloneFAQ.count({
      where: whereQuery,
    }),
  ])

  const pageCount = Math.ceil(faqsTotal / perPage)
  return { faqs, faqsTotal, pageCount }
}

export const findFAQById = async (id: string) => {
  return db.standaloneFAQ.findUnique({
    where: { id },
  })
}
