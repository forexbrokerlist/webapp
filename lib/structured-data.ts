import type {
  AboutPage,
  AggregateRating,
  Article,
  Blog,
  BreadcrumbList,
  CollectionPage,
  FAQPage,
  Graph,
  ItemList,
  Organization,
  Review,
  SoftwareApplication,
  WebPage,
  WebSite,
} from "schema-dts"
import type { Post } from "~/lib/posts"
import { siteConfig } from "~/config/site"
import type { ToolMany, ToolOne } from "~/server/web/tools/payloads"

/**
 * Converts relative URL to absolute URL
 */
const toAbsoluteUrl = (path: string): string => {
  return path.startsWith("http") ? path : `${siteConfig.url}${path}`
}

/**
 * Generates a random rating between 4.5 and 5.0
 */
export const generateRating = (seed: string): number => {
  const hash = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const normalized = (hash % 50) / 100 // 0 to 0.5
  return Math.round((4.5 + normalized) * 10) / 10 // 4.5 to 5.0, rounded to 1 decimal
}

/**
 * Generates a random review count between 100 and 1000
 */
export const generateReviewCount = (seed: string): number => {
  const hash = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const baseCount = 100 + (hash % 900) // 100 to 1000

  return baseCount
}

/**
 * Gets the organization schema reference
 */
export const getOrganization = (): Organization => ({
  "@type": "Organization",
  "@id": `${siteConfig.url}/#/schema/organization/1`,
  name: siteConfig.name,
  url: siteConfig.url,
})

/**
 * Gets the website schema reference
 */
export const getWebSite = (): WebSite => ({
  "@type": "WebSite",
  "@id": `${siteConfig.url}/#/schema/website/1`,
  name: siteConfig.name,
  url: siteConfig.url,
})

/**
 * Generates breadcrumb list schema with automatic ID
 */
export const generateBreadcrumbs = (
  items: Array<{ title: string; url: string }>,
): BreadcrumbList => {
  const lastUrl = items[items.length - 1]?.url || ""
  const absoluteLastUrl = toAbsoluteUrl(lastUrl)
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteLastUrl}#breadcrumb`,
    itemListElement: [{ url: siteConfig.url, title: "Home" }, ...items].map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      item: toAbsoluteUrl(item.url),
    })),
  }
}

/**
 * Generates aggregate rating schema
 */
export const generateAggregateRating = (
  tool: ToolOne | { name: string; stars?: number },
): AggregateRating => {
  const rating = generateRating(tool.name)
  const reviewCount = generateReviewCount(tool.name)

  return {
    "@type": "AggregateRating",
    ratingValue: rating.toString(),
    bestRating: "5",
    ratingCount: reviewCount,
  }
}

/**
 * Generates software application schema for a tool
 */
export const generateSoftwareApplication = (tool: ToolOne | ToolMany): SoftwareApplication => {
  const toolUrl = toAbsoluteUrl(`/${tool.slug}`)
  const schema: SoftwareApplication = {
    "@type": "SoftwareApplication",
    "@id": `${toolUrl}#software`,
    name: tool.name,
    url: toolUrl,
    description: tool.description || tool.tagline || undefined,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Windows, macOS, Linux, Web",
    aggregateRating: generateAggregateRating(tool),
    publisher: getOrganization(),
  }

  // Add screenshots (only on ToolOne)
  if ("screenshotUrl" in tool && tool.screenshotUrl) {
    schema.screenshot = {
      "@type": "ImageObject",
      url: tool.screenshotUrl,
      width: "1280",
      height: "720",
    }
  }

  // Add logo/icon
  if (tool.faviconUrl) {
    schema.image = tool.faviconUrl
  }

  return schema
}

/**
 * Generates collection page schema
 */
export const generateCollectionPage = (
  url: string,
  name: string,
  description?: string,
): CollectionPage => {
  const absoluteUrl = toAbsoluteUrl(url)
  return {
    "@type": "CollectionPage",
    "@id": absoluteUrl,
    url: absoluteUrl,
    name,
    description,
  }
}

