import { HashIcon } from "lucide-react"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { cache, Suspense } from "react"
import Image from "next/image"
import { Badge } from "~/components/common/badge"
import { Button } from "~/components/common/button"
import { Card, CardHeader } from "~/components/common/card"
import { H2, H5 } from "~/components/common/heading"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { AdCard, AdCardSkeleton } from "~/components/web/ads/ad-card"
import { Markdown } from "~/components/web/markdown"
import { Nav } from "~/components/web/nav"
import { StructuredData } from "~/components/web/structured-data"
import { Backdrop } from "~/components/web/ui/backdrop"
import { Favicon } from "~/components/web/ui/favicon"
import { IntroDescription } from "~/components/web/ui/intro"
import { BrokerBookmarkButton } from "~/components/web/brokers/broker-bookmark-button"
import { BrokerClaimButton } from "~/components/web/brokers/broker-claim-button"
import { BrokerScreenshot } from "~/components/web/brokers/broker-screenshot"
import { ProductListSkeleton } from "~/components/web/products/product-list"
import { PlanQuery } from "~/components/web/plans/plan-query"
import { Section } from "~/components/web/ui/section"
import { Sticky } from "~/components/web/ui/sticky"
import type { OpenGraphParams } from "~/lib/opengraph"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { generateCollectionPage } from "~/lib/structured-data"
import { findBrokerBySlug, findRandomBrokers, findBrokersForComparison } from "~/server/web/tools/queries"
import { getPresignedUrlFromFull, getScreenshotFetchUrl } from "~/lib/media"
import BrokerDetails from "~/components/web/broker-details"

type Props = {
  params: {
    slug: string
  }
}

// type Props = PageProps<"/brokers/[slug]">

// Get page data
const getData = cache(async ({ params }: Props) => {
  const { slug } = await params

  if (!slug) {
    notFound()
  }

  const broker = await findBrokerBySlug(slug)

  if (!broker) {
    notFound()
  }

  const t = await getTranslations()
  const url = `/brokers/${broker.slug}`
  const title = `${broker.broker_name || "Unknown Broker"} Review`
  const description = broker.subtitle || broker.description || broker.pros || ""
  const data = getPageData(url, title, description, {
    breadcrumbs: [
      { url: "/", title: t("navigation.tools") },
      { url, title: broker.broker_name || "Broker" },
    ],
    structuredData: [generateCollectionPage(url, title, description)],
  })

  const screenshotUrl = await getPresignedUrlFromFull(broker.screenshotUrl)
  const logoUrl = await getPresignedUrlFromFull(broker.logoUrl)
  const categorySlug = broker.categories?.[0]?.slug
  const randomBrokersRaw = await findRandomBrokers(3, slug, categorySlug)
  const randomBrokers = await Promise.all(
    randomBrokersRaw.map(async (b) => ({
      ...b,
      screenshotUrl: await getPresignedUrlFromFull(b.screenshotUrl),
      logoUrl: await getPresignedUrlFromFull(b.logoUrl),
    }))
  )

  const trustedBrokersRaw = await findBrokersForComparison(12)
  const trustedBrokers = await Promise.all(
    trustedBrokersRaw.map(async (b) => ({
      ...b,
      logoUrl: await getPresignedUrlFromFull(b.logoUrl),
    }))
  )

  return { broker: { ...broker, screenshotUrl, logoUrl }, randomBrokers, trustedBrokers, ...data }
})


export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const { broker, url, metadata } = await getData(props)

  const ogImage: OpenGraphParams = {
    title: String(broker.broker_name),
    description: String(broker.description),
  }

  return getPageMetadata({
    url,
    title: metadata.title,
    description: metadata.description,
    metadata
  })
}

export default async function (props: Props) {
  const { broker, randomBrokers, trustedBrokers, metadata, structuredData } = await getData(props)
  console.log(broker)
  const headerList = await headers()

  return (
    <>
      <BrokerDetails broker={broker} randomBrokers={randomBrokers} trustedBrokers={trustedBrokers} />

      <StructuredData data={structuredData} />
    </>
  )
}
