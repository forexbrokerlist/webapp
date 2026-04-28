import seoData from "~/config/seo.json"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { cache } from "react"
import { PostList } from "~/components/web/posts/post-list"
import { StructuredData } from "~/components/web/structured-data"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { generateBlog } from "~/lib/structured-data"
import { getPosts } from "~/server/web/posts/queries"

// I18n page namespace
const namespace = "pages.blog"

export const dynamic = "force-dynamic"

// Get page data
const getData = cache(async () => {
  const posts = await getPosts()

  const t = await getTranslations()
  const url = "/blog"
  const title = t(`${namespace}.title`)
  const description = t(`${namespace}.description`, { siteName: siteConfig.name })

  const data = getPageData(url, title, description, {
    breadcrumbs: [{ url, title }],
    structuredData: [generateBlog(url, title, description, posts)],
  })

  return { posts, ...data }
})

export const generateMetadata = async (): Promise<Metadata> => {
  const { url, metadata } = await getData()
  const mergedMetadata = { ...metadata, ...seoData.blog }
  return getPageMetadata({
    url,
    title: mergedMetadata.title,
    description: mergedMetadata.description,
    metadata: mergedMetadata
  })
}

export default async function () {
  const { posts, metadata, breadcrumbs, structuredData } = await getData()

  return (
    <>
      {/* <Breadcrumbs items={breadcrumbs} /> */}

      <div className="pt-[140px] pb-100">
        <div className="max-w-[1640px] px-5 max-laptop:px-16 mx-auto relative max-tab:px-5 max-mobile:px-4">
          <Intro className="pb-10">
            <IntroTitle>{metadata.title}</IntroTitle>
            <IntroDescription>{metadata.description}</IntroDescription>
          </Intro>

          <PostList posts={posts} />

          <StructuredData data={structuredData} />
        </div>
      </div>
      <div className='w-full h-[1px] bg-[linear-gradient(90deg,#F0F1EC_0%,#A8DD15_50%,#F0F1EC_100%)]'></div>

    </>
  )
}