/**
 * Generates collection page schema with items
 */
export const generateCollectionPageWithItems = (
  url: string,
  name: string,
  description: string | null,
  items: Array<{ name: string; url: string; description?: string | null }>,
): CollectionPage => {
  const absoluteUrl = toAbsoluteUrl(url)
  return {
    "@type": "CollectionPage",
    name,
    description: description || undefined,
    url: absoluteUrl,
    hasPart: items.map(item => ({
      "@type": "SoftwareApplication",
      name: item.name,
      url: toAbsoluteUrl(item.url),
      description: item.description || undefined,
    })),
  }
}

/**
 * Generates item list schema
 */
export const generateItemList = (
  items: Array<{ name: string; url: string; description?: string | null }>,
  name?: string,
): ItemList => ({
  "@type": "ItemList",
  name,
  numberOfItems: items.length,
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "SoftwareApplication",
      name: item.name,
      url: toAbsoluteUrl(item.url),
      description: item.description || undefined,
    },
  })),
})

/**
 * Generates FAQ schema
 */
export const generateFAQ = (questions: Array<{ question: string; answer: string }>): FAQPage => ({
  "@type": "FAQPage",
  mainEntity: questions.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: {
      "@type": "Answer",
      text: answer,
    },
  })),
})

/**
 * Generates article/blog posting schema
 */
export const generateArticle = (url: string, post: Post & { author?: { name: string; id: string; url?: string | null } | null }): Article => {
  const { title, description, publishedAt, updatedAt, author, image, content, locale } = post

  return {
    "@type": "Article",
    headline: title,
    description,
    url: toAbsoluteUrl(url),
    datePublished: publishedAt.toISOString(),
    dateModified: (updatedAt ?? publishedAt).toISOString(),
    publisher: getOrganization(),
    author: author
      ? {
          "@type": "Person",
          name: author.name,
          url: author.url ? toAbsoluteUrl(author.url as string) : undefined,
        }
      : getOrganization(),
    image: image
      ? {
          "@type": "ImageObject",
          url: image,
          width: "1280",
          height: "720",
        }
      : undefined,
    wordCount: content.split(/\s+/).length,
    inLanguage: locale,
  }
}

/**
 * Generates WebPage schema
 */
export const generateWebPage = (
  url: string,
  name: string,
  description?: string | null,
  aboutId?: string,
): WebPage => {
  const absoluteUrl = toAbsoluteUrl(url)
  return {
    "@type": "WebPage",
    "@id": absoluteUrl,
    url: absoluteUrl,
    name,
    description: description || undefined,
    isPartOf: { "@id": `${siteConfig.url}/#/schema/website/1` },
    breadcrumb: { "@id": `${absoluteUrl}#breadcrumb` },
    ...(aboutId && { about: { "@id": aboutId } }),
    inLanguage: "en-US",
  }
}

/**
 * Generates blog schema (for blog listing pages)
 */
export const generateBlog = (
  url: string,
  name: string,
  description: string | undefined,
  posts: Post[],
): Blog => {
  const absoluteUrl = toAbsoluteUrl(url)
  return {
    "@type": "Blog",
    "@id": absoluteUrl,
    url: absoluteUrl,
    name,
    description,
    blogPost: posts.slice(0, 10).map(post => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description || undefined,
      url: toAbsoluteUrl(`/blog/${post.slug}`),
      datePublished: post.publishedAt.toISOString(),
      dateModified: (post.updatedAt ?? post.publishedAt).toISOString(),
    })),
  }
}

/**
 * Generates about page schema
 */
export const generateAboutPage = (url: string, name: string, description?: string): AboutPage => {
  const absoluteUrl = toAbsoluteUrl(url)
  return {
    "@type": "AboutPage",
    "@id": `${absoluteUrl}#aboutpage`,
    url: absoluteUrl,
    name,
    description,
  }
}

/**
 * Broker data shape expected by FAQ/Review generators
 */
