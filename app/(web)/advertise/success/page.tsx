import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import { createLoader, parseAsString } from "nuqs/server"
import { cache } from "react"
import { AdForm } from "~/app/(web)/advertise/success/ad-form"
import { AdCard } from "~/components/web/ads/ad-card"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { Section } from "~/components/web/ui/section"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { cx } from "~/lib/utils"
import { getPresignedUrlFromFull } from "~/lib/media"
import { adOnePayload } from "~/server/web/ads/payloads"
import { findCategories } from "~/server/web/categories/queries"
import { db } from "~/services/db"

type Props = PageProps<"/advertise/success">

// I18n page namespace
const namespace = "pages.advertise.success"

// Get page data
const getData = cache(async ({ searchParams }: Props) => {
  const searchParamsLoader = createLoader({ sessionId: parseAsString.withDefault("") })
  const { sessionId } = await searchParamsLoader(searchParams)

  // In the new flow, sessionId is our orderId
  const payment = await db.payment.findUnique({
    where: { orderId: sessionId },
  })

  if (!payment) {
    notFound()
  }

  const t = await getTranslations()
  const url = "/advertise/success"
  const title = t(`${namespace}.title`)
  const description = t(`${namespace}.description`, { siteName: siteConfig.name })

  const data = getPageData(url, title, description, {
    breadcrumbs: [{ url, title }],
  })

  // Provide a session-like object for compatibility
  const session = {
    id: payment.orderId!,
    status: payment.status === "Paid" ? "complete" : "open",
  }

  return { session, ...data }
})

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const { url, metadata } = await getData(props)
  return getPageMetadata({
    url,
    title: metadata.title,
    description: metadata.description,
    metadata
  })
}

export default async function (props: PageProps<"/advertise/success">) {
  const { session, metadata } = await getData(props)

  let existingAd = await db.ad.findFirst({
    where: { sessionId: session.id as string },
    select: adOnePayload,
  })

  // Optimistically set the ad to Pending if the payment is confirmed or pending
  if (existingAd && existingAd.status === "Draft") {
    await db.ad.updateMany({
      where: { sessionId: session.id as string },
      data: { status: "Pending" },
    })
    existingAd.status = "Pending"
  }

  if (existingAd) {
    existingAd.faviconUrl = (await getPresignedUrlFromFull(existingAd.faviconUrl)) as string
    existingAd.bannerUrl = (await getPresignedUrlFromFull(existingAd.bannerUrl)) as string
  }

  const categories = await findCategories({ all: true })

  return (
    <>
      <Intro alignment="center">
        <IntroTitle>{metadata.title}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <Section>
        <Section.Content className={cx(!existingAd && "md:col-span-full")}>
          <AdForm
            sessionId={session.id}
            ad={existingAd}
            categories={categories}
            className="w-full max-w-xl mx-auto"
          />
        </Section.Content>

        {existingAd && (
          <Section.Sidebar>
            <AdCard type="All" explicitAd={existingAd} />
          </Section.Sidebar>
        )}
      </Section>
    </>
  )
}
