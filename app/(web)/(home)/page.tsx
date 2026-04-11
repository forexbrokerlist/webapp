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

  const getLogo = async (broker: any) => {
    let domain = "forex.com"
    const targetUrl = broker.broker_website || broker.url
    try {
      if (targetUrl) {
        const urlObj = new URL(targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`)
        domain = urlObj.hostname
      }
    } catch (e) { }

    // Use Google Favicon API as primary source for small logo icons
    if (domain && domain !== "forex.com") {
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
    }

    if (broker.screenshotUrl) {
      return (await getPresignedUrlFromFull(broker.screenshotUrl)) as string
    }

    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
  }


  const trustedCategory = await db.category.findUnique({
    where: { slug: "trusted-trading-platforms" },
    include: {
      brokers: {
        where: {
          status: { in: ["Published", "Scheduled"] },
        },
        take: 7,
      },
    },
  })

  const trustedPlatforms = await Promise.all(
    (trustedCategory?.brokers || []).map(async (broker) => ({
      id: broker.id,
      name: broker.broker_name || "",
      description: broker.description || "",
      minDeposit: broker.minimum_deposit || "Varies",
      logo: await getLogo(broker),
      isSponsor: broker.isSponsor,
      rating: broker.overall_rating || "0",
    }))
  )

  const crmCategory = await db.category.findUnique({
    where: { slug: "crm-and-back-office-software" },
  })

  const crmSponsors = await db.sponsor.findMany({
    where: {
      categoryId: crmCategory?.id,
      isActive: true,
    },
    orderBy: { order: "asc" },
    take: 4,
  })

  const crmSolutions = await Promise.all(
    crmSponsors.map(async (sponsor) => ({
      id: sponsor.id,
      name: sponsor.name,
      title: sponsor.title || "Forex CRM Solution",
      description: sponsor.description,
      logo: (await getPresignedUrlFromFull(sponsor.logoUrl)) as string,
      features: sponsor.features,
      highlightedPoint: sponsor.highlightedPoint,
      socialProof: sponsor.socialProof,
    }))
  )

  const bridgeCategory = await db.category.findUnique({
    where: { slug: "bridge-and-plug-in-partners" },
  })

  const bridgeSponsors = await db.sponsor.findMany({
    where: {
      categoryId: bridgeCategory?.id,
      isActive: true,
    },
    orderBy: { order: "asc" },
    take: 6,
  })

  const bridgePartners = await Promise.all(
    bridgeSponsors.map(async (sponsor) => ({
      id: sponsor.id,
      name: sponsor.name,
      title: sponsor.title || "Technology Partner",
      description: sponsor.description,
      logoUrl: (await getPresignedUrlFromFull(sponsor.logoUrl)) as string,
      features: sponsor.features,
      highlightedPoint: sponsor.highlightedPoint,
      socialProof: sponsor.socialProof,
    }))
  )
  const liquidityCategory = await db.category.findUnique({
    where: { slug: "liquidity-partners" },
  })

  const liquiditySponsors = await db.sponsor.findMany({
    where: {
      categoryId: liquidityCategory?.id,
      isActive: true,
    },
    orderBy: { order: "asc" },
    take: 2,
  })

  const liquidityPartners = await Promise.all(
    liquiditySponsors.map(async (sponsor) => ({
      id: sponsor.id,
      name: sponsor.name,
      title: sponsor.title || "Technology Partner",
      subtitle: sponsor.subtitle,
      description: sponsor.description,
      logoUrl: (await getPresignedUrlFromFull(sponsor.logoUrl)) as string,
      features: sponsor.features,
      highlightedPoint: sponsor.highlightedPoint,
      socialProof: sponsor.socialProof,
    }))
  )
  const PSPCategory = await db.category.findUnique({
    where: { slug: "psp-partners" },
  })

  const PSPCategorySponsors = await db.sponsor.findMany({
    where: {
      categoryId: PSPCategory?.id,
      isActive: true,
    },
    orderBy: { order: "asc" },
    take: 10,
  })

  const PSPPartners = await Promise.all(
    PSPCategorySponsors.map(async (sponsor) => ({
      id: sponsor.id,
      name: sponsor.name,
      title: sponsor.title || "Technology Partner",
      subtitle: sponsor.subtitle,
      description: sponsor.description,
      logoUrl: (await getPresignedUrlFromFull(sponsor.logoUrl)) as string,
      features: sponsor.features,
      highlightedPoint: sponsor.highlightedPoint,
      socialProof: sponsor.socialProof,
    }))
  )
  const TradingPlatformCategory = await db.category.findUnique({
    where: { slug: "trading-platform-partners" },
  })

  const TradingPlatformSponsors = await db.sponsor.findMany({
    where: {
      categoryId: TradingPlatformCategory?.id,
      isActive: true,
    },
    orderBy: { order: "asc" },
    take: 10,
  })

  const TradingPalformPartners = await Promise.all(
    TradingPlatformSponsors.map(async (sponsor) => ({
      id: sponsor.id,
      name: sponsor.name,
      title: sponsor.title || "Technology Partner",
      subtitle: sponsor.subtitle,
      description: sponsor.description,
      logoUrl: (await getPresignedUrlFromFull(sponsor.logoUrl)) as string,
      features: sponsor.features,
      highlightedPoint: sponsor.highlightedPoint,
      socialProof: sponsor.socialProof,
    }))
  )
    const AlgoCategory = await db.category.findUnique({
    where: { slug: "algorithmic-trading-and-bot-providers" },
  })

  const AlgoCategorySponsors = await db.sponsor.findMany({
    where: {
      categoryId: AlgoCategory?.id,
      isActive: true,
    },
    orderBy: { order: "asc" },
    take: 10,
  })

  const AlgoPartners = await Promise.all(
    AlgoCategorySponsors.map(async (sponsor) => ({
      id: sponsor.id,
      name: sponsor.name,
      title: sponsor.title || "Technology Partner",
      subtitle: sponsor.subtitle,
      description: sponsor.description,
      logoUrl: (await getPresignedUrlFromFull(sponsor.logoUrl)) as string,
      bannerUrl: sponsor.bannerImage ? (await getPresignedUrlFromFull(sponsor.bannerImage)) as string : null,
      websiteUrl: sponsor.websiteUrl,
      features: sponsor.features,
      highlightedPoint: sponsor.highlightedPoint,
      socialProof: sponsor.socialProof,
    }))
  )
  const ForexCategory = await db.category.findUnique({
    where: { slug: "forex-education-and-training" },
  })

  const ForexCategorySponsors = await db.sponsor.findMany({
    where: {
      categoryId: ForexCategory?.id,
      isActive: true,
    },
    orderBy: { order: "asc" },
    take: 10,
  })

  const ForexPartners = await Promise.all(
    ForexCategorySponsors.map(async (sponsor) => ({
      id: sponsor.id,
      name: sponsor.name,
      title: sponsor.title || "Technology Partner",
      subtitle: sponsor.subtitle,
      description: sponsor.description,
      logoUrl: (await getPresignedUrlFromFull(sponsor.logoUrl)) as string,
      bannerUrl: sponsor.bannerImage ? (await getPresignedUrlFromFull(sponsor.bannerImage)) as string : null,
      websiteUrl: sponsor.websiteUrl,
      features: sponsor.features,
      highlightedPoint: sponsor.highlightedPoint,
      socialProof: sponsor.socialProof,
    }))
  )

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
      <TrustedTrading platforms={trustedPlatforms} />
      <CrmBackOffice solutions={crmSolutions} />
      <ForexEducation partners={ForexPartners} />
      
      <BidgeAndPlug partners={bridgePartners} />
      <InvestInEverything />
      <OurPartners liquidityPartners={liquidityPartners} PSPPartners={PSPPartners} TradingPalformPartners={TradingPalformPartners} />
      <AlgoTrading partners={AlgoPartners}/>
      <ForexBrokers />

      <BlogSection posts={posts} />
      <FAQ />
      <StructuredData data={structuredData} />
    </>
  )
}
