import { isTruthy } from "@primoui/utils"
import { endOfDay, startOfDay } from "date-fns"
import type { Prisma } from "~/.generated/prisma/client"
import { getPresignedUrlFromFull } from "~/lib/media"
import type { SponsorListParams } from "~/server/admin/sponsors/schema"
import { db } from "~/services/db"

export const findSponsors = async (search: SponsorListParams, where?: Prisma.SponsorWhereInput) => {
  const { name, page, perPage, sort, from, to, operator } = search

  const offset = (page - 1) * perPage
  const orderBy = sort.map((item) => ({ [item.id]: item.desc ? "desc" : "asc" }) as const)

  const fromDate = from ? startOfDay(new Date(from)) : undefined
  const toDate = to ? endOfDay(new Date(to)) : undefined

  const expressions: (Prisma.SponsorWhereInput | undefined)[] = [
    name ? { name: { contains: name, mode: "insensitive" } } : undefined,
    fromDate || toDate ? { createdAt: { gte: fromDate, lte: toDate } } : undefined,
  ]

  const whereQuery: Prisma.SponsorWhereInput = {
    [operator.toUpperCase()]: expressions.filter(isTruthy),
  }

  const [dbSponsors, sponsorsTotal] = await db.$transaction([
    db.sponsor.findMany({
      where: { ...whereQuery, ...where },
      orderBy: [...orderBy, { createdAt: "desc" }],
      take: perPage,
      skip: offset,
    }),
    db.sponsor.count({
      where: { ...whereQuery, ...where },
    })
  ])

  const sponsors = await Promise.all(
    dbSponsors.map(async (sponsor) => ({
      ...sponsor,
      logoUrl: (await getPresignedUrlFromFull(sponsor.logoUrl)) as string,
    }))
  )

  const pageCount = Math.ceil(sponsorsTotal / perPage)
  return { sponsors, sponsorsTotal, pageCount }
}

export const findSponsorById = async (id: string) => {
  const sponsor = await db.sponsor.findUnique({
    where: { id },
  })

  if (sponsor) {
    sponsor.logoUrl = (await getPresignedUrlFromFull(sponsor.logoUrl)) as string
  }

  return sponsor
}
