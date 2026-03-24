import { formatNumber } from "@primoui/utils"
import { subDays } from "date-fns"
import { getTranslations } from "next-intl/server"
import { cacheLife, cacheTag } from "next/cache"
import { ToolStatus } from "~/.generated/prisma/client"
import { Badge } from "~/components/common/badge"
import { Link } from "~/components/common/link"
import { Ping } from "~/components/common/ping"
import { db } from "~/services/db"

const getCounts = async () => {
  "use cache"

  cacheTag("tools")
  cacheLife("infinite")

  // Run queries in parallel without transaction wrapper to avoid timeout issues during build
  const [count, newCount] = await Promise.all([
    db.brokers.count({
      where: { status: ToolStatus.Published },
    }),

    db.brokers.count({
      where: { status: ToolStatus.Published, publishedAt: { gte: subDays(new Date(), 7) } },
    }),
  ])

  return [count, newCount] as const
}

const CountBadge = async () => {
  let count = 0
  let newCount = 0

  try {
    const counts = await getCounts()
    count = counts[0]
    newCount = counts[1]
  } catch (error) {
    console.error("Failed to fetch tool counts:", error)
    // Fallback to 0 if query fails (e.g., during build)
  }

  const t = await getTranslations("components.count_badge")

  return (
    <Badge prefix={<Ping />} className="order-first" asChild>
      <Link href="/?sort=publishedAt.desc">
        {newCount
          ? t("new_tools", { count: formatNumber(newCount) })
          : t("total_tools", { count: formatNumber(count) })}
      </Link>
    </Badge>
  )
}

const CountBadgeSkeleton = () => {
  return (
    <Badge prefix={<Ping />} className="min-w-20 order-first pointer-events-none animate-pulse">
      &nbsp;
    </Badge>
  )
}

export { CountBadge, CountBadgeSkeleton }
