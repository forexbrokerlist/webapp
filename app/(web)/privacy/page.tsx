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
const namespace = "pages.privacy"

// Get page data
const getData = cache(async () => {
  const t = await getTranslations()
  const url = "/privacy"
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
        <h2>1. Information We Collect</h2>
        <p>
          We collect information from you when you visit our site, register on our site, subscribe
          to our newsletter, or submit a broker listing.
        </p>
        <p>
          When registering or submitting on our site, as appropriate, you may be asked to enter
          your: name, e-mail address, or website URL.
        </p>

        <h2>2. What We Use Your Information For</h2>
        <p>Any of the information we collect from you may be used in one of the following ways:</p>
        <ul>
          <li>To personalize your experience;</li>
          <li>To improve our website;</li>
          <li>To improve customer service;</li>
          <li>To process transactions;</li>
          <li>To send periodic emails;</li>
          <li>To manage ads and subscriptions.</li>
        </ul>

        <h2>3. How We Protect Your Information</h2>
        <p>
          We implement a variety of security measures to maintain the safety of your personal
          information when you enter, submit, or access your personal information.
        </p>

        <h2>4. Do We Use Cookies?</h2>
        <p>
          Yes. Cookies are small files that a site or its service provider transfers to your
          computers hard drive through your Web browser (if you allow) that enables the sites or
          service providers systems to recognize your browser and capture and remember certain
          information.
        </p>

        <h2>5. Third Party Links</h2>
        <p>
          Occasionally, at our discretion, we may include or offer third party products or services
          on our website. These third party sites have separate and independent privacy policies.
          We therefore have no responsibility or liability for the content and activities of these
          linked sites.
        </p>

        <h2>6. Google Analytics</h2>
        <p>
          We use Google Analytics on our website to help us understand how people use our site.
          Google Analytics collects information anonymously. It reports website trends without
          identifying individual visitors.
        </p>

        <h2>7. Online Privacy Policy Only</h2>
        <p>
          This online privacy policy applies only to information collected through our website and
          not to information collected offline.
        </p>

        <h2>8. Your Consent</h2>
        <p>By using our site, you consent to our website's privacy policy.</p>

        <h2>9. Changes to our Privacy Policy</h2>
        <p>
          If we decide to change our privacy policy, we will post those changes on this page.
        </p>
      </Prose>

      <StructuredData data={structuredData} />
    </>
  )
}
