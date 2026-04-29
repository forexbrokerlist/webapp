import { lcFirst } from "@primoui/utils"
import { noCase } from "change-case"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import { cache, Suspense } from "react"
import CommonBanner from "~/components/web/common-banner"
import { StructuredData } from "~/components/web/structured-data"
import { ToolListingSkeleton } from "~/components/web/tools/tool-listing"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { generateCollectionPage } from "~/lib/structured-data"
import { findCategory } from "~/server/web/categories/queries"
const BrokersImage = '/assets/images/brokers.png';

type Props = PageProps<"/categories/[slug]">

// I18n page namespace
const namespace = "pages.category"

// Get page data
const getData = cache(async ({ params }: Props) => {
  const { slug } = await params
  const category = await findCategory({ where: { slug } })

  if (!category) {
    notFound()
  }

  const t = await getTranslations()
  const url = `/categories/${slug}`
  const title = category.label || t(`${namespace}.title`, { name: category.name })
  const name = lcFirst(category.description ?? noCase(title))
  const description = t(`${namespace}.description`, { name, siteName: siteConfig.name })

  const data = getPageData(url, title, description, {
    breadcrumbs: [
      { url: "/categories", title: t("navigation.categories") },
      { url, title: category.name },
    ],
    structuredData: [generateCollectionPage(url, title, description)],
  })

  return { category, ...data }
})

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const { slug } = await props.params
  const { url, metadata } = await getData(props)

  if (slug === 'algorithmic-trading-and-bot-providers') {
    return getPageMetadata({
      url,
      title: "Best Algorithmic Trading & Bot Providers | Forex Brokers List",
      description: "Discover the best algorithmic trading and bot providers. Compare automated trading solutions, expert advisors & forex bots to maximize your trading performance.",
      metadata: {
        ...metadata,
        title: "Best Algorithmic Trading & Bot Providers | Forex Brokers List",
        description: "Discover the best algorithmic trading and bot providers. Compare automated trading solutions, expert advisors & forex bots to maximize your trading performance."
      }
    })
  }

  if (slug === 'forex-brokers') {
    return getPageMetadata({
      url,
      title: "Best Forex Brokers – Compare & Find Top Brokers | Forex Brokers List",
      description: "Compare the best forex brokers by spreads, regulations, platforms & minimum deposits. Find the perfect regulated forex broker for your trading needs today.",
      metadata: {
        ...metadata,
        title: "Best Forex Brokers – Compare & Find Top Brokers | Forex Brokers List",
        description: "Compare the best forex brokers by spreads, regulations, platforms & minimum deposits. Find the perfect regulated forex broker for your trading needs today."
      }
    })
  }

  return getPageMetadata({
    url,
    title: metadata.title,
    description: metadata.description,
    metadata
  })
}

export default async function (props: Props) {
  const { category, metadata, breadcrumbs, structuredData } = await getData(props)
  const t = await getTranslations()
  const placeholder = t(`${namespace}.search.placeholder`, { name: metadata.title.toLowerCase() })

  return (
    <>
      <CommonBanner
        image={BrokersImage}
        description={category?.description ?? ''}
        highlightedText={`${category.label} —`} 
        title={`Discover, Compare & Choose The Best ${(category.name === "Forex Brokers" || category.name === "Top Rated Forex Brokers") ? "Trading " : ""}Platforms`} />
      <div className=" pb-100 max-mobile:py-16">
        <div className="max-w-[1640px] px-5 max-laptop:px-16 mx-auto relative max-tab:px-5 max-mobile:px-4">
          {/* <Breadcrumbs items={breadcrumbs} /> */}

          {/* <Intro className="pb-[40px]">
            <IntroTitle>{metadata.title}</IntroTitle>
            <IntroDescription className="max-w-3xl">{metadata.description}</IntroDescription>
          </Intro> */}

          <Suspense fallback={<ToolListingSkeleton />}>
            <ToolQuery
            searchParams={props.searchParams}
              where={{ categories: { some: { slug: category.slug } } }}
              search={{ placeholder }}
              ad="Tools"
              list={{ categorySlug: category.slug }}
            />
          </Suspense>

          <StructuredData data={structuredData} />
        </div>
      </div>
      <div className='w-full h-[1px] bg-[linear-gradient(90deg,#F0F1EC_0%,#A8DD15_50%,#F0F1EC_100%)]'></div>

    </>
  )
}
