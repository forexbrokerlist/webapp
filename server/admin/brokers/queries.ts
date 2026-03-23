import { type Prisma, ToolStatus } from "~/.generated/prisma/client"
import { db } from "~/services/db"

export const findBrokers = async (params: any = {}) => {
  // Implement a basic findBrokers for the list view
  return db.brokers.findMany({
    orderBy: { createdAt: "desc" },
    ...params.where ? { where: params.where } : {},
    ...params.skip !== undefined ? { skip: params.skip } : {},
    ...params.take !== undefined ? { take: params.take } : {},
    include: {
      payments: {
        orderBy: { createdAt: "desc" },
        take: 1
      }
    }
  })
}

export const findScheduledBrokers = async ({ where, ...args }: Prisma.BrokersFindManyArgs = {}) => {
  return db.brokers.findMany({
    ...args,
    where: { status: { in: [ToolStatus.Published, ToolStatus.Scheduled] }, ...where },
    select: { id: true, slug: true, broker_name: true, status: true, publishedAt: true },
    orderBy: { publishedAt: "asc" },
  })
}

export const findBrokerList = async ({ ...args }: Prisma.BrokersFindManyArgs = {}) => {
  return db.brokers.findMany({
    ...args,
    select: { id: true, broker_name: true },
    orderBy: { broker_name: "asc" },
  })
}

export const findBrokerById = async (id: number) => {
  return db.brokers.findUnique({
    where: { id },
    include: {
      categories: { select: { id: true, name: true } },
      subcategories: { select: { id: true, name: true } },
      tags: { select: { id: true, name: true } },
    },
  })
}
