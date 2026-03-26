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
const namespace = "pages.cookies"

// Get page data
const getData = cache(async () => {
  const t = await getTranslations()
  const url = "/cookies"
  const title = t(`${namespace}.title`)
  const description = t(`${namespace}.description`, { siteName: siteConfig.name })

  return getPageData(url, title, description, {
    breadcrumbs: [{ url, title }],
    structuredData: [generateWebPage(url, title, description)],
  })
})

export const generateMetadata = async (): Promise<Metadata> => {
  const { url, metadata } = await getData()
  return getPageMetadata({ url, metadata: { ...metadata, ...seoData.cookies } })
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
        <h2>1. What Are Cookies?</h2>
        <p>
          Cookies are small text files placed on your device when you visit a website. They help
          websites remember your preferences, understand how you use the site, and deliver relevant
          advertising.
        </p>

        <h2>2. Types of Cookies We Use</h2>
        <table>
          <thead>
            <tr>
              <th>Cookie Type</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Essential Cookies</strong></td>
              <td>Required for the website to function (login sessions, security)</td>
            </tr>
            <tr>
              <td><strong>Analytics Cookies</strong></td>
              <td>Help us understand how visitors interact with our site (e.g., Google Analytics)</td>
            </tr>
            <tr>
              <td><strong>Advertising Cookies</strong></td>
              <td>Used to show relevant ads and track ad performance</td>
            </tr>
            <tr>
              <td><strong>Preference Cookies</strong></td>
              <td>Remember your settings and preferences</td>
            </tr>
          </tbody>
        </table>

        <h2>3. Specific Cookies We Use</h2>
        <ul>
          <li>
            <strong>Google Analytics</strong> – Tracks website traffic and user behavior anonymously
          </li>
          <li>
            <strong>Stripe / Payment Cookies</strong> – Used during payment processing for broker
            plan subscriptions
          </li>
          <li><strong>Session Cookies</strong> – Temporary cookies that expire when you close your browser</li>
          <li>
            <strong>Newsletter Cookies</strong> – Remember if you have subscribed or dismissed our
            newsletter prompt
          </li>
        </ul>

        <h2>4. Managing Cookies</h2>
        <p>You can control and manage cookies in several ways:</p>
        <ul>
          <li>
            <strong>Browser Settings:</strong> Most browsers allow you to block or delete cookies
            through their settings menu
          </li>
          <li>
            <strong>Opt-Out Tools:</strong> You can opt out of Google Analytics at:{" "}
            <a href="https://tools.google.com/dlpage/gaoptout">tools.google.com/dlpage/gaoptout</a>
          </li>
          <li>
            <strong>Cookie Banner:</strong> When you first visit our site, you can accept or decline
            non-essential cookies via our cookie consent banner
          </li>
        </ul>
        <p>Please note that disabling certain cookies may affect the functionality of our website.</p>

        <h2>5. Third-Party Cookies</h2>
        <p>
          Our sponsors and advertisers may also place cookies on your device. We do not control
          these cookies and recommend reviewing the privacy policies of our advertising partners.
        </p>

        <h2>6. Updates to This Policy</h2>
        <p>
          We may update this Cookie Policy as our use of cookies changes. The latest version will
          always be available on this page.
        </p>

        <h2>7. Contact Us</h2>
        <p>
          Questions about our Cookie Policy? Email:{" "}
          <a href="mailto:forexbrokerlist24@gmail.com">forexbrokerlist24@gmail.com</a>
        </p>
      </Prose>

      <StructuredData data={structuredData} />
    </>
  )
}
