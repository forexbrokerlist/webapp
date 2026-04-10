import { getTranslations } from "next-intl/server"
import { cache, Suspense } from "react"
import { db } from "~/services/db"
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

export const dynamic = "force-dynamic"

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

  const structuredData = [
    generateWebPage(siteConfig.url, title, description),
    generateFAQ(faqData)
  ]

  return getPageData(siteConfig.url, title, description, {
    structuredData
  })
})

export const generateMetadata = async () => {
  const { url, metadata } = await getData()
  const title = metadata.title as string
  const description = metadata.description as string
  return getPageMetadata({ url, title, description, metadata })
}

export default async function (props: any) {
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
    } catch (e) {}

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
    include: {
      brokers: {
        where: { status: { in: ["Published", "Scheduled"] } },
        take: 8,
      },
    },
  })

  const crmSolutions = await Promise.all(
    (crmCategory?.brokers || []).map(async (broker) => ({
      id: broker.id,
      name: broker.broker_name || "",
      subtitle: broker.subtitle || broker.execution_types || "Global Exchange & Liquidity Provider",
      logo: await getLogo(broker),
    }))
  )

  return (
    <>
      <Hero />
      <ClientLogo logos={logos} />
      <TrustedTrading platforms={trustedPlatforms} />
      <CrmBackOffice solutions={crmSolutions} />
      <ForexEducation />
      <BidgeAndPlug />
      <InvestInEverything />
      <OurPartners />
      <ForexBrokers />
      <BlogSection />
      <FAQ />
      <StructuredData data={structuredData} />
    </>
  )
}
