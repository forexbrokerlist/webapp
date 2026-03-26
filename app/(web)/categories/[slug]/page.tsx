import { lcFirst } from "@primoui/utils"
import { noCase } from "change-case"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import { cache, Suspense } from "react"
import { StructuredData } from "~/components/web/structured-data"
import { ToolListingSkeleton } from "~/components/web/tools/tool-listing"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { generateCollectionPage } from "~/lib/structured-data"
import { findCategory } from "~/server/web/categories/queries"

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
      metadata: {
        ...metadata,
        title: "Best Algorithmic Trading & Bot Providers",
        description: "Discover the best algorithmic trading and bot providers. Compare automated trading solutions, expert advisors & forex bots to maximize your trading performance."
      }
    })
  }

  if (slug === 'forex-brokers') {
    return getPageMetadata({
      url,
      metadata: {
        ...metadata,
        title: "Best Forex Brokers – Compare & Find Top Brokers",
        description: "Compare the best forex brokers by spreads, regulations, platforms & minimum deposits. Find the perfect regulated forex broker for your trading needs today."
      }
    })
  }

  return getPageMetadata({ url, metadata })
}

export default async function (props: Props) {
  const { category, metadata, breadcrumbs, structuredData } = await getData(props)
  const t = await getTranslations()
  const placeholder = t(`${namespace}.search.placeholder`, { name: metadata.title.toLowerCase() })

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <Intro>
        <IntroTitle>{metadata.title}</IntroTitle>
        <IntroDescription className="max-w-3xl">{metadata.description}</IntroDescription>
      </Intro>

      <Suspense fallback={<ToolListingSkeleton />}>
        <ToolQuery
          searchParams={props.searchParams}
          where={{ categories: { some: { slug: category.slug } } }}
          search={{ placeholder }}
          ad="Tools"
        />
      </Suspense>

      <StructuredData data={structuredData} />
    </>
  )
}
