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
      {/* <Intro alignment="center">
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
      </Section> */}


      <div className="pt-[140px] pb-100 max-mobile:py-16">
              <div className="max-w-[1640px] px-5 max-laptop:px-16 mx-auto relative max-tab:px-5 max-mobile:px-4">
                <div className="grid grid-cols-2 gap-7 max-tab:grid-cols-1 max-mobile:gap-5">
                  <div className="flex flex-col justify-between max-tab:gap-16">
                    {/* slider */}
                    <div>
                          <Intro alignment="center">
        <h1 className="font-bold text-4xl text-center w-[350px]">{metadata.title}</h1>
        {/* <IntroDescription>{metadata.description}</IntroDescription> */}
      </Intro>
                    </div>
                    {/* slider */}
                    <div className="pb-10 items-center">
                     <img src="/assets/images/Payment.png" className="mx-auto"/>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-md p-6">
                     <Section.Content className={cx(!existingAd && "md:col-span-full")}>
                      <h1 className="font-semibold text-3xl">Ad Details: Enter your ad information</h1>
          <AdForm
            sessionId={session.id}
            ad={existingAd}
            categories={categories}
            className="w-full max-w-full "
          />
        </Section.Content>

        {existingAd && (
          <Section.Sidebar>
            <AdCard type="All" explicitAd={existingAd} />
          </Section.Sidebar>
        )}
                  </div>
                </div>
              </div>
            </div>
            <div className='w-full h-[1px] bg-[linear-gradient(90deg,#F0F1EC_0%,#A8DD15_50%,#F0F1EC_100%)]'></div>
    </>
  )
}
