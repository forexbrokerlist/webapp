import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { cache } from "react"
import { Prose } from "~/components/common/prose"
import { StructuredData } from "~/components/web/structured-data"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { generateWebPage } from "~/lib/structured-data"

// I18n page namespace
const namespace = "pages.disclaimer"

// Get page data
const getData = cache(async () => {
  const t = await getTranslations()
  const url = "/disclaimer"
  const title = t(`${namespace}.title`)
  const description = t(`${namespace}.description`, { siteName: siteConfig.name })

  return getPageData(url, title, description, {
    breadcrumbs: [{ url, title }],
    structuredData: [generateWebPage(url, title, description)],
  })
})

export const generateMetadata = async (): Promise<Metadata> => {
  const { url, metadata } = await getData()
  return getPageMetadata({ url, metadata })
}

export default async function () {
  const { metadata, structuredData } = await getData()

  return (
    <>
      <Intro>
        <IntroTitle>{metadata.title}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <Prose>
        <h2>1. Financial Advice</h2>
        <p>
          The information provided on {siteConfig.name} is for informational purposes only and
          does not constitute financial, investment, or trading advice. You should not treat any
          content on this website as a recommendation to buy or sell any financial instrument.
        </p>

        <h2>2. Risk Warning</h2>
        <p>
          Trading foreign exchange (forex) on margin carries a high level of risk and may not be
          suitable for all investors. The high degree of leverage can work against you as well as
          for you. Before deciding to invest in foreign exchange you should carefully consider your
          investment objectives, level of experience, and risk appetite.
        </p>
        <p>
          The possibility exists that you could sustain a loss of some or all of your initial
          investment and therefore you should not invest money that you cannot afford to lose.
        </p>

        <h2>3. Accuracy of Information</h2>
        <p>
          While we strive to provide accurate and up-to-date information, the forex market is
          dynamic and information can change rapidly. {siteConfig.name} does not warrant the
          accuracy, completeness, or timeliness of the information provided. Use of the information
          presented on this website is at your own risk.
        </p>

        <h2>4. Broker Listings and Reviews</h2>
        <p>
          The broker listings, reviews, and ratings are based on information provided by the
          brokers themselves and user feedback. They are intended to provide a starting point for
          your own research and due diligence. We do not endorse any specific broker and we are not
          responsible for any trading losses incurred with any broker listed on our site.
        </p>

        <h2>5. Affiliate Disclaimer</h2>
        <p>
          Some of the links on this website are affiliate links, which means we may receive a
          commission if you click on a link and sign up with a broker. This helps us maintain and
          grow {siteConfig.name} at no additional cost to you. However, our reviews and ratings
          remain independent and unbiased.
        </p>

        <h2>6. Limitation of Liability</h2>
        <p>
          {siteConfig.name} and its owner(s) shall not be liable for any loss or damage,
          financial or otherwise, resulting from the use of or reliance on the information provided
          on this website.
        </p>
      </Prose>

      <StructuredData data={structuredData} />
    </>
  )
}
