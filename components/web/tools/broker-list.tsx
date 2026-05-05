"use client"

import { useTranslations } from "next-intl"
import type { ComponentProps } from "react"
import { EmptyList } from "~/components/web/empty-list"
import { BrokerCard } from "~/components/web/tools/broker-card"
import { Grid } from "~/components/web/ui/grid"
import type { Brokers } from "~/.generated/prisma/client"

type BrokerListProps = ComponentProps<typeof Grid> & {
  brokers: Brokers[]
  categorySlug?: string
}

const BrokerList = ({ children, brokers, categorySlug, ...props }: BrokerListProps) => {
  const t = useTranslations()

  return (
    <Grid {...props}>
      {brokers.map((broker, order) => (
        <BrokerCard
          key={broker.id}
          broker={broker}
          categorySlug={categorySlug}
          logoUrl={broker.logoUrl || undefined}
          style={{ order }}
        />
      ))}

      {brokers.length ? children : <EmptyList>{t("tools.no_tools")}</EmptyList>}
    </Grid>
  )
}

export { BrokerList, type BrokerListProps }
