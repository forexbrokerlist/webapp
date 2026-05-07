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
const AuthLineImage = '/assets/images/auth-line.png';
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
      <div >
       <div
  className="max-w-[450px] max-mobile:max-w-[calc(100%-40px)] mx-auto bg-white rounded-2xl overflow-hidden relative
  before:content-[''] before:absolute before:left-1/2 before:-translate-x-1/2
  before:-top-[10px] before:w-[80%] before:h-[20px]
  before:rounded-[442px] before:bg-[#a8dd15] before:blur-[56.8px]"
>
          <div className="pt-16">
            <img src={AuthLineImage} alt="AuthLineImage" className="w-full h-full object-cover object-center" />
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-black100 text-center mb-2">
              {metadata.title}
            </h2>
            <p className="text-base mb-5 text-black700 max-w-[390px] mx-auto text-center">
              {metadata.description}
            </p>
            <Suspense fallback={<LoaderIcon className="animate-spin mx-auto" />}>
              <Login />
            </Suspense>
          </div>
        </div>
        <div>

        </div>
      </div>
    </>
  )
}