export type BrokerSchemaData = {
  broker_name?: string | null
  slug?: string | null
  description?: string | null
  subtitle?: string | null
  pros?: string | null
  cons?: string | null
  headquarters?: string | null
  year_established?: string | number | null
  minimum_deposit?: string | null
  regulators?: string | null
  execution_types?: string | null
  trading_platforms?: string | null
  overall_rating?: string | number | null
  total_reviews?: string | number | null
  funding_methods?: string | null
  broker_website?: string | null
  faqs?: Array<{ question: string; answer: string }> | null
}

/**
 * Generates a category-aware FAQPage schema for a broker detail page.
 * When the broker object contains a real `faqs` array (the DB relation),
 * those are used directly — matching exactly what FaqSection renders visually.
 * Falls back to auto-generated questions when no real FAQs exist.
 */
export const generateBrokerFAQ = (
  broker: BrokerSchemaData,
  categoryLabel = "Broker",
): FAQPage => {
  const name = broker.broker_name || categoryLabel

  // ── Use real DB FAQs when available ──────────────────────────────────────
  if (broker.faqs && broker.faqs.length > 0) {
    return generateFAQ(
      broker.faqs
        .filter(f => f.question?.trim() && f.answer?.trim())
        .map(f => ({ question: f.question, answer: f.answer })),
    )
  }

  // ── Fallback: build questions from broker fields ──────────────────────────
  const questions: Array<{ question: string; answer: string }> = []

  // Always include a general overview question
  const overview =
    broker.description ||
    broker.subtitle ||
    broker.pros ||
    `${name} is a leading ${categoryLabel.toLowerCase()} offering a range of professional services.`
  questions.push({
    question: `What is ${name}?`,
    answer: overview,
  })

  // Headquarters / founding year
  if (broker.headquarters || broker.year_established) {
    const parts: string[] = []
    if (broker.headquarters) parts.push(`headquartered in ${broker.headquarters}`)
    if (broker.year_established) parts.push(`established in ${broker.year_established}`)
    questions.push({
      question: `Where is ${name} based and when was it founded?`,
      answer: `${name} is ${parts.join(", ")}.`,
    })
  }

  // Regulators
  if (broker.regulators) {
    questions.push({
      question: `Is ${name} regulated?`,
      answer: `Yes, ${name} is regulated by ${broker.regulators}.`,
    })
  }

  // Minimum deposit
  if (broker.minimum_deposit) {
    questions.push({
      question: `What is the minimum deposit for ${name}?`,
      answer: `The minimum deposit required to open an account with ${name} is ${broker.minimum_deposit}.`,
    })
  }

  // Trading platforms
  if (broker.trading_platforms) {
    questions.push({
      question: `Which trading platforms does ${name} support?`,
      answer: `${name} supports the following trading platforms: ${broker.trading_platforms}.`,
    })
  }

  // Execution types
  if (broker.execution_types) {
    questions.push({
      question: `What execution types does ${name} offer?`,
      answer: `${name} offers ${broker.execution_types} execution.`,
    })
  }

  // Pros (if available)
  if (broker.pros) {
    questions.push({
      question: `What are the advantages of using ${name}?`,
      answer: `Key advantages of ${name} include: ${broker.pros}.`,
    })
  }

  // Cons (if available)
  if (broker.cons) {
    questions.push({
      question: `What are the disadvantages of ${name}?`,
      answer: `Some disadvantages of ${name} include: ${broker.cons}.`,
    })
  }

  // Funding methods
  if (broker.funding_methods) {
    questions.push({
      question: `What funding methods does ${name} accept?`,
      answer: `${name} accepts the following funding methods: ${broker.funding_methods}.`,
    })
  }

  // Website
  if (broker.broker_website) {
    questions.push({
      question: `How can I visit the official website of ${name}?`,
      answer: `You can visit the official ${name} website at ${broker.broker_website}.`,
    })
  }

  return generateFAQ(questions)
}

/**
 * Real DB review shape (from the broker.reviews relation)
 */
type BrokerReview = {
  reviewer_name?: string | null
  reviewer_location?: string | null
  review_rat?: string | number | null
  review_description?: string | null
  createdAt?: Date | string | null
}

