import seoData from "~/config/seo.json"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { cache } from "react"
import AnimatedSection from "~/components/web/ui/animated-section"
import { Prose } from "~/components/common/prose"
import { StructuredData } from "~/components/web/structured-data"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { generateWebPage } from "~/lib/structured-data"
import CommonBanner from "~/components/web/common-banner"


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
  const mergedMetadata = { ...metadata, ...seoData.disclaimer }
  return getPageMetadata({
    url,
    title: mergedMetadata.title,
    description: mergedMetadata.description,
    metadata: mergedMetadata
  })
}

export default async function () {
  const { metadata, structuredData } = await getData()
  const title = metadata.title.split(" ")
  return (
    <>
      <CommonBanner highlightedText={title[0] + " - "} title={"Important Information for Users Trading & Investment Risk Notice"} description={metadata.description} image="/assets/images/Disclaimer.png" />
      <div className="py-20 max-mobile:py-12 ">
        {/* same container as banner */}
        <div className="max-w-[1700px] mx-auto px-5 max-laptop:px-16 max-tab:px-5 max-mobile:px-4">

          {/* Card */}
          <div className="bg-white rounded-3xl px-8 py-12 md:px-12 md:py-16">
            <AnimatedSection>
              <Prose
                className="
            max-w-[2000px]
           
            prose-headings:text-black100
            prose-p:text-black700
            prose-li:text-black700
            prose-h2:text-2xl
            prose-h2:font-bold
            prose-h2:mt-12
            prose-h2:mb-6
            first:prose-h2:mt-0
          "
              >
                <h2>1. General Disclaimer</h2> <p> The information provided on Forex Brokers List is for general informational and directory purposes only. We make no representations or warranties of any kind, express or implied, regarding the accuracy, completeness, or suitability of any information on this website. </p> <h2>2. Not Financial Advice</h2> <p> Nothing on this website constitutes financial, investment, or trading advice. Forex trading involves significant risk of loss and is not suitable for all investors. You should always: </p> <ul> <li>Conduct your own due diligence before choosing a broker</li> <li>Consult a qualified financial advisor before making investment decisions</li> <li>Understand the risks involved in forex and CFD trading</li> </ul> <h2>3. Broker Information Accuracy</h2> <ul> <li> Broker details (spreads, regulations, platforms, minimum deposits) are sourced from publicly available information and broker submissions </li> <li>This information may be outdated or inaccurate always verify directly with the broker</li> <li> Sponsored and featured listings are paid placements and do not represent our endorsement of any broker </li> <li> Inclusion in our directory does not imply that a broker is safe, regulated, or recommended </li> </ul> <h2>4. Regulation & Compliance</h2> <p> Forex trading may be regulated differently depending on your country of residence. It is your responsibility to ensure that using any broker listed on our platform complies with the laws and regulations of your jurisdiction. </p> <h2>5. Affiliate & Commercial Relationships</h2> <p> Some links and listings on this website may be affiliate links or paid sponsorships. We may receive compensation when you click on links or sign up with brokers. This does not influence our listing criteria, though sponsored brokers are clearly labeled. </p> <h2>6. Third-Party Websites</h2> <p> Our website contains links to third-party websites. We have no control over the content, privacy practices, or availability of those sites and accept no responsibility for them. </p> <h2>7. No Liability</h2> <p> To the fullest extent permitted by law, Forex Brokers List shall not be liable for any direct, indirect, incidental, or consequential damages arising from: </p> <ul> <li>Use of or reliance on information from this website</li> <li>Trading decisions made based on broker listings</li> <li>Any errors or omissions in the content</li> </ul> <h2>8. Contact Us</h2> <p> For any questions about this Disclaimer: Email:{" "} <a href="mailto:forexbrokerlist24@gmail.com">forexbrokerlist24@gmail.com</a> </p>

                {/* remaining content */}
              </Prose>
            </AnimatedSection>
          </div>

        </div>
      </div>

      <div className='w-full h-[1px] bg-[linear-gradient(90deg,#F0F1EC_0%,#A8DD15_50%,#F0F1EC_100%)]'></div>

      <StructuredData data={structuredData} />
    </>
  )
}
