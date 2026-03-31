import { getTranslations } from "next-intl/server"
import { cache, Suspense } from "react"
import { Hero } from "~/app/(web)/(home)/hero"
import { Pricing } from "~/app/(web)/(home)/pricing"
import { Sponsors } from "~/app/(web)/(home)/sponsors"
import { StructuredData } from "~/components/web/structured-data"
import { ToolListingSkeleton } from "~/components/web/tools/tool-listing"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"
import FAQ from "./faq"

// Get page data
const getData = cache(async () => {
  const t = await getTranslations()
  const title = `${siteConfig.name} - ${t("brand.tagline")} | ${siteConfig.name}`
  const description = t("brand.meta_description")

  return getPageData(siteConfig.url, title, description)
})

export const generateMetadata = async () => {
  const { url, metadata } = await getData()
  const title = metadata.title as string
  const description = metadata.description as string
  return getPageMetadata({ url, title, description, metadata })
}

export default async function (props: any) {
  const { structuredData } = await getData()

  return (
    <>
      <Hero />
      <Sponsors />
      <Suspense fallback={<ToolListingSkeleton />}>
        <ToolQuery searchParams={props.searchParams} options={{ enableFilters: true }} ad="Tools" />
      </Suspense>
      <FAQ />
      {/* <Pricing /> */}
      <StructuredData data={structuredData} />
    </>
  )
}