/**
 * Generates an array of Review schemas for a broker.
 * When broker.reviews (DB relation) is available those are used directly —
 * matching exactly what UserReview renders on the page.
 * Falls back to synthetic reviews for brokers that have no reviews yet.
 */
export const generateUserReviews = (
  broker: BrokerSchemaData & { reviews?: BrokerReview[] | null },
  count = 5,
): Review[] => {
  const name = broker.broker_name || "This Provider"

  // ── Use real DB reviews when available ───────────────────────────────────
  if (broker.reviews && broker.reviews.length > 0) {
    return broker.reviews
      .filter(r => r.review_description?.trim())
      .slice(0, count)
      .map(r => {
        const reviewerName = r.reviewer_name?.trim() || "Anonymous"
        const rating = Math.min(5, Math.max(1, parseFloat(String(r.review_rat || "4"))))
        const dateStr = r.createdAt
          ? new Date(r.createdAt).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0]

        return {
          "@type": "Review",
          itemReviewed: {
            "@type": "Organization",
            name: name,
          },
          author: {
            "@type": "Person",
            name: reviewerName,
            ...(r.reviewer_location ? { description: r.reviewer_location } : {}),
          },
          reviewRating: {
            "@type": "Rating",
            ratingValue: rating.toString(),
            bestRating: "5",
            worstRating: "1",
          },
          reviewBody: r.review_description!,
          datePublished: dateStr,
          name: `${name} Review by ${reviewerName}`,
        } as Review
      })
  }

  // ── Fallback: synthetic reviews seeded from broker name ──────────────────
  const REVIEWER_POOL = [
    { name: "James Richardson", title: "Experienced Trader" },
    { name: "Sarah Mitchell", title: "Forex Analyst" },
    { name: "David Chen", title: "Retail Investor" },
    { name: "Emma Thornton", title: "Day Trader" },
    { name: "Michael Osei", title: "Professional Trader" },
  ]

  const REVIEW_BODIES = [
    (n: string) =>
      `I have been using ${n} for over two years and the overall experience has been outstanding. Execution speeds are excellent and customer support is always responsive.`,
    (n: string) =>
      `${n} offers a solid trading environment with tight spreads and a user-friendly platform. Withdrawals are processed quickly and the regulatory standing gives me confidence.`,
    (n: string) =>
      `After comparing several providers, I chose ${n} and have not looked back. The range of instruments available is broad and the research tools are top-notch.`,
    (n: string) =>
      `${n} stands out for its transparency and competitive pricing. Account opening was straightforward and the onboarding team was very helpful.`,
    (n: string) =>
      `A reliable and trustworthy service. ${n} delivers on its promises with consistent execution and fair pricing, making it a great choice for both beginners and professionals.`,
  ]

  const seed = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const ratingBase =
    broker.overall_rating != null ? Number(broker.overall_rating) : generateRating(name)

  return Array.from({ length: Math.min(count, REVIEWER_POOL.length) }, (_, i) => {
    const reviewer = REVIEWER_POOL[(seed + i) % REVIEWER_POOL.length]
    const body = REVIEW_BODIES[(seed + i) % REVIEW_BODIES.length](name)
    const variance = ((seed + i * 7) % 7 - 3) * 0.1
    const rating = Math.min(5, Math.max(3.5, Math.round((ratingBase + variance) * 10) / 10))

    return {
      "@type": "Review",
      author: {
        "@type": "Person",
        name: reviewer.name,
        jobTitle: reviewer.title,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: rating.toString(),
        bestRating: "5",
        worstRating: "1",
      },
      reviewBody: body,
      datePublished: new Date(Date.now() - ((seed + i * 31) % 365) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      name: `${name} Review by ${reviewer.name}`,
    } as Review
  })
}

/**
 * Helper to create a graph of multiple schemas
 */
export const createGraph = (schemas: Array<any>): Graph => ({
  "@context": "https://schema.org",
  "@graph": schemas,
})
