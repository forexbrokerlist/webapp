import { redirect } from "next/navigation"
import { AdvertiserDashboardContent } from "~/app/(web)/advertiser/dashboard/content"
import { getServerSession } from "~/lib/auth"
import { findAdvertiserAds, getAdvertiserStats } from "~/server/web/advertiser/queries"

export const AdvertiserDashboard = async ({ searchParams }: PageProps<"/advertiser/dashboard">) => {
  const session = await getServerSession()

  if (!session?.user) {
    throw redirect("/auth/login?next=/advertiser/dashboard")
  }

  const [ads, stats] = await Promise.all([
    findAdvertiserAds(session.user.email),
    getAdvertiserStats(session.user.email),
  ])

  return <AdvertiserDashboardContent ads={ads} stats={stats} />
}
