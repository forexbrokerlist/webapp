import { db } from "~/services/db"
import type { FetchContactsInput } from "./schema"

export const fetchContacts = async (input: FetchContactsInput) => {
  const { page, limit, search } = input
  const skip = (page - 1) * limit

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { subject: { contains: search, mode: "insensitive" as const } },
          { message: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {}

  const [items, total] = await Promise.all([
    db.contactUs.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    db.contactUs.count({ where }),
  ])

  return {
    items,
    total,
    pageCount: Math.ceil(total / limit),
  }
}

export const deleteContact = async (id: string) => {
  return db.contactUs.delete({
    where: { id },
  })
}
