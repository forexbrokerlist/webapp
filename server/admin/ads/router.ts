import { adminProcedure } from "~/lib/orpc"
import { findAds } from "~/server/admin/ads/queries"
import { adListSchema, adSchema } from "~/server/admin/ads/schema"
import { idSchema, idsSchema } from "~/server/admin/shared/schema"
import { AdStatus } from "~/.generated/prisma/client"
import { notifyAdvertiserOfAdStatusChange } from "~/lib/notifications"
import { after } from "next/server"

const list = adminProcedure.input(adListSchema).handler(async ({ input }) => {
  return findAds(input)
})

const upsert = adminProcedure
  .input(adSchema)
  .handler(async ({ input, context: { db, revalidate } }) => {
    const { id, ...data } = input

    const ad = id
      ? await db.ad.update({
          where: { id },
          data,
        })
      : await db.ad.create({
          data,
        })

    if (id && data.status && data.status !== ad.status) {
      after(async () => await notifyAdvertiserOfAdStatusChange(ad))
    }

    revalidate({
      tags: ["ads"],
    })

    return ad
  })

const duplicate = adminProcedure
  .input(idSchema)
  .handler(async ({ input: { id }, context: { db, revalidate } }) => {
    const ad = await db.ad.findUnique({
      where: { id },
    })

    if (!ad) {
      throw new Error("Ad not found")
    }

    const newAd = await db.ad.create({
      data: {
        name: `${ad.name} (Copy)`,
        email: ad.email,
        description: ad.description,
        websiteUrl: ad.websiteUrl,
        faviconUrl: ad.faviconUrl,
        bannerUrl: ad.bannerUrl,
        buttonLabel: ad.buttonLabel,
        type: ad.type,
        categoryId: ad.categoryId,
        subcategoryId: ad.subcategoryId,
        startsAt: ad.startsAt,
        endsAt: ad.endsAt,
      },
    })

    revalidate({
      tags: ["ads"],
    })

    return newAd
  })

const approve = adminProcedure
  .input(idSchema)
  .handler(async ({ input: { id }, context: { db, revalidate } }) => {
    const ad = await db.ad.update({
      where: { id },
      data: { status: AdStatus.Scheduled },
    })

    after(async () => await notifyAdvertiserOfAdStatusChange(ad))

    revalidate({
      tags: ["ads"],
    })

    return ad
  })

const reject = adminProcedure
  .input(idSchema)
  .handler(async ({ input: { id }, context: { db, revalidate } }) => {
    const ad = await db.ad.update({
      where: { id },
      data: { status: AdStatus.Draft },
    })

    after(async () => await notifyAdvertiserOfAdStatusChange(ad))

    revalidate({
      tags: ["ads"],
    })

    return ad
  })

const remove = adminProcedure
  .input(idsSchema)
  .handler(async ({ input: { ids }, context: { db, revalidate } }) => {
    await db.ad.deleteMany({
      where: { id: { in: ids } },
    })

    revalidate({
      tags: ["ads"],
    })

    return true
  })

export const adRouter = {
  list,
  upsert,
  duplicate,
  approve,
  reject,
  remove,
}
