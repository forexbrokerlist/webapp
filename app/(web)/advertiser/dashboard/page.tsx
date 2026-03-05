import { Suspense } from "react"
import { AdvertiserDashboard } from "~/app/(web)/advertiser/dashboard/dashboard"
import { DashboardSkeleton } from "~/app/(web)/advertiser/dashboard/skeleton"

export default async function (props: PageProps<"/advertiser/dashboard">) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <AdvertiserDashboard {...props} />
    </Suspense>
  )
}
