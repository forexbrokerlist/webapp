import { getTranslations } from "next-intl/server"
import { cache, Suspense } from "react"
import { StructuredData } from "~/components/web/structured-data"
import { ToolListingSkeleton } from "~/components/web/tools/tool-listing"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { generateCollectionPage } from "~/lib/structured-data"

type Props = {
  searchParams: Promise<any>
}

// I18n page namespace
const namespace = "pages.tools"

export const dynamic = "force-dynamic"

// Get page data
const getData = cache(async () => {
  const t = await getTranslations()
  const url = "/brokers"
  const title = t(`${namespace}.title`)
  const description = t(`${namespace}.description`, { siteName: siteConfig.name })

  const data = getPageData(url, title, description, {
    breadcrumbs: [
      { url: "/", title: t("navigation.home") },
      { url, title: t("navigation.tools") },
    ],
    structuredData: [generateCollectionPage(url, title, description)],
  })

  return { ...data }
})

export const generateMetadata = async (): Promise<any> => {
  const { url, metadata } = await getData()
  return getPageMetadata({
    url,
    title: metadata.title,
    description: metadata.description,
    metadata
  })
}

export default async function (props: Props) {
  const { metadata, breadcrumbs, structuredData } = await getData()
  const t = await getTranslations()
  const placeholder = t(`${namespace}.search.placeholder`)

  return (
    <>
      <div className="pt-[140px]">
        {/* <Breadcrumbs items={breadcrumbs} /> */}

        <div className="max-w-[1640px] px-5 max-laptop:px-16 mx-auto relative max-tab:px-5 max-mobile:px-4">
          <div className="pb-100">
            <Intro className="pb-[40px]">
              <IntroTitle>{metadata.title}</IntroTitle>
              <IntroDescription className="max-w-3xl">{metadata.description}</IntroDescription>
            </Intro>

            <Suspense fallback={<ToolListingSkeleton />}>
              <ToolQuery
                searchParams={props.searchParams}
                search={{ placeholder }}
                options={{ enableFilters: true }}
                ad="Tools"
              />
            </Suspense>

          </div>
        </div>
        <div className='w-full h-[1px] bg-[linear-gradient(90deg,#F0F1EC_0%,#A8DD15_50%,#F0F1EC_100%)]'></div>
        <StructuredData data={structuredData} />
      </div>
    </>
  )
}
