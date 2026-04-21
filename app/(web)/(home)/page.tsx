import { getTranslations } from "next-intl/server"
import { cache, Suspense } from "react"
import { unstable_noStore as noStore } from "next/cache"
import { db } from "~/services/db"


export const revalidate = 0
import { getPresignedUrlFromFull } from "~/lib/media"
import { Hero } from "~/app/(web)/(home)/hero"
import { Pricing } from "~/app/(web)/(home)/pricing"
import { Sponsors } from "~/app/(web)/(home)/sponsors"
import { StructuredData } from "~/components/web/structured-data"
import { ToolListingSkeleton } from "~/components/web/tools/tool-listing"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { generateWebPage, generateFAQ } from "~/lib/structured-data"
import FAQ from "./faq"
import ClientLogo from "./client-logo"
import TrustedTrading from "./trusted-trading"
import CrmBackOffice from "./crm-back-office"
import ForexEducation from "./forex-education"
import BlogSection from "./blog-section"
import ForexBrokers from "./forex-brokers"
import OurPartners from "./our-partners"
import BidgeAndPlug from "./bridge-and-plug"
import InvestInEverything from "./invest-in-everything"
import AlgoTrading from "./algo-trading"
import { generateBlog } from "~/lib/structured-data"
import { getPosts } from "~/server/web/posts/queries"
import { 
  getTrustedPlatforms, 
  getCrmPlatforms, 
  getBridgePartners, 
  getLiquidityPartners, 
  getPspPartners, 
  getTradingPlatformPartners, 
  getAlgoPartners, 
  getForexEducationPartners 
} from "~/server/web/brokers/queries"

const namespace = "pages.blog"

// Get page data
const getData = cache(async () => {
  const t = await getTranslations()
  const title = `${siteConfig.name} - ${t("brand.tagline")}`

  const description = t("brand.meta_description")

  // FAQ data for structured data
  const faqData = [
    {
      question: "What is ForexBrokerList.io?",
      answer: "A comprehensive directory to discover and compare 512+ forex brokers and industry service providers. We help traders find the right broker based on spreads, regulation, platforms, and more."
    },
    {
      question: "How do I find the right forex broker?",
      answer: "Browse our directory and filter brokers by regulation, minimum deposit, platform, and trading conditions. Each listing has detailed info to help you make a confident, informed decision."
    },
    {
      question: "Are the brokers on your list regulated?",
      answer: "Every listing displays regulatory information and the number of licenses a broker holds. Always verify a broker's regulation before depositing any funds."
    },
    {
      question: "How can my broker get listed on the site?",
      answer: "Simply visit our Submit page and fill in your broker or service details for review. Sponsored placements are also available for maximum visibility across our platform."
    },
    {
      question: "What is the difference between a regular and sponsored listing?",
      answer: "Regular listings appear in the standard directory, while sponsored listings get priority placement at the top of their category. Sponsored spots offer significantly more visibility to our professional audience."
    },
    {
      question: "Is ForexBrokerList.io free for traders?",
      answer: "Yes, browsing and comparing all brokers on our platform is 100% free. No sign-up is required to explore listings and access broker information."
    },
    {
      question: "How do I stay updated with new listings?",
      answer: "Subscribe to our newsletter and join 5,000+ members who get updates directly to your inbox. New brokers, platform changes, and industry news all in one place."
    }
  ]

  const posts = await getPosts()

  const structuredData = [
    generateWebPage(siteConfig.url, title, description),
    generateFAQ(faqData),
    generateBlog(siteConfig.url, title, description, posts)
  ]

  const pageData = getPageData(siteConfig.url, title, description, {
    structuredData,
  })

  return { ...pageData, posts }
})

export const generateMetadata = async () => {
  const { url, metadata } = await getData()
  const title = metadata.title as string
  const description = metadata.description as string
  return getPageMetadata({ url, title, description, metadata })
}

