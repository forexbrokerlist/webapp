import seoData from "~/config/seo.json"
import { LoaderIcon } from "lucide-react"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { cache, Suspense } from "react"
import { AdvertisePickers } from "~/app/(web)/advertise/pickers"
import { Button } from "~/components/common/button"
import { Wrapper } from "~/components/common/wrapper"
import { ExternalLink } from "~/components/web/external-link"
import { Stats } from "~/components/web/stats"
import { StructuredData } from "~/components/web/structured-data"
import { Testimonial } from "~/components/web/testimonial"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"

// I18n page namespace
const namespace = "pages.advertise"

// Get page data
const getData = cache(async () => {
  const t = await getTranslations()
  const url = "/advertise"
  const title = t(`${namespace}.title`)
  const description = seoData.advertise.description

  return getPageData(url, title, description, {
    breadcrumbs: [{ url, title }],
  })
})

export const generateMetadata = async (): Promise<Metadata> => {
  const { url, metadata } = await getData()
  const mergedMetadata = { ...metadata, ...seoData.advertise }
  return getPageMetadata({
    url,
    title: mergedMetadata.title,
    description: mergedMetadata.description,
    metadata: mergedMetadata
  })
}

export default async function ({ searchParams }: any) {
  const { metadata, structuredData } = await getData()
  const t = await getTranslations()

  return (
    <Wrapper gap="xl">
      <div className="flex flex-col items-center gap-10">
        <Intro alignment="center">
          <IntroTitle>{metadata.title}</IntroTitle>
          <IntroDescription>{metadata.description}</IntroDescription>
        </Intro>

        <Suspense fallback={<LoaderIcon className="mx-auto size-[1.25em] animate-spin" />}>
          <AdvertisePickers searchParams={searchParams} />
        </Suspense>
      </div>

      <Stats />

      <Testimonial />

      <hr />

      <Intro alignment="center">
        <IntroTitle size="h2" as="h3">
          {t(`${namespace}.cta.title`)}
        </IntroTitle>

        <IntroDescription className="max-w-lg">
          {t(`${namespace}.cta.description`)}
        </IntroDescription>

        <Button className="mt-4 min-w-40" asChild>
          <Link href={`/contact`}>
            {t(`${namespace}.cta.button`)}
          </Link>
        </Button>
      </Intro>

      <StructuredData data={structuredData} />
    </Wrapper>
  )
}
