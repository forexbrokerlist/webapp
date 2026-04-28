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
import { findBrokerBySlug, findRandomBrokers, findRandomCourses } from "~/server/web/tools/queries"
import { db } from "~/services/db"
import { getPresignedUrlFromFull, getScreenshotFetchUrl } from "~/lib/media"
import ForexTradingCourseDetails from "~/components/web/forex-trading-course-details"

type Props = {
  params: {
    slug: string
  }
}

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

  const screenshotUrl = await getPresignedUrlFromFull(broker.screenshotUrl)
  const logoUrl = await getPresignedUrlFromFull(broker.logoUrl)

  // Get random brokers from forex-trading-courses category
  const randomBrokersRaw = await findRandomCourses(1, slug)

  // Debug: Log the raw random brokers data
  console.log('Random brokers raw data:', randomBrokersRaw)
  console.log('Current broker slug being excluded:', slug)

  // Simplify the data structure to avoid serialization issues
  const randomBrokers = randomBrokersRaw.map((b) => ({
    broker_name: b.broker_name,
    slug: b.slug,
    logoUrl: b.logoUrl,
    screenshotUrl: b.screenshotUrl,
    categories: b.categories,
  }))

  // Debug: Log the final processed random brokers
  console.log('Final random brokers (simplified):', randomBrokers)

  const t = await getTranslations()
  const url = `/crm/${broker.slug}`
  const title = `${broker.broker_name || "Unknown Broker"} Review`
  const description = broker.subtitle || broker.description || broker.pros || ""
  const data = getPageData(url, title, description, {
    breadcrumbs: [
      { url: "/", title: t("navigation.tools") },
      { url, title: broker.broker_name || "Broker" },
    ],
    structuredData: [generateCollectionPage(url, title, description)],
  })

  return { broker: { ...broker, screenshotUrl, logoUrl }, randomBrokers, ...data }
})

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const { broker, url, metadata } = await getData(props)

  const ogImage: OpenGraphParams = {
    title: String(broker.broker_name),
    description: String(broker.description),
  }

  // Filter out null values to satisfy Next.js OpenGraph type requirements
  const filteredOgImage = Object.fromEntries(
    Object.entries(ogImage).filter(([_, value]) => value != null)
  )

  return getPageMetadata({
    url,
    title: metadata.title,
    description: metadata.description,
    metadata: {
      ...metadata,
      openGraph: {
        ...metadata.openGraph,
        ...filteredOgImage,
      },
    }
  })
}

export default async function (props: Props) {
  const { broker, randomBrokers, metadata, structuredData } = await getData(props)
  const headerList = await headers()

  console.log('Page component - randomBrokers from getData:', randomBrokers)
  console.log('Page component - randomBrokers length:', randomBrokers?.length)

  return (
    <>
      {/* <Section>
        <Section.Content className="max-md:contents">
          <Sticky isOverlay>
            <Stack className="@container self-stretch justify-between items-start md:items-center gap-y-4 flex-col md:flex-row">
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <div className="flex items-center gap-4">
                  {(() => {
                    let domain = "forex.com";
                    const targetUrl = broker.broker_website || broker.url;
                    try {
                      if (targetUrl) {
                        const urlObj = new URL(targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`);
                        domain = urlObj.hostname;
                      }
                    } catch (e) { }

                    return (
                      <Favicon
                        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
                        title={broker.broker_name || "Broker"}
                        contained
                        className="size-10 rounded-xl shadow-sm border border-border/40"
                      />
                    );
                  })()}
                  <div className="flex flex-col">
                    <H2 as="h1" className="leading-tight! md:whitespace-normal line-clamp-2">
                      {broker.broker_name}
                    </H2>
                    {broker.subtitle && (
                      <p className="text-muted-foreground text-sm font-medium line-clamp-1 italic">
                        {broker.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {broker.overall_rating && (
                  <Badge variant="primary" size="lg" className="w-fit text-white">
                    Rating: {broker.overall_rating} / 5
                  </Badge>
                )}
              </div>

              <div className="flex items-center flex-wrap gap-2 z-10 w-full md:w-auto justify-start md:justify-end">
                <BrokerBookmarkButton brokerId={broker.id} showLabel variant="secondary" size="md" />
                <BrokerClaimButton broker={broker}>
                  <Suspense fallback={<ProductListSkeleton />}>
                    <PlanQuery
                      checkoutData={{
                        successUrl: `${headerList.get("origin")}/crm/${broker.slug}?claimed=true`,
                        cancelUrl: headerList.get("referer") || "",
                        metadata: {
                          brokerId: String(broker.id),
                          type: "claim",
                        },
                      }}
                    />
                  </Suspense>
                </BrokerClaimButton>
                {(broker.broker_website || broker.url) && (
                  <Button asChild variant="fancy" size="md">
                    <a href={broker.broker_website || broker.url || "#"} target="_blank" rel="noopener noreferrer nofollow">
                      Visit Broker
                    </a>
                  </Button>
                )}
              </div>
              <Backdrop />
            </Stack>
          </Sticky>

          {broker.description && (
            <IntroDescription className="-mt-fluid-md pt-4 italic border-l-4 border-primary pl-4">
              <Markdown code={broker.description} />
            </IntroDescription>
          )}

          {(broker.broker_website || broker.url) && (
            <div className="mt-8 rounded-xl overflow-hidden border border-border/50 shadow-sm aspect-video relative max-w-4xl mx-auto bg-muted">
              <BrokerScreenshot
                src={broker.screenshotUrl || getScreenshotFetchUrl((broker.broker_website || broker.url || "").startsWith('http') ? (broker.broker_website || broker.url || "") : `https://${broker.broker_website || broker.url}`)}
                alt={`${broker.broker_name} Website Screenshot`}
              />
            </div>
          )}

          <Stack className="w-full md:sticky md:bottom-2 md:z-10 mt-8">
            <div className="absolute -inset-x-1 -bottom-3 -top-8 -z-1 pointer-events-none bg-background mask-t-from-66% max-md:hidden" />
            <Nav className="mr-auto" title={metadata.title} />
          </Stack>
        </Section.Content>

        <Section.Sidebar className="max-md:contents">
       
          <Suspense fallback={<AdCardSkeleton className="max-md:order-3" />}>
            <AdCard type="ToolPage" className="max-md:order-3" />
          </Suspense>
        </Section.Sidebar>
      </Section> */}

      <ForexTradingCourseDetails broker={broker} randomBrokers={randomBrokers} />
      <StructuredData data={structuredData} />
    </>
  )
}
