import { LoaderIcon } from "lucide-react"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { cache, Suspense } from "react"
import { Login } from "~/components/web/auth/login"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"
import seoData from "~/config/seo.json"
import { generateWebPage } from "~/lib/structured-data"

const namespace = "pages.auth.login"

const getData = cache(async () => {
  const t = await getTranslations()
  const url = "/auth/login"
  const title = t(`${namespace}.title`)
  const description = t(`${namespace}.description`, { siteName: siteConfig.name })

  return getPageData(url, title, description, {
    breadcrumbs: [{ url, title }],
    structuredData: [generateWebPage(url, title, description)],
  })
})

export const generateMetadata = async (): Promise<Metadata> => {
  const { url, metadata } = await getData()
  const mergedMetadata = { ...metadata, ...seoData.login }
  return getPageMetadata({
    url,
    title: mergedMetadata.title,
    description: mergedMetadata.description,
    metadata
  })
}

export default async function () {
  const { metadata } = await getData()

  return (
    <>
      <Intro>
        <IntroTitle size="h3">{metadata.title}</IntroTitle>
        <IntroDescription className="md:text-sm">{metadata.description}</IntroDescription>
      </Intro>

      <Suspense fallback={<LoaderIcon className="animate-spin mx-auto" />}>
        <Login />
      </Suspense>
    </>
  )
}
