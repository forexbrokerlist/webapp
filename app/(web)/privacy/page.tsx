import seoData from "~/config/seo.json"
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
  const mergedMetadata = { ...metadata, ...seoData.privacy }
  return getPageMetadata({
    url,
    title: mergedMetadata.title,
    description: mergedMetadata.description,
    metadata: mergedMetadata
  })
}

export default async function () {
  const { metadata, structuredData } = await getData()

  return (
    <>
      <div className="pt-[140px] pb-100">
        <div className="max-w-[1640px] px-5 max-laptop:px-16 mx-auto relative max-tab:px-5 max-mobile:px-4">
          <Intro className="pb-10">
            <IntroTitle>{metadata.title}</IntroTitle>
            <IntroDescription>{metadata.description}</IntroDescription>
          </Intro>
          <Prose>
            <h2>1. Introduction</h2>
            <p>
              Welcome to Forex Brokers List ("we," "our," or "us"). We are committed to protecting your
              personal information and your right to privacy. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you visit our website{" "}
              <a href="https://forexbrokerslisting.com">forexbrokerslisting.com</a>.
            </p>

            <h2>2. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul>
              <li>
                <strong>Personal Information:</strong> Name, email address, company name, and payment
                details when you register, subscribe to our newsletter, or submit a broker listing.
              </li>
              <li>
                <strong>Usage Data:</strong> IP address, browser type, pages visited, time spent on
                pages, and referring URLs.
              </li>
              <li>
                <strong>Cookies & Tracking Data:</strong> We use cookies and similar tracking
                technologies to enhance your experience (see our Cookie Policy for details).
              </li>
              <li>
                <strong>Communications:</strong> Any messages or inquiries you send us via contact forms
                or email.
              </li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, operate, and maintain our website and directory services</li>
              <li>Process broker submissions and advertiser requests</li>
              <li>Send newsletters and marketing communications (with your consent)</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Analyze usage trends to improve our platform</li>
              <li>Prevent fraudulent activity and ensure website security</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>4. Sharing Your Information</h2>
            <p>We do not sell your personal data. We may share your information with:</p>
            <ul>
              <li>
                <strong>Service Providers:</strong> Third-party vendors who assist us in operating our
                website (e.g., payment processors, email providers, analytics tools)
              </li>
              <li>
                <strong>Sponsors & Advertisers:</strong> Only aggregated, non-identifiable data may be
                shared with our advertising partners
              </li>
              <li>
                <strong>Legal Authorities:</strong> When required by law or to protect our rights
              </li>
            </ul>

            <h2>5. Data Retention</h2>
            <p>
              We retain your personal data only as long as necessary for the purposes outlined in this
              policy, or as required by applicable law. You may request deletion of your data at any
              time.
            </p>

            <h2>6. Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul>
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Request deletion of your personal data</li>
              <li>Withdraw consent for marketing communications</li>
              <li>Lodge a complaint with a data protection authority</li>
            </ul>
            <p>
              To exercise any of these rights, contact us at:{" "}
              <a href="mailto:forexbrokerlist24@gmail.com">forexbrokerlist24@gmail.com</a>
            </p>

            <h2>7. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites, including broker websites and
              sponsor pages. We are not responsible for the privacy practices of those websites and
              encourage you to review their privacy policies.
            </p>

            <h2>8. Children's Privacy</h2>
            <p>
              Our website is not directed at individuals under the age of 18. We do not knowingly
              collect personal information from minors.
            </p>

            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant
              changes by updating the date at the top of this page.
            </p>

            <h2>10. Contact Us</h2>
            <p>For any privacy-related questions, please contact: Forex Brokers List</p>
            <p>
              Email: <a href="mailto:forexbrokerlist24@gmail.com">forexbrokerlist24@gmail.com</a>
            </p>
          </Prose>
          <StructuredData data={structuredData} />
        </div>
      </div>
    </>
  )
}
