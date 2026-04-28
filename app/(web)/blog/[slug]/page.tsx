import { getReadTime } from "@primoui/utils"
import type { Metadata } from "next"
import { getFormatter, getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import { cache, Suspense } from "react"
import { marked } from "marked"
import { Stack } from "~/components/common/stack"
import { AdCard, AdCardSkeleton } from "~/components/web/ads/ad-card"
import { Markdown } from "~/components/web/markdown"
import { Nav } from "~/components/web/nav"
import { StructuredData } from "~/components/web/structured-data"
import { TableOfContents } from "~/components/web/table-of-contents"
import { Author } from "~/components/web/ui/author"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Favicon } from "~/components/web/ui/favicon"
import { PresignedImage } from "~/components/common/presigned-image"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { Section } from "~/components/web/ui/section"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/common/accordion"
import { blogConfig } from "~/config/blog"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { generateArticle } from "~/lib/structured-data"
import { extractHeadingsFromMDX, extractToolsFromMDX } from "~/lib/mdx"
import { getPostBySlug } from "~/server/web/posts/queries"
import { findTools } from "~/server/web/tools/queries"

// Get page data
const getData = cache(async (slug: string) => {
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const t = await getTranslations()
  const url = `/blog/${slug}`

  const data = getPageData(url, post.title, post.description, {
    breadcrumbs: [
      { url: "/blog", title: t("navigation.blog") },
      { url, title: post.title },
    ],
    structuredData: [generateArticle(url, post as any)],
  })

  return { post, ...data }
})

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> => {
  const { slug } = await params
  const { post, url, metadata } = await getData(slug)

  const openGraph: Metadata["openGraph"] = {
    type: "article",
    publishedTime: post.publishedAt.toISOString(),
    modifiedTime: (post.updatedAt ?? post.publishedAt).toISOString(),
    authors: post.author?.name,
  }

  const mergedMetadata = { ...metadata, openGraph }
  return getPageMetadata({
    url,
    title: mergedMetadata.title,
    description: mergedMetadata.description,
    metadata: mergedMetadata
  })
}

export default async function ({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { post, breadcrumbs, structuredData } = await getData(slug)
  const t = await getTranslations()
  const format = await getFormatter()

  const headings = extractHeadingsFromMDX(post.content)
  const postTools = extractToolsFromMDX(post.content)

  // Find the tools and sort them by the order they appear in the post
  const tools = postTools.length
    ? await findTools({ where: { slug: { in: postTools } } }).then(tools =>
      tools.sort((a, b) => postTools.indexOf(a.slug) - postTools.indexOf(b.slug)),
    )
    : []

  return (
    <>
      {/* <Breadcrumbs items={breadcrumbs} /> */}

      <div className="pt-[140px] pb-100 max-mobile:pb-16 max-mobile:pt-[120px]">
        <div className="max-w-[1640px] px-5 max-laptop:px-16 mx-auto relative max-tab:px-5 max-mobile:px-4">
          <Intro className="pb-10">
            <IntroTitle>{post.title}</IntroTitle>
            <IntroDescription>{post.description}</IntroDescription>

            {post.author && (
              <Author
                prefix={t("posts.written_by")}
                note={
                  <>
                    <time dateTime={(post.updatedAt ?? post.publishedAt).toISOString()}>
                      {post.updatedAt && `${t("posts.last_updated")}: `}
                      {format.dateTime(post.updatedAt ?? post.publishedAt, { dateStyle: "long" })}
                    </time>
                    <span className="px-1.5">&bull;</span>
                    <span>{t("posts.read_time", { count: getReadTime(post.content) })}</span>
                  </>
                }
                className="mt-4"
                {...post.author}
              />
            )}
          </Intro>

          <Section className="w-full">
            <Section.Content>
              {post.image && (
                <PresignedImage
                  src={post.image}
                  alt={post.title}
                  width={1200}
                  height={630}
                  loading="eager"
                  className="w-full h-auto aspect-video object-cover rounded-lg"
                />
              )}

              <Markdown html={String(await marked(post.content))} />

              {post.faqs && post.faqs.length > 0 && (
                <div className="my-12 w-full">
                  <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
                  <Accordion type="single" collapsible className="space-y-4 max-w-7xl">
                    {post.faqs.map((faq) => (
                      <AccordionItem key={faq.id} value={`faq-${faq.id}`}>
                        <AccordionTrigger className="text-left w-full">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}
              <Nav title={post.title} className="self-start " />

            </Section.Content>

            <Section.Sidebar className="max-h-(--sidebar-max-height)">
              <Suspense fallback={<AdCardSkeleton />}>
                <AdCard type="BlogPost" />
              </Suspense>

              {blogConfig.tableOfContents.enabled && !!headings.length && (
                <TableOfContents headings={headings} />
              )}

              {blogConfig.toolsMentioned.enabled && !!tools.length && (
                <TableOfContents
                  title={t("posts.tools_mentioned")}
                  collapsible={false}
                  headings={[
                    ...tools.map(({ slug, name, faviconUrl }) => ({
                      id: slug,
                      level: 1,
                      text: (
                        <Stack size="sm" wrap={false}>
                          <Favicon src={faviconUrl} title={name} className="size-4" />
                          <span className="truncate">{name}</span>
                        </Stack>
                      ),
                    })),
                  ]}
                />
              )}
            </Section.Sidebar>
          </Section>


          <StructuredData data={structuredData} />
        </div>
      </div>
      <div className='w-full h-[1px] bg-[linear-gradient(90deg,#F0F1EC_0%,#A8DD15_50%,#F0F1EC_100%)]'></div>

    </>
  )
}
