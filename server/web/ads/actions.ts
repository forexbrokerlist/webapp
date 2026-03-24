"use server"

import { getDomain } from "@primoui/utils"
import { getTranslations } from "next-intl/server"
import z from "zod"
import { AdType, Prisma } from "~/.generated/prisma/client"
import { adsConfig } from "~/config/ads"
import { siteConfig } from "~/config/site"
import { fetchAndUploadMedia } from "~/lib/media"
import { actionClient } from "~/lib/safe-actions"
import type { AdOne } from "~/server/web/ads/payloads"
import { findActiveAds } from "~/server/web/ads/queries"
import { createAdDetailsSchema, createPreCheckoutAdSchema } from "~/server/web/shared/schema"
import { redirect } from "next/navigation"
import { getServerSession } from "~/lib/auth"
import crypto from "crypto"
import { env } from "~/env"
import { cregis } from "~/services/cregis"

const findAdWithFallbackSchema = z.object({
  type: z.enum(AdType),
  explicitAd: z
    .object({
      type: z.enum(AdType),
      websiteUrl: z.url(),
      name: z.string(),
      description: z.string().nullish(),
      buttonLabel: z.string().nullish(),
      faviconUrl: z.url().nullish(),
      bannerUrl: z.url().nullish(),
    })
    .nullish(),
  fallback: z.array(z.enum(["all", "default"])).default(["all", "default"]),
})

/**
 * Finds an ad based on the provided parameters.
 * @param input - The ad data to find.
 * @returns The ad that was found or null if not found.
 */
export const findAdWithFallback = actionClient
  .inputSchema(findAdWithFallbackSchema)
  .action(async ({ parsedInput: { type, explicitAd, fallback } }) => {
    const t = await getTranslations("ads")
    let ads: AdOne[] = []

    const defaultAd = {
      id: siteConfig.slug,
      type: AdType.All,
      websiteUrl: `${siteConfig.url}/advertise`,
      name: t("default_ad.name"),
      description: t("default_ad.description"),
      buttonLabel: t("default_ad.button_label", { siteName: siteConfig.name }),
      faviconUrl: "/favicon.png",
      bannerUrl: null,
      status: "Draft" as const,
      categoryId: null,
      subcategoryId: null,
    } satisfies AdOne

    if (!adsConfig.enabled) {
      return null
    }

    if (explicitAd !== undefined) {
      // If ad is explicitly provided, use it directly
      return explicitAd as AdOne | null
    }

    if (type) {
      // Try to find ad for specific type
      ads = await findActiveAds({ where: { type } })
    }

    if (!ads.length && fallback.includes("all")) {
      // Try fallback to "All" type if enabled and specific type not found
      ads = await findActiveAds({ where: { type: "All" } })
    }

    if (!ads.length && fallback.includes("default")) {
      // Try fallback to default ad if enabled and no ad found
      return defaultAd
    }

    if (!ads.length) {
      // Return null if no ads found
      return null
    }

    if (ads.length === 1) {
      return ads[0]
    }

    // Return a random ad from the matching ones
    return ads[Math.floor(Math.random() * ads.length)]
  })

