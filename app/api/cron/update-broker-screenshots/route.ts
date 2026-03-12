import { revalidateTag } from "next/cache"
import { ToolStatus } from "~/.generated/prisma/client"
import { env } from "~/env"
import { fetchAndUploadMedia } from "~/lib/media"
import { db } from "~/services/db"

export const maxDuration = 300 // 5 minutes

export async function GET(req: Request) {
  if (req.headers.get("authorization") !== `Bearer ${env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 })
  }

 const brokers = await db.brokers.findMany({
  where: {
    status: ToolStatus.Published,
    screenshotUrl: null,
    broker_website: {
      not: "",
    },
  },
});
  

  console.info(`Updating screenshots for ${brokers.length} brokers`)

  const results = []
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  for (const broker of brokers) {
    const url = broker.broker_website || broker.url
    if (!url) {
      results.push({ id: broker.id, slug: broker.slug, success: false, error: "No URL found" })
      continue
    }

    try {
      const cleanUrl = url.startsWith("http") ? url : `https://${url}`
      const path = `brokers/${broker.slug}/screenshot`

      console.info(`[${broker.slug}] Fetching screenshot...`)
      const screenshotUrl = await fetchAndUploadMedia(cleanUrl, path, "screenshot")
      console.log("🚀 ~ GET ~ screenshotUrl:", screenshotUrl)

      if (screenshotUrl) {
        await db.brokers.update({
          where: { id: broker.id },
          data: { screenshotUrl },
        })

        revalidateTag(`broker-${broker.slug}`, "infinite")
        results.push({ id: broker.id, slug: broker.slug, success: true })
      } else {
        results.push({ id: broker.id, slug: broker.slug, success: false, error: "Upload failed" })
      }

      // Add a 3-second delay between requests to stay within the 20 requests/minute limit
      // of the ScreenshotOne API (60s / 3s = 20)
      console.info(`[${broker.slug}] Waiting 3s for rate limiting...`)
      await wait(3000)
    } catch (error) {
      console.error(`Failed to update screenshot for ${broker.slug}:`, error)
      results.push({ id: broker.id, slug: broker.slug, success: false, error: String(error) })
      
      // Still wait even on failure to respect rate limits
      await wait(1000)
    }
  }

  // Revalidate brokers list
  revalidateTag("brokers", "infinite")

  // Disconnect from DB
  await db.$disconnect()

  return Response.json({ success: true, processed: results.length, details: results })
}
