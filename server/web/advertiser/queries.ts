import type { Prisma } from "~/.generated/prisma/client"
import { db } from "~/services/db"

export const findAdvertiserAds = async (email: string) => {
  const ads = await db.ad.findMany({
    where: { email },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      sessionId: true,
      name: true,
      description: true,
      websiteUrl: true,
      faviconUrl: true,
      bannerUrl: true,
      buttonLabel: true,
      type: true,
      status: true,
      startsAt: true,
      endsAt: true,
      clicks: true,
      impressions: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return ads
}

export const getAdvertiserStats = async (email: string) => {
  const ads = await db.ad.findMany({
    where: { email },
    select: {
      clicks: true,
      impressions: true,
      startsAt: true,
      endsAt: true,
      status: true,
    },
  })

  const totalImpressions = ads.reduce((sum, ad) => sum + ad.impressions, 0)
  const totalClicks = ads.reduce((sum, ad) => sum + ad.clicks, 0)
  const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0

  // Calculate days remaining for active campaigns
  const now = new Date()
  const activeAds = ads.filter(ad => 
    ad.status === "Scheduled" && 
    ad.startsAt <= now && 
    ad.endsAt >= now
  )
  
  const daysRemaining = activeAds.length > 0 
    ? Math.min(...activeAds.map(ad => 
        Math.ceil((ad.endsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      ))
    : 0

  return {
    totalImpressions,
    totalClicks,
    ctr: Math.round(ctr * 100) / 100, // Round to 2 decimal places
    daysRemaining: Math.max(0, daysRemaining),
    activeCampaigns: activeAds.length,
    totalCampaigns: ads.length,
  }
}
