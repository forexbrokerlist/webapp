import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import type { PropsWithChildren } from "react"
import { cache } from "react"
import { DashboardTabs } from "~/app/(web)/dashboard/tabs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"

// I18n page namespace
const namespace = "pages.dashboard"

// Get page data
const getData = cache(async () => {
  const t = await getTranslations()
  const url = "/dashboard"
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

export default async function ({ children }: PropsWithChildren) {
  const { metadata } = await getData()

  return (
    <>
      <div className="pt-[140px] pb-100 max-mobile:pb-16 max-mobile:pt-[120px]">
        <div className="max-w-[1640px] px-5 max-laptop:px-16 mx-auto relative max-tab:px-5 max-mobile:px-4">
          <Intro className="pb-10">
            <IntroTitle>{metadata.title}</IntroTitle>
            <IntroDescription>{metadata.description}</IntroDescription>
          </Intro>

          <div className="flex flex-col gap-4">
            <DashboardTabs />
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
