import { cacheLife, cacheTag } from "next/cache"
import { type Prisma, AdStatus } from "~/.generated/prisma/client"
import { getPresignedUrlFromFull } from "~/lib/media"
import { adManyPayload, adOnePayload } from "~/server/web/ads/payloads"
import { db } from "~/services/db"

export const findAds = async ({ orderBy, ...args }: Prisma.AdFindManyArgs) => {
  "use cache"

  cacheTag("ads")
  cacheLife("hours")

  const ads = await db.ad.findMany({
    ...args,
    orderBy: orderBy ?? { startsAt: "asc" },
    where: { status: { in: [AdStatus.Scheduled, AdStatus.Published] }, ...args.where },
    select: adManyPayload,
  })

  return Promise.all(
    ads.map(async ad => ({
      ...ad,
      faviconUrl: (await getPresignedUrlFromFull(ad.faviconUrl, 604800)) as string | null,
    })),
  )
}

export const findActiveAds = async ({ where, orderBy, ...args }: Prisma.AdFindManyArgs) => {
  "use cache"

  cacheTag("ads")
  cacheLife("hours")

  const ads = await db.ad.findMany({
    ...args,
    orderBy: orderBy ?? { startsAt: "asc" },
    where: { 
      startsAt: { lte: new Date() }, 
      endsAt: { gt: new Date() }, 
      status: { in: [AdStatus.Scheduled, AdStatus.Published] },
      ...where 
    },
    select: adOnePayload,
  })

  return Promise.all(
    ads.map(async ad => ({
      ...ad,
      faviconUrl: (await getPresignedUrlFromFull(ad.faviconUrl, 604800)) as string | null,
      bannerUrl: (await getPresignedUrlFromFull(ad.bannerUrl, 604800)) as string | null,
    })),
  )
}
