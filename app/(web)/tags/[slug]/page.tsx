import { capitalCase } from "change-case"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import { cache, Suspense } from "react"
import CommonBanner from "~/components/web/common-banner"
import { StructuredData } from "~/components/web/structured-data"
import { ToolListingSkeleton } from "~/components/web/tools/tool-listing"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { generateCollectionPage } from "~/lib/structured-data"
import { findTag } from "~/server/web/tags/queries"

type Props = PageProps<"/tags/[slug]">

// I18n page namespace
const namespace = "pages.tag"

// Get page data
const getData = cache(async ({ params }: Props) => {
  const { slug } = await params
  const tag = await findTag({ where: { slug } })

  if (!tag) {
    notFound()
  }

  const t = await getTranslations()
  const url = `/tags/${tag.slug}`
  const name = capitalCase(tag.name)
  const title = t(`${namespace}.title`, { name })
  const description = t(`${namespace}.description`, { name, siteName: siteConfig.name })

  const data = getPageData(url, title, description, {
    breadcrumbs: [
      { url: "/tags", title: t("navigation.tags") },
      { url, title: name },
    ],
    structuredData: [generateCollectionPage(url, title, description)],
  })

  return { tag, ...data }
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

export default async function (props: Props) {
  const { tag, metadata, breadcrumbs, structuredData } = await getData(props)
  const t = await getTranslations()
  const placeholder = t(`${namespace}.search.placeholder`, { name: tag.name.toLowerCase() })

  return (
    <>
      {/* <Breadcrumbs items={breadcrumbs} /> */}
      <CommonBanner highlightedText="Browse Forex " title=" Broker Tags" image="/assets/images/TagsBanner.png" description="Discover trusted forex brokers through categorized trading features including spreads, platforms, regulations, account types, and market instruments."/>
      <div className=" pb-100 max-mobile:pb-16 max-mobile:pt-[120px]">
        <div className="max-w-[1640px] px-5 max-laptop:px-16 mx-auto relative max-tab:px-5 max-mobile:px-4">
         

          <Suspense fallback={<ToolListingSkeleton />}>
            <ToolQuery
              searchParams={props.searchParams}
              where={{ tags: { some: { slug: tag.slug } } }}
              search={{ placeholder }}
              options={{ enableFilters: false }}
              ad="Tools"
            />
          </Suspense>

          <StructuredData data={structuredData} />
        </div>
      </div>
      <div className='w-full h-[1px] bg-[linear-gradient(90deg,#F0F1EC_0%,#A8DD15_50%,#F0F1EC_100%)]'></div>
    </>
  )
}
