import { adminProcedure } from "~/lib/orpc"
import { findSponsors } from "~/server/admin/sponsors/queries"
import { sponsorListSchema, sponsorSchema } from "~/server/admin/sponsors/schema"
import { idSchema, idsSchema } from "~/server/admin/shared/schema"

const list = adminProcedure.input(sponsorListSchema).handler(async ({ input }) => {
  return findSponsors(input)
})

const upsert = adminProcedure
  .input(sponsorSchema)
  .handler(async ({ input, context: { db, revalidate } }) => {
    const { id, websiteUrl, ...data } = input

    // Handle empty websiteUrl literally
    const url = websiteUrl === "" ? null : websiteUrl

    // Strip presigned URL parameters if present
    let finalLogoUrl = data.logoUrl
    if (finalLogoUrl && finalLogoUrl.includes("X-Amz-Signature")) {
      try {
        const parsedUrl = new URL(finalLogoUrl)
        parsedUrl.search = ""
        finalLogoUrl = parsedUrl.toString()
      } catch (e) {
        // Ignore parsing errors
      }
    }

    const sponsor = id
      ? await db.sponsor.update({
          where: { id },
          data: { ...data, websiteUrl: url, logoUrl: finalLogoUrl },
        })
      : await db.sponsor.create({
          data: { ...data, websiteUrl: url, logoUrl: finalLogoUrl },
        })

    revalidate({
      tags: ["sponsors"],
    })

    return sponsor
  })

const duplicate = adminProcedure
  .input(idSchema)
  .handler(async ({ input: { id }, context: { db, revalidate } }) => {
    const sponsor = await db.sponsor.findUnique({
      where: { id },
    })

    if (!sponsor) {
      throw new Error("Sponsor not found")
    }

    const newSponsor = await db.sponsor.create({
      data: {
        name: `${sponsor.name} (Copy)`,
        logoUrl: sponsor.logoUrl,
        websiteUrl: sponsor.websiteUrl,
        isActive: sponsor.isActive,
        order: sponsor.order,
      },
    })

    revalidate({
      tags: ["sponsors"],
    })

    return newSponsor
  })

const remove = adminProcedure
  .input(idsSchema)
  .handler(async ({ input: { ids }, context: { db, revalidate } }) => {
    await db.sponsor.deleteMany({
      where: { id: { in: ids } },
    })

    revalidate({
      tags: ["sponsors"],
    })

    return true
  })

export const sponsorRouter = {
  list,
  upsert,
  duplicate,
  remove,
}