export const createAdFromCheckout = actionClient
  .inputSchema(async () => {
    const t = await getTranslations("schema")
    return createAdDetailsSchema(t)
  })
  .action(async ({ parsedInput: { sessionId, ...adDetails }, ctx: { db, revalidate } }) => {
    // In the new flow, sessionId will be the order_id from Cregis
    const payment = await db.payment.findUnique({
      where: { orderId: sessionId },
    })

    if (!payment) {
      throw new Error("Payment record not found")
    }

    if (payment.status !== "Paid" && payment.status !== "Pending") {
       // We allow "Pending" if we want to create the record before the webhook hits,
       // but typically we'd wait for "Paid". However, existing logic seems to create ads as "Pending" status anyway.
    }

    const email = payment.metadata && typeof payment.metadata === 'object' && 'email' in payment.metadata ? (payment.metadata.email as string) : ""
    const ads: { type: AdType; startsAt: Date; endsAt: Date }[] = []

    const adDomain = getDomain(adDetails.websiteUrl)
    const faviconPath = `ads/${adDomain}/favicon`

    // Upload favicon
    const faviconUrl = adDetails.faviconUrl || (await fetchAndUploadMedia(adDetails.websiteUrl, faviconPath, "favicon"))

    // Validate supplied subcategoryId to avoid FK errors
    let resolvedSubcategoryId: string | undefined = undefined
    if (adDetails.subcategoryId) {
      const sub = await db.subcategory.findUnique({ where: { id: adDetails.subcategoryId } })
      if (!sub) {
        // If the provided subcategory doesn't exist, ignore it to avoid a FK violation
        console.warn(`Invalid subcategoryId provided in ad details: ${adDetails.subcategoryId} — ignoring`) 
        resolvedSubcategoryId = undefined
      } else {
        resolvedSubcategoryId = adDetails.subcategoryId
      }
    }

    // Check if ads already exist for specific sessionId
    const existingAds = await db.ad.findMany({
      where: { sessionId },
    })

    // If ads already exist, update them
    if (existingAds.length) {
      try {
        await db.ad.updateMany({
          where: { sessionId },
          data: {
            ...adDetails,
            subcategoryId: resolvedSubcategoryId,
            faviconUrl,
            status: "Pending",
          },
        })
      } catch (err) {
        console.error("Failed updating existing ads for session", {
          sessionId,
          adDetails,
          resolvedSubcategoryId,
          error: err,
        })
        throw err
      }

      // Revalidate the cache
      revalidate({ tags: ["ads"] })

      return { success: true }
    }

    const metadata = payment.metadata as any
    if (!metadata?.ads) {
      throw new Error("Invalid session for ad creation")
    }

    const adsSchema = z.array(
      z.object({
        type: z.enum(AdType),
        startsAt: z.coerce.number().transform(date => new Date(date)),
        endsAt: z.coerce.number().transform(date => new Date(date)),
      }),
    )

    // Parse the ads from the session metadata
    const parsedAds = adsSchema.parse(JSON.parse(metadata.ads))

    // Add ads to create later
    ads.push(...parsedAds)

    // Create ads in a transaction
    try {
      await db.$transaction(
        ads.map(ad =>
          db.ad.create({
            data: {
              ...ad,
              categoryId: adDetails.categoryId,
              subcategoryId: resolvedSubcategoryId,
              name: adDetails.name,
              description: adDetails.description,
              websiteUrl: adDetails.websiteUrl,
              buttonLabel: adDetails.buttonLabel,
              faviconUrl,
              sessionId,
              email,
              status: "Pending",
            },
          }),
        ),
      )
    } catch (err) {
      console.error("Failed creating ads in transaction", {
        sessionId,
        adDetails,
        resolvedSubcategoryId,
        ads,
        error: err,
      })
      throw err
    }

    // Revalidate the cache
    revalidate({ tags: ["ads"] })

    return { success: true }
  })

