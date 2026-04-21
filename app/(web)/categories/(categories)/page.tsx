import seoData from "~/config/seo.json"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Suspense } from "react"
import { CategoryListSkeleton } from "~/components/web/categories/category-list"
import { CategoryQuery } from "~/components/web/categories/category-query"
import { StructuredData } from "~/components/web/structured-data"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { generateCollectionPage } from "~/lib/structured-data"
import CategoriesHero from "./categories-hero"
import CategoriesCard, { Partner } from "./categories-card"
import { getAlgoPartners, getBridgePartners, getLiquidityPartners,getPspPartners,getTradingPlatformPartners, getTrustedPlatforms, getAllPartners} from "~/server/web/brokers/queries"

// I18n page namespace
const namespace = "pages.categories"

export const dynamic = "force-dynamic"

// Get page data
const getData = async () => {
  const t = await getTranslations()
  const url = "/categories"
  const title = t(`${namespace}.title`)
  const description = t(`${namespace}.description`, { siteName: siteConfig.name })

  return getPageData(url, title, description, {
    breadcrumbs: [{ url, title: t("navigation.categories") }],
    structuredData: [generateCollectionPage(url, title, description)],
  })
}

export const generateMetadata = async (): Promise<Metadata> => {
  const { url, metadata } = await getData()
  const mergedMetadata = { ...metadata, ...seoData.categories }
  return getPageMetadata({
    url,
    title: mergedMetadata.title,
    description: mergedMetadata.description,
    metadata: mergedMetadata
  })
}

export default async function () {
  const { metadata, breadcrumbs, structuredData } = await getData()
  const { brokers: AlgoPartners } = await getAlgoPartners(5)
  const { brokers: bridgePartners } = await getBridgePartners(6)
  const {brokers:liquidityPartners} = await getLiquidityPartners(2)
  const {brokers:PSPPartners} = await getPspPartners(5)
  const {brokers:trustedPlatforms} = await getTrustedPlatforms(4)
  const allBrokers = await getAllPartners(40)
  
  return (
    <>
      <CategoriesHero />
      <CategoriesCard  
        AlgoPartners={AlgoPartners} 
        bridgePartners={bridgePartners} 
        liquidityPartners={liquidityPartners} 
        PSPPartners={PSPPartners} 
        trustedPlatforms={trustedPlatforms} 
        allBrokers={allBrokers}
      />
      {/* <Breadcrumbs items={breadcrumbs} /> */}

      {/* <Intro>
        <IntroTitle>{metadata.title}</IntroTitle>
      </Intro>

      <Suspense fallback={<CategoryListSkeleton />}>
        <CategoryQuery />
      </Suspense> */}

      <StructuredData data={structuredData} />
    </>
  )
}
