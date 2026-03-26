import { isTruthy } from "@primoui/utils"
import { endOfDay, startOfDay } from "date-fns"
import type { Prisma } from "~/.generated/prisma/client"
import type { PaymentListParams } from "~/server/admin/payments/schema"
import { db } from "~/services/db"

export const findPayments = async (search: PaymentListParams, where?: Prisma.PaymentWhereInput) => {
  const { email, status, gateway, page, perPage, sort, from, to, operator } = search

  // Offset to paginate the results
  const offset = (page - 1) * perPage

  // Column and order to sort by
  const orderBy = sort.map(item => ({ [item.id]: item.desc ? "desc" : "asc" }) as const)

  // Convert the date strings to Date objects and adjust the range
  const fromDate = from ? startOfDay(new Date(from)) : undefined
  const toDate = to ? endOfDay(new Date(to)) : undefined

  const expressions: (Prisma.PaymentWhereInput | undefined)[] = [
    // Filter by user email
    email ? { user: { email: { contains: email, mode: "insensitive" } } } : undefined,

    // Filter by gateway
    gateway ? { gateway: { contains: gateway, mode: "insensitive" } } : undefined,

    // Filter by status
    status && status.length > 0 ? { status: { in: status } } : undefined,

    // Filter by createdAt
    fromDate || toDate ? { createdAt: { gte: fromDate, lte: toDate } } : undefined,
  ]

  const whereQuery: Prisma.PaymentWhereInput = {
    [operator.toUpperCase()]: expressions.filter(isTruthy),
  }

  // Transaction is used to ensure both queries are executed in a single transaction
  const [payments, paymentsTotal] = await db.$transaction([
    db.payment.findMany({
      where: { ...whereQuery, ...where },
      include: {
        user: true,
        plan: true,
        broker: true,
      },
      orderBy: [...orderBy, { createdAt: "desc" }],
      take: perPage,
      skip: offset,
    }),

    db.payment.count({
      where: { ...whereQuery, ...where },
    }),
  ])

  const pageCount = Math.ceil(paymentsTotal / perPage)
  return { payments, paymentsTotal, pageCount }
}

export const findPaymentById = async (id: string) => {
  return db.payment.findUnique({
    where: { id },
    include: {
      user: true,
      plan: true,
      broker: true,
    },
  })
}
