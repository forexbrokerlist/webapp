import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { createLoader, parseAsString } from "nuqs/server"
import { cache } from "react"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { NavLink } from "~/components/web/ui/nav-link"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"
const EmailOutlineImage = '/assets/images/email-outline.png';
// I18n page namespace
const namespace = "pages.auth.verify"

// Get page data
const getData = cache(async () => {
  const t = await getTranslations()
  const url = "/auth/verify"
  const title = t(`${namespace}.title`)
  const description = t(`${namespace}.description`, { siteName: siteConfig.name })

  return getPageData(url, title, description, {
    breadcrumbs: [{ url, title }],
  })
})

export const generateMetadata = async (): Promise<Metadata> => {
  const { url, metadata } = await getData()
  return getPageMetadata({
    url,
    title: metadata.title,
    description: metadata.description,
    metadata
  })
}

export default async function ({ searchParams }: PageProps<"/auth/verify">) {
  const searchParamsLoader = createLoader({ email: parseAsString.withDefault("") })
  const { email } = await searchParamsLoader(searchParams)
  const { metadata } = await getData()
  const t = await getTranslations()

  return (
    <>
      <div className="max-w-[450px] max-mobile:max-w-[calc(100%-40px)] mx-auto bg-white rounded-2xl login-top overflow-hidden relative" >
        <div className="pt-16">
          <img src={EmailOutlineImage} alt="EmailOutlineImage" className="w-full h-full object-cover object-center" />
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-black100 text-center mb-2">
            {metadata.title}
          </h2>
          <p className="text-base mb-5 text-black700 max-w-[390px] mx-auto text-center">
            {t(`${namespace}.instructions`, { email })}
          </p>
          <p className="text-sm text-black100 text-center capitalize">
            {t.rich(`${namespace}.no_email`, {
              link: chunks => (
                <NavLink href="/auth/login" className="inline text-primary !hover:text-primary font-medium">
                  {chunks}
                </NavLink>
              ),
            })}
          </p>

        </div>
      </div>

    </>
  )
}
