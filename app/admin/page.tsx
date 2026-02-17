import { DashboardStats } from "~/app/admin/_components/dashboard-stats"
import { RevenueMetric } from "~/app/admin/_components/revenue-metric"
import { Calendar } from "~/app/admin/_components/schedule-calendar"
import { UserMetric } from "~/app/admin/_components/user-metric"
import { VisitorMetric } from "~/app/admin/_components/visitor-metric"
import { H3 } from "~/components/common/heading"
import { Wrapper } from "~/components/common/wrapper"

export default function () {
  return (
    <Wrapper size="lg" gap="xs">
      <H3>Dashboard</H3>

      <div className="flex flex-col gap-4">
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none *:shrink-0 *:flex-1 *:min-w-48 *:snap-center">
          <DashboardStats />
        </div>

        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none *:shrink-0 *:flex-1 *:min-w-72 *:snap-center">
          <VisitorMetric />
          <RevenueMetric />
          <UserMetric />
        </div>

        <Calendar className="w-full" />
      </div>
    </Wrapper>
  )
}
