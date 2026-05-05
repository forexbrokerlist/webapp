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
import { getAlgoPartners, getBridgePartners, getLiquidityPartners, getPspPartners, getTradingPlatformPartners, getTrustedPlatforms, getAllPartners, getCrmPlatforms, getForexEducationPartners } from "~/server/web/brokers/queries"
import CommonBanner from "~/components/web/common-banner"

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
  const { category: Algo, brokers: AlgoPartners } = await getAlgoPartners(5)
  const { category: Bridge, brokers: bridgePartners } = await getBridgePartners(6)
  const { category: Liquidity, brokers: liquidityPartners } = await getLiquidityPartners(4)
  const { category: PSP, brokers: PSPPartners } = await getPspPartners(5)
  const { category: Trusted, brokers: trustedPlatforms } = await getTrustedPlatforms(4)
  const { category: CRM, brokers: crmPartners } = await getCrmPlatforms(4)
  const { category: Education, brokers: educationPartners } = await getForexEducationPartners(3)
  const { category: Trading, brokers: tradingPartners } = await getTradingPlatformPartners(5)
  const allBrokers = await getAllPartners(40)

  return (
    <>
      {/* <CategoriesHero /> */}
      <CommonBanner title="Browse Categories" description="Explore our comprehensive directory of forex brokers and trading services across 
multiple categories." image="/assets/images/bull.png" />
      <CategoriesCard
        AlgoCategory={Algo}
        bridgeCategory={Bridge}
        liquidityCategory={Liquidity}
        PSPCategory={PSP}
        trustedCategory={Trusted}
        crmCategory={CRM}
        educationCategory={Education}
        tradingCategory={Trading}
        AlgoPartners={AlgoPartners}
        bridgePartners={bridgePartners}
        liquidityPartners={liquidityPartners}
        PSPPartners={PSPPartners}
        trustedPlatforms={trustedPlatforms}
        crmPartners={crmPartners}
        educationPartners={educationPartners}
        tradingPartners={tradingPartners}
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
