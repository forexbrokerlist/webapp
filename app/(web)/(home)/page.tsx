import { getTranslations } from "next-intl/server"
import { cache, Suspense } from "react"
import { Hero } from "~/app/(web)/(home)/hero"
import { Pricing } from "~/app/(web)/(home)/pricing"
import { Sponsors } from "~/app/(web)/(home)/sponsors"
import { StructuredData } from "~/components/web/structured-data"
import { ToolListingSkeleton } from "~/components/web/tools/tool-listing"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { siteConfig } from "~/config/site"
import { getPageData } from "~/lib/pages"

// Get page data
const getData = cache(async () => {
  const t = await getTranslations()
  const title = `${siteConfig.name} - ${t("brand.tagline")}`
  const description = t("brand.meta_description")

  return getPageData(siteConfig.url, title, description)
})

export const generateMetadata = async () => {
  const { metadata } = await getData()
  return metadata
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
      {/* <Pricing /> */}
      <StructuredData data={structuredData} />
    </>
  )
}
