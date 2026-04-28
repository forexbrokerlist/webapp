import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { cache } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/common/avatar"
import { Button } from "~/components/common/button"
import { Link } from "~/components/common/link"
import { Prose } from "~/components/common/prose"
import { Stack } from "~/components/common/stack"
import { StructuredData } from "~/components/web/structured-data"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { generateAboutPage } from "~/lib/structured-data"
import seoData from "~/config/seo.json"
import CommonBanner from "~/components/web/common-banner"
import OurStory from "./our-story"
import OurMission from "./our-mission"
import WhatWeOffer from "./what-we-offer"
import TradersSection from "./traders-section"
import WantToBePart from "./want-to-be-part"
const TradeImage = '/assets/images/about.png';

// I18n page namespace
const namespace = "pages.about"

// Get page data
const getData = cache(async () => {
  const t = await getTranslations()
  const url = "/about"
  const title = seoData.about.title
  const description = seoData.about.description
  return getPageData(url, title, description, {
    breadcrumbs: [{ url, title }],
    structuredData: [generateAboutPage(url, title, description)],
  })
})

export const generateMetadata = async (): Promise<Metadata> => {
  const { url, metadata } = await getData()
  const mergedMetadata = { ...metadata, ...seoData.about }
  return getPageMetadata({
    url,
    title: seoData.about.title,
    description: seoData.about.description,
    metadata: mergedMetadata
  })
}

export default async function () {
  const t = await getTranslations()
  const { metadata, structuredData } = await getData()

  return (
    <>
      <CommonBanner
        image={TradeImage}
        description='Forex Brokers List is a trusted forex broker directory helping traders find and compare the best brokers worldwide. 
Learn who we are and what we stand for.'
        highlightedText="About Us -" title="Top Forex Broker 
Directory | Forex Brokers List" />
      <OurStory />
      <OurMission />
      <WhatWeOffer />
      <TradersSection />
      <WantToBePart />
      <div className='w-full h-[1px] bg-[linear-gradient(90deg,#F0F1EC_0%,#A8DD15_50%,#F0F1EC_100%)]'></div>

      {/* <Intro>
        <IntroTitle>{metadata.title}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro> */}

      {/* <Prose>
        <h2>{t(`${namespace}.story.title`)}</h2>
        <p>{t(`${namespace}.story.content`, { siteName: siteConfig.name })}</p>

        <h2>{t(`${namespace}.mission.title`)}</h2>
        <p>{t(`${namespace}.mission.content`, { siteName: siteConfig.name })}</p>
        <ul className="mt-4 list-disc pl-6 mb-8 text-foreground/80 space-y-2">
          <li>{t(`${namespace}.mission.list.transparency`)}</li>
          <li>{t(`${namespace}.mission.list.accuracy`)}</li>
          <li>{t(`${namespace}.mission.list.community`)}</li>
          <li>{t(`${namespace}.mission.list.accessibility`)}</li>
        </ul>

        <h2>{t(`${namespace}.offer.title`)}</h2>
        <p>{t(`${namespace}.offer.content`, { siteName: siteConfig.name })}</p>
        <ul className="mt-4 list-disc pl-6 mb-8 text-foreground/80 space-y-2">
          <li>{t(`${namespace}.offer.list.listings`)}</li>
          <li>{t(`${namespace}.offer.list.comparisons`)}</li>
          <li>{t(`${namespace}.offer.list.network`)}</li>
          <li>{t(`${namespace}.offer.list.education`)}</li>
          <li>{t(`${namespace}.offer.list.algorithmic`)}</li>
          <li>{t(`${namespace}.offer.list.updates`)}</li>
        </ul>

        <h2>{t(`${namespace}.trust.title`)}</h2>
        <ul className="mt-4 list-disc pl-6 mb-8 text-foreground/80 space-y-2">
          <li>{t(`${namespace}.trust.list.brokers`)}</li>
          <li>{t(`${namespace}.trust.list.customers`)}</li>
          <li>{t(`${namespace}.trust.list.subscribers`)}</li>
          <li>{t(`${namespace}.trust.list.sponsorship`)}</li>
          <li>{t(`${namespace}.trust.list.guarantee`)}</li>
          <li>{t(`${namespace}.trust.list.partners`)}</li>
        </ul>

        <h2>{t(`${namespace}.part_of_it.title`)}</h2>
        <p>{t(`${namespace}.part_of_it.content`)}</p>
        <ul className="mt-4 list-disc pl-6 mb-8 text-foreground/80 space-y-2">
          <li>{t(`${namespace}.part_of_it.list.list`)}</li>
          <li>{t(`${namespace}.part_of_it.list.advertise`)}</li>
          <li>{t(`${namespace}.part_of_it.list.subscribe`)}</li>
        </ul>

        <section className="not-prose mt-20 p-8 rounded-2xl bg-foreground text-background">
          <Stack direction="column" className="items-center text-center gap-4">
            <h2 className="text-3xl font-bold">{t(`${namespace}.contact.title`)}</h2>
            <p className="max-w-2xl opacity-80">
              {t(`${namespace}.contact.content`)}
            </p>
            <Button variant="secondary" asChild className="mt-4">
              <Link href={`mailto:${t(`${namespace}.contact.email`)}`}>
                {t(`${namespace}.contact.button`)}
              </Link>
            </Button>
          </Stack>
        </section>
      </Prose> */}

      <StructuredData data={structuredData} />
    </>
  )
}
