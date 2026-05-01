import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { cache } from "react"
import { SubmitForm } from "~/app/(web)/submit/form"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { Section } from "~/components/web/ui/section"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"
import seoData from "~/config/seo.json"

// I18n page namespace
const namespace = "pages.submit"

// Get page data
const getData = cache(async (planSlug?: string) => {
  const t = await getTranslations()
  const url = planSlug ? `/submit?plan=${planSlug}` : "/submit"
  const title = t(`${namespace}.title`)
  const description = t(`${namespace}.description`, { siteName: siteConfig.name })

  return getPageData(url, title, description, {
    breadcrumbs: [{ url, title }],
  })
})

export const generateMetadata = async ({ searchParams }: { searchParams: Promise<{ plan?: string, cancelled?: string }> }): Promise<Metadata> => {
  const { plan: planSlug } = await searchParams
  const { url, metadata } = await getData(planSlug)
  const mergedMetadata = { ...metadata, ...seoData.submit }
  return getPageMetadata({
    url,
    title: seoData.submit.title,
    description: seoData.submit.description,
    metadata: mergedMetadata
  })
}

import { findCategories } from "~/server/web/categories/queries"
import { findSubcategories } from "~/server/web/subcategories/queries"
import { findTags } from "~/server/web/tags/queries"
import { findPlanBySlug, findPlans } from "~/server/web/plans/queries"
import { getServerSession } from "~/lib/auth"
import { Hint } from "~/components/common/hint"
import TextBanner from "~/components/textBanner"

export default async function ({ searchParams }: { searchParams: Promise<{ plan?: string, cancelled?: string }> }) {
  const { plan: planSlug, cancelled } = await searchParams
  const session = await getServerSession()
  const { metadata } = await getData(planSlug)
  const categories = await findCategories({ all: true }) // Fetch all categories
  const subcategories = await findSubcategories()
  const tags = await findTags({ all: true })
  const plan = planSlug ? await findPlanBySlug(planSlug) : null
  const allPlans = await findPlans()

  return (
    <>
      <TextBanner
        title="Submit Your"
        highlightedText="Forex Broker"
        description="Listing your broker on forex brokers listing is a great way to get more we list high quality brokers that help traders succeed."
      />
      <div className="pt-10 pb-100 max-mobile:pb-16">
        <div className="max-w-[1280px] px-5 max-laptop:px-16 mx-auto relative max-tab:px-5 max-mobile:px-4">

          <>
            <>
              {!session?.user && (
                <Hint className="mb-6 p-4 bg-muted rounded-lg text-center font-medium">
                  You must be logged in to submit a broker.
                </Hint>
              )}
              <SubmitForm
                categories={categories}
                subcategories={subcategories}
                tags={tags}
                plan={plan}
                plans={allPlans}
                isCancelled={cancelled === "true"}
              />
            </>
          </>
        </div>
      </div>
      <div className='w-full h-[1px] bg-[linear-gradient(90deg,#F0F1EC_0%,#A8DD15_50%,#F0F1EC_100%)]'></div>

    </>
  )
}