export const createDraftAdAndCheckout = actionClient
  .inputSchema(async () => {
    const t = await getTranslations("schema")
    return createPreCheckoutAdSchema(t)
  })
  .action(
    async ({
      parsedInput: {
        lineItems,
        successUrl,
        cancelUrl,
        mode,
        metadata,
        coupon,
        name,
        description,
        websiteUrl,
        buttonLabel,
        faviconUrl,
        bannerUrl,
        categoryId,
        subcategoryId,
      },
      ctx: { db },
    }) => {
      const session = await getServerSession()
      const customerEmail = session?.user.email
      const customerName = session?.user.name ?? "User"
      const userId = session?.user.id

      if (!session?.user || !customerEmail || !userId) {
        throw new Error("You must be logged in to create an ad")
      }

      let totalAmount = 0
      for (const item of lineItems) {
        if ("price_data" in item) {
          totalAmount += (item.price_data.unit_amount / 100) * item.quantity
        } else if ("price" in item) {
          // If ads use fixed prices, we'd need to resolve them here. 
          // Assuming ads might use custom price_data from the frontend for now.
        }
      }

      const nonce = crypto.randomBytes(3).toString("hex")
      const timestamp = Math.floor(Date.now() / 1000)
      const orderId = `${nonce}${timestamp}`

      // Create a Payment record in the DB
      // Use a relation connect for the required `user` relation so Prisma accepts the create
      const paymentResponse = await db.payment.create({
        data: {
          user: { connect: { id: userId } },
          // Ad payments are not tied to a specific broker or plan in this flow,
          // so we omit those relation fields when they're not applicable.
          amount: totalAmount,
          currency: "USD",
          gateway: "cregis",
          orderId,
          status: "Pending",
          metadata: { ...metadata, email: customerEmail } as any,
        },
      })
      console.log("🚀 ~ paymentResponse:", paymentResponse)

      const cregisResponse = await cregis.createCheckout({
        order_id: orderId,
        order_amount: totalAmount,
        order_currency: "USD",
        callback_url: `${env.CREJIS_WEBHOOK_URL}cregis/webhooks`,
        remark: JSON.stringify({ type: "ad", ...metadata }),
        payer_id: userId,
        payer_name: customerName,
        payer_email: customerEmail,
        timestamp,
        nonce,
        valid_time: 10,
        success_url: `${siteConfig.url}${successUrl}?sessionId=${orderId}`, // Keep 'sessionId' key to avoid frontend breaking
        cancel_url: cancelUrl ? `${siteConfig.url}${cancelUrl}?cancelled=true` : undefined,
      })
      console.log("🚀 ~ cregisResponse:", cregisResponse)

      if (cregisResponse.code !== "00000" || !cregisResponse.data.checkout_url) {
        throw new Error(`Cregis Error: ${cregisResponse.msg}`)
      }

      // Upload favicon (background)
      const adDomain = getDomain(websiteUrl)
      const faviconPath = `ads/${adDomain}/favicon`
      const resolvedFaviconUrl = faviconUrl || (await fetchAndUploadMedia(websiteUrl, faviconPath, "favicon"))

      let parsedAds: Omit<
        Omit<Prisma.AdUncheckedCreateInput, "email">,
        "sessionId" | "name" | "description" | "websiteUrl" | "buttonLabel" | "faviconUrl" | "bannerUrl"
      >[] = []

      if (mode === "payment" && metadata?.ads) {
        const adsSchema = z.array(
          z.object({
            type: z.enum(AdType),
            startsAt: z.coerce.number().transform(date => new Date(date)),
            endsAt: z.coerce.number().transform(date => new Date(date)),
          }),
        )

        parsedAds = adsSchema.parse(JSON.parse(metadata.ads))
      }

      // Validate supplied subcategoryId to avoid FK errors for draft creation
      let resolvedSubcategoryId: string | undefined = undefined
      if (subcategoryId) {
        const sub = await db.subcategory.findUnique({ where: { id: subcategoryId } })
        if (!sub) {
          console.warn(`Invalid subcategoryId provided when creating draft ad: ${subcategoryId} — ignoring`)
          resolvedSubcategoryId = undefined
        } else {
          resolvedSubcategoryId = subcategoryId
        }
      }

      const adDetails = {
        name,
        description,
        websiteUrl,
        buttonLabel,
        sessionId: orderId,
        email: customerEmail,
        faviconUrl: resolvedFaviconUrl,
        bannerUrl,
        categoryId,
        subcategoryId: resolvedSubcategoryId,
      } as const

      // Create Draft ad records per line item mapped in metadata
      if (parsedAds.length > 0) {
        try {
          await db.$transaction(parsedAds.map(ad => db.ad.create({ data: { ...ad, ...adDetails } })))
        } catch (err) {
          console.error("Failed creating draft ads in transaction", {
            orderId,
            adDetails,
            resolvedSubcategoryId,
            parsedAds,
            error: err,
          })
          throw err
        }
      }

      // Redirect to the checkout session url
      redirect(cregisResponse.data.checkout_url)
    },
  )

export const trackAdClick = actionClient
  .inputSchema(z.object({ adId: z.string() }))
  .action(async ({ parsedInput: { adId }, ctx: { db } }) => {
    try {
      // Validate that the ad exists before updating
      const ad = await db.ad.findUnique({
        where: { id: adId },
        select: { id: true, status: true },
      })

      if (!ad) {
        console.warn(`Ad not found for click tracking: ${adId}`)
        return { success: false, error: "Ad not found" }
      }

      // Only track clicks for active ads
      if (ad.status !== "Scheduled") {
        console.warn(`Attempted to track click for non-active ad: ${adId}, status: ${ad.status}`)
        return { success: false, error: "Ad is not active" }
      }

      await db.ad.update({
        where: { id: adId },
        data: { clicks: { increment: 1 } },
      })

      return { success: true }
    } catch (error) {
      console.error(`Failed to track ad click for ${adId}:`, error)
      return { success: false, error: "Failed to track click" }
    }
  })

export const trackAdImpression = actionClient
  .inputSchema(z.object({ adId: z.string() }))
  .action(async ({ parsedInput: { adId }, ctx: { db } }) => {
    try {
      // Validate that the ad exists before updating
      const ad = await db.ad.findUnique({
        where: { id: adId },
        select: { id: true, status: true },
      })

      if (!ad) {
        console.warn(`Ad not found for impression tracking: ${adId}`)
        return { success: false, error: "Ad not found" }
      }

      // Only track impressions for active ads
      if (ad.status !== "Scheduled") {
        console.warn(`Attempted to track impression for non-active ad: ${adId}, status: ${ad.status}`)
        return { success: false, error: "Ad is not active" }
      }

      await db.ad.update({
        where: { id: adId },
        data: { impressions: { increment: 1 } },
      })

      return { success: true }
    } catch (error) {
      console.error(`Failed to track ad impression for ${adId}:`, error)
      return { success: false, error: "Failed to track impression" }
    }
  })

