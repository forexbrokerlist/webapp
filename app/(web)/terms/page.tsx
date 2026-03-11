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
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using {siteConfig.name} (the "Website"), you agree to be bound by these
          Terms of Service and all applicable laws and regulations. If you do not agree with any of
          these terms, you are prohibited from using or accessing this site.
        </p>

        <h2>2. Use License</h2>
        <p>
          Permission is granted to temporarily download one copy of the materials (information or
          software) on {siteConfig.name} for personal, non-commercial transitory viewing only.
        </p>
        <p>This is the grant of a license, not a transfer of title, and under this license you may not:</p>
        <ul>
          <li>modify or copy the materials;</li>
          <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
          <li>attempt to decompile or reverse engineer any software contained on the Website;</li>
          <li>remove any copyright or other proprietary notations from the materials; or</li>
          <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
        </ul>

        <h2>3. User Submissions</h2>
        <p>
          When you submit a broker listing or any other content to {siteConfig.name}, you grant us
          a non-exclusive, world-wide, royalty-free license to use, copy, reproduce, process, adapt,
          modify, publish, transmit, display and distribute such content in any and all media or
          distribution methods.
        </p>

        <h2>4. Disclaimer</h2>
        <p>
          The materials on {siteConfig.name} are provided on an 'as is' basis. {siteConfig.name}{" "}
          makes no warranties, expressed or implied, and hereby disclaims and negates all other
          warranties including, without limitation, implied warranties or conditions of
          merchantability, fitness for a particular purpose, or non-infringement of intellectual
          property or other violation of rights.
        </p>

        <h2>5. Limitations</h2>
        <p>
          In no event shall {siteConfig.name} or its suppliers be liable for any damages (including,
          without limitation, damages for loss of data or profit, or due to business interruption)
          arising out of the use or inability to use the materials on the Website, even if{" "}
          {siteConfig.name} or a {siteConfig.name} authorized representative has been notified
          orally or in writing of the possibility of such damage.
        </p>

        <h2>6. Accuracy of Materials</h2>
        <p>
          The materials appearing on {siteConfig.name} could include technical, typographical, or
          photographic errors. {siteConfig.name} does not warrant that any of the materials on its
          website are accurate, complete or current. {siteConfig.name} may make changes to the
          materials contained on its website at any time without notice.
        </p>

        <h2>7. Links</h2>
        <p>
          {siteConfig.name} has not reviewed all of the sites linked to its website and is not
          responsible for the contents of any such linked site. The inclusion of any link does not
          imply endorsement by {siteConfig.name} of the site. Use of any such linked website is at
          the user's own risk.
        </p>

        <h2>8. Modifications</h2>
        <p>
          {siteConfig.name} may revise these terms of service for its website at any time without
          notice. By using this website you are agreeing to be bound by the then current version of
          these terms of service.
        </p>

        <h2>9. Governing Law</h2>
        <p>
          These terms and conditions are governed by and construed in accordance with the laws and
          you irrevocably submit to the exclusive jurisdiction of the courts in that State or
          location.
        </p>
      </Prose>

      <StructuredData data={structuredData} />
    </>
  )
}
