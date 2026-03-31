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
const namespace = "pages.terms"

// Get page data
const getData = cache(async () => {
  const t = await getTranslations()
  const url = "/terms"
  const title = t(`${namespace}.title`)
  const description = t(`${namespace}.description`, { siteName: siteConfig.name })

  return getPageData(url, title, description, {
    breadcrumbs: [{ url, title }],
    structuredData: [generateWebPage(url, title, description)],
  })
})

export const generateMetadata = async (): Promise<Metadata> => {
  const { url, metadata } = await getData()
  const title = metadata.title as string
  const description = metadata.description as string
  return getPageMetadata({ url, title, description, metadata: { ...metadata, ...seoData.terms } })
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
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using Forex Brokers List ("the Site"), you agree to be bound by these
          Terms of Service. If you do not agree, please discontinue use of our website immediately.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          Forex Brokers List is an online directory that allows users to discover, compare, and
          review forex brokers. We also offer paid listing plans for brokers and advertising
          opportunities for industry partners.
        </p>

        <h2>3. User Accounts</h2>
        <ul>
          <li>You must provide accurate and complete information when creating an account</li>
          <li>You are responsible for maintaining the confidentiality of your account credentials</li>
          <li>You must notify us immediately of any unauthorized use of your account</li>
          <li>We reserve the right to suspend or terminate accounts that violate these Terms</li>
        </ul>

        <h2>4. Broker Submissions</h2>
        <ul>
          <li>
            Brokers listed on our directory are submitted either by the broker themselves or sourced
            from publicly available information
          </li>
          <li>We do not verify, endorse, or guarantee the accuracy of broker information</li>
          <li>
            Paid listings ("Sponsor" placements) are clearly marked and are commercial arrangements
          </li>
          <li>We reserve the right to remove any listing that violates our guidelines</li>
        </ul>

        <h2>5. Paid Plans & Payments</h2>
        <ul>
          <li>Paid plans (Growth, Scale) are billed as described on our Pricing page</li>
          <li>All prices are in USD and VAT may apply depending on your jurisdiction</li>
          <li>We offer a 30-day money-back guarantee for first-time subscribers</li>
          <li>Refunds will not be issued after the 30-day period</li>
        </ul>

        <h2>6. Advertiser Terms</h2>
        <ul>
          <li>Advertising placements are subject to our separate Advertiser Agreement</li>
          <li>We reserve the right to reject or remove any advertisement at our discretion</li>
          <li>Advertisers are responsible for ensuring their content complies with applicable laws</li>
        </ul>

        <h2>7. Prohibited Conduct</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use our website for any unlawful purpose</li>
          <li>Submit false, misleading, or fraudulent broker information</li>
          <li>Attempt to hack, scrape, or disrupt our platform</li>
          <li>Use our content without express written permission</li>
          <li>Impersonate any person or entity</li>
        </ul>

        <h2>8. Intellectual Property</h2>
        <p>
          All content on this website including text, logos, design, and data is the property of
          Forex Brokers List and is protected by applicable copyright laws. You may not reproduce or
          distribute our content without written permission.
        </p>

        <h2>9. Limitation of Liability</h2>
        <p>
          Forex Brokers List is a directory service only. We are not a financial advisor and do not
          provide financial advice. We are not liable for:
        </p>
        <ul>
          <li>Any trading losses incurred through brokers listed on our platform</li>
          <li>Inaccurate or outdated broker information</li>
          <li>Technical interruptions or data loss</li>
        </ul>

        <h2>10. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with applicable laws. Any
          disputes shall be resolved through binding arbitration or in the courts of the applicable
          jurisdiction.
        </p>

        <h2>11. Changes to Terms</h2>
        <p>
          We reserve the right to update these Terms at any time. Continued use of the website after
          changes constitutes acceptance of the new Terms.
        </p>

        <h2>12. Contact Us</h2>
        <p>
          For any questions regarding these Terms: Email:{" "}
          <a href="mailto:forexbrokerlist24@gmail.com">forexbrokerlist24@gmail.com</a>
        </p>
      </Prose>

      <StructuredData data={structuredData} />
    </>
  )
}
