import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { cache } from "react"
import { SubmitForm } from "~/app/(web)/submit/form"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { Section } from "~/components/web/ui/section"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"

// I18n page namespace
const namespace = "pages.submit"

// Get page data
const getData = cache(async () => {
  const t = await getTranslations()
  const url = "/submit"
  const title = t(`${namespace}.title`)
  const description = t(`${namespace}.description`, { siteName: siteConfig.name })

  return getPageData(url, title, description, {
    breadcrumbs: [{ url, title }],
  })
})

export const generateMetadata = async (): Promise<Metadata> => {
  const { url, metadata } = await getData()
  return getPageMetadata({ url, metadata })
}

import { findCategories } from "~/server/web/categories/queries"
import { findSubcategories } from "~/server/web/subcategories/queries"
import { findTags } from "~/server/web/tags/queries"
import { getServerSession } from "~/lib/auth"
import { Hint } from "~/components/common/hint"

export default async function () {
  const session = await getServerSession()
  const { metadata } = await getData()
  const categories = await findCategories({ all: true }) // Fetch all categories
  const subcategories = await findSubcategories()
  const tags = await findTags({ all: true })

  return (
    <>
      <Intro>
        <IntroTitle>{metadata.title}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <Section>
        <Section.Content>
          {!session?.user && (
            <Hint className="mb-6 p-4 bg-muted rounded-lg text-center font-medium">
              You must be logged in to submit a broker.
            </Hint>
          )}
          <SubmitForm categories={categories} subcategories={subcategories} tags={tags} />
        </Section.Content>
      </Section>
    </>
  )
}
