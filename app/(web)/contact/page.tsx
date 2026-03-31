import seoData from "~/config/seo.json"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { cache } from "react"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { ContactForm } from "~/components/web/contact-form"
import { StructuredData } from "~/components/web/structured-data"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { generateWebPage } from "~/lib/structured-data"

const namespace = "pages.contact_us"

const getData = cache(async () => {
  const t = await getTranslations()
  const url = "/contact"
  const title = t(`${namespace}.title`)
  const description = t(`${namespace}.description`, { siteName: siteConfig.name })

  return getPageData(url, title, description, {
    breadcrumbs: [{ url, title }],
    structuredData: [generateWebPage(url, title, description)],
  })
})

export const generateMetadata = async (): Promise<Metadata> => {
  const { url, metadata } = await getData()
  const mergedMetadata = { ...metadata, ...seoData.contact }
  return getPageMetadata({
    url,
    title: mergedMetadata.title,
    description: mergedMetadata.description,
    metadata: mergedMetadata
  })
}

export default async function () {
  const t = await getTranslations()
  const { metadata, structuredData } = await getData()

  return (
    <>
      <Intro>
        <IntroTitle>{metadata.title}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] lg:items-start">
        <ContactForm />

        <Stack
          direction="column"
          className="gap-4 rounded-xl border border-border bg-muted/20 p-5 lg:sticky lg:top-24"
        >
          <h2 className="text-xl font-semibold">{t(`${namespace}.sidebar.title`)}</h2>

          <p className="text-sm text-muted-foreground">{t(`${namespace}.sidebar.description`)}</p>
          <p className="text-sm text-muted-foreground">{t(`${namespace}.sidebar.reply_time`)}</p>

          <Stack direction="column" className="gap-1 text-sm">
            <span className="font-medium">{t(`${namespace}.sidebar.email_label`)}</span>
            <Link
              href={`mailto:${siteConfig.email}`}
              className="text-primary underline underline-offset-4 break-all"
            >
              {siteConfig.email}
            </Link>
          </Stack>
        </Stack>
      </div>

      <StructuredData data={structuredData} />
    </>
  )
}