export default async function (props: any) {
  noStore();
  const { structuredData } = await getData()
  const dbSponsors = await db.sponsor.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  })

  const logos = await Promise.all(
    dbSponsors.map(async (sponsor) => ({
      src: (await getPresignedUrlFromFull(sponsor.logoUrl)) as string,
      alt: sponsor.name,
    }))
  )



  const { brokers: trustedPlatforms, category: trustedCategory } = await getTrustedPlatforms(7)
  const { brokers: crmPlatform, category: crmCategory } = await getCrmPlatforms(4)
  const { brokers: bridgePartners, category: bridgeCategory } = await getBridgePartners(6)
  const { brokers: liquidityPartners, category: liquidityCategory } = await getLiquidityPartners(2)
  const { brokers: PSPPartners, category: PSPCategory } = await getPspPartners(12)

  const { brokers: TradingPalformPartners, category: TradingpartnerCategory } = await getTradingPlatformPartners(5)


  // const TradingPlatformCategory = await db.category.findUnique({
  //   where: { slug: "trading-platform-partners" },
  // })

  // const TradingPlatformSponsors = await db.sponsor.findMany({
  //   where: {
  //     categoryId: TradingPlatformCategory?.id,
  //     isActive: true,
  //   },
  //   orderBy: { order: "asc" },
  //   take: 10,
  // })

  // const TradingPalformPartners = await Promise.all(
  //   TradingPlatformSponsors.map(async (sponsor) => ({
  //     id: sponsor.id,
  //     name: sponsor.name,
  //     title: sponsor.title || "Technology Partner",
  //     subtitle: sponsor.subtitle,
  //     description: sponsor.description,
  //     logoUrl: (await getPresignedUrlFromFull(sponsor.logoUrl)) as string,
  //     features: sponsor.features,
  //     highlightedPoint: sponsor.highlightedPoint,
  //     socialProof: sponsor.socialProof,
  //     slug: sponsor.slug || ""
  //   }))
  // )

  const { brokers: AlgoPartners, category: AlgoCategory } = await getAlgoPartners(3)
  const { brokers: ForexPartners, category: ForexCategory } = await getForexEducationPartners(3)
  // const ForexCategory = await db.category.findUnique({
  //   where: { slug: "forex-education-and-training" },
  // })

  // const ForexCategorySponsors = await db.sponsor.findMany({
  //   where: {
  //     categoryId: ForexCategory?.id,
  //     isActive: true,
  //   },
  //   orderBy: { order: "asc" },
  //   take: 10,
  // })

  // const ForexPartners = await Promise.all(
  //   ForexCategorySponsors.map(async (sponsor) => ({
  //     id: sponsor.id,
  //     name: sponsor.name,
  //     title: sponsor.title || "Technology Partner",
  //     subtitle: sponsor.subtitle,
  //     description: sponsor.description,
  //     logoUrl: (await getPresignedUrlFromFull(sponsor.logoUrl)) as string,
  //     bannerUrl: sponsor.bannerImage ? (await getPresignedUrlFromFull(sponsor.bannerImage)) as string : null,
  //     websiteUrl: sponsor.websiteUrl,
  //     features: sponsor.features,
  //     highlightedPoint: sponsor.highlightedPoint,
  //     socialProof: sponsor.socialProof,
  //     slug: sponsor.slug
  //   }))
  // )

  const LogoCategory = await db.category.findUnique({
    where: { slug: "logo-category" },
  })

  const LogoCategorySponsors = await db.sponsor.findMany({
    where: {
      categoryId: LogoCategory?.id,
      isActive: true,
    },
    orderBy: { order: "asc" },
    take: 10,
  })

  const LogoPartners = await Promise.all(
    LogoCategorySponsors.map(async (sponsor) => ({
      src: (await getPresignedUrlFromFull(sponsor.logoUrl)) as string,
      alt: sponsor.name,
    }))
  )

  const { posts } = await getData()

  return (
    <>
      <Hero />
      <ClientLogo logos={LogoPartners} />
      <TrustedTrading 
        platforms={trustedPlatforms} 
        title={trustedCategory?.label || trustedCategory?.name || "Top-Rated Forex Brokers & Trading Platforms"}
        description={trustedCategory?.description || "Browse verified forex brokers and trading platforms, compare spreads, regulation, and features to find the right fit for your trading goals."}
      />
      <CrmBackOffice 
        solutions={crmPlatform} 
        title={crmCategory?.label || crmCategory?.name || "Forex CRM & Back Office Software for Brokers"}
        description={crmCategory?.description || "Compare forex CRM platforms and back office software providers designed to help brokers streamline operations, onboarding, and reporting."}
      />
      <ForexEducation 
        partners={ForexPartners} 
        title={ForexCategory?.label || ForexCategory?.name || "Learn Forex Trading - Top Education Platforms & Courses"}
        description={ForexCategory?.description || "The forex market rewards those who invest in their knowledge first. Our directory features hand-picked forex education platforms and trading academies trusted by thousands of active traders worldwide."}
      />

      <BidgeAndPlug 
        partners={bridgePartners} 
        title={bridgeCategory?.label || bridgeCategory?.name || "Forex Bridge & Plugin Technology Partners"}
        description={bridgeCategory?.description || "Discover trusted bridge and plugin technology partners used by 512+ forex brokers worldwide. Compare features, integrations, and infrastructure solutions in one place."}
      />
      <InvestInEverything />
      <OurPartners 
        liquidityPartners={liquidityPartners} 
        PSPPartners={PSPPartners} 
        TradingPalformPartners={TradingPalformPartners} 
        liquidityTitle={liquidityCategory?.label || liquidityCategory?.name || "Liquidity Partners"}
        liquidityDescription={liquidityCategory?.description || "Providing deep liquidity and institutional-grade execution for brokers and financial institutions."}
        pspTitle={PSPCategory?.label || PSPCategory?.name || "PSP Partners"}
        pspDescription={PSPCategory?.description || "Explore trusted payment solution providers for forex brokers supporting fast, secure deposits and withdrawals for traders worldwide."}
        tradingPlatformTitle={TradingpartnerCategory?.label || TradingpartnerCategory?.name || "Trading Platform Partners"}
        tradingPlatformDescription={TradingpartnerCategory?.description || "Connect with trusted trading platforms and automate your strategies with powerful tools"}
      />
      <AlgoTrading 
        partners={AlgoPartners} 
        title={AlgoCategory?.label || AlgoCategory?.name || "Algo Trading & Forex Bot Provider"}
        description={AlgoCategory?.description || "Discover automated forex trading bots and algorithmic strategy providers built for passive income, consistent execution, and hands-free trading."}
      />
      <ForexBrokers />

      <BlogSection posts={posts} />
      <FAQ />
      <StructuredData data={structuredData} />
    </>
  )
}
