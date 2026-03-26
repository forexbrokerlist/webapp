import { db } from "~/services/db"
import type { FetchNewslettersInput } from "./schema"

export const fetchNewsletters = async (input: FetchNewslettersInput) => {
  const { page, limit, search } = input
  const skip = (page - 1) * limit

  const where = search
    ? {
        OR: [
          { email: { contains: search, mode: "insensitive" as const } },
          { firstName: { contains: search, mode: "insensitive" as const } },
          { lastName: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {}

  const [items, total] = await Promise.all([
    db.newsletter.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    db.newsletter.count({ where }),
  ])

  return {
    items,
    total,
    pageCount: Math.ceil(total / limit),
  }
}

export const deleteNewsletter = async (id: string) => {
  return db.newsletter.delete({
    where: { id },
  })
}
