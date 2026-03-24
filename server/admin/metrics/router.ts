import { format } from "date-fns"
// import { getPlausibleVisitors } from "~/lib/analytics"
import { calculateMetricStats, fillMissingDates, getMetricDateRange } from "~/lib/metrics"
import { adminProcedure } from "~/lib/orpc"

// -----------------------------------------------------------------------------
// Dashboard stats: resource counts
// -----------------------------------------------------------------------------
const stats = adminProcedure.handler(async ({ context: { db } }) => {
  const [toolCount, categoryCount, userCount] = await db.$transaction([
    db.brokers.count(),
    db.category.count(),
    db.user.count(),
  ])

  return { toolCount, categoryCount, userCount }
})

// -----------------------------------------------------------------------------
// Revenue metric: Local payments for last 30 days
// -----------------------------------------------------------------------------
const revenue = adminProcedure.handler(async ({ context: { db } }) => {
  try {
    const { today, startDate } = getMetricDateRange()

    const payments = await db.payment.findMany({
      where: {
        status: "Paid",
        createdAt: { gte: startDate },
      },
      select: {
        amount: true,
        createdAt: true,
      },
    })

    const revenueByDate = payments.reduce<Record<string, number>>((acc, payment) => {
      const date = format(payment.createdAt, "yyyy-MM-dd")
      acc[date] = (acc[date] || 0) + Math.round(payment.amount)
      return acc
    }, {})

    const results = fillMissingDates(revenueByDate, startDate, today)
    const { total, average } = calculateMetricStats(results)

    return { results, totalRevenue: total, averageRevenue: average }
  } catch (error) {
    console.error("Revenue error:", error)
    return { results: [], totalRevenue: 0, averageRevenue: 0 }
  }
})

// -----------------------------------------------------------------------------
// Visitor metric: Plausible analytics for last 30 days
// -----------------------------------------------------------------------------
const visitors = adminProcedure.handler(async () => {
  // Plausible analytics disabled
  const { today, startDate } = getMetricDateRange()
  const results = fillMissingDates({}, startDate, today)
  const { total, average } = calculateMetricStats(results)

  return { results, totalVisitors: total, averageVisitors: average }
  
  // const { today, startDate, dateRange } = getMetricDateRange()
  // const visitorData = await getPlausibleVisitors(dateRange)
  // const results = fillMissingDates(visitorData, startDate, today)
  // const { total, average } = calculateMetricStats(results)

  // return { results, totalVisitors: total, averageVisitors: average }
})

// -----------------------------------------------------------------------------
// User signups metric for last 30 days
// -----------------------------------------------------------------------------
const userMetric = adminProcedure.handler(async ({ context: { db } }) => {
  const { today, startDate } = getMetricDateRange()

  const users = await db.user.findMany({
    where: { createdAt: { gte: startDate } },
  })

  const usersByDate = users.reduce<Record<string, number>>((acc, user) => {
    const date = format(user.createdAt, "yyyy-MM-dd")
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  const results = fillMissingDates(usersByDate, startDate, today)
  const { total, average } = calculateMetricStats(results)

  return { results, totalUsers: total, averageUsers: average }
})

export const metricRouter = {
  stats,
  revenue,
  visitors,
  userMetric,
}
