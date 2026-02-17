import type { ComponentProps } from "react"
import { MetricHeader, MetricHeaderSkeleton } from "~/components/admin/metrics/metric-header"
import { Card } from "~/components/common/card"
import { Link } from "~/components/common/link"

type MetricValueProps = ComponentProps<typeof Card> & {
  label: string
  href: string
  count: number
}

const MetricValue = ({ label, href, count, ...props }: MetricValueProps) => {
  return (
    <Card hover={false} {...props}>
      <Link href={href}>
        <MetricHeader title={label} value={count.toLocaleString()} />
      </Link>
    </Card>
  )
}

const MetricValueSkeleton = () => {
  return (
    <Card hover={false}>
      <MetricHeaderSkeleton />
    </Card>
  )
}

export { MetricValue, MetricValueSkeleton }
