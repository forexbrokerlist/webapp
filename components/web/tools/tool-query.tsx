import type { SearchParams } from "nuqs"
import type { AdType, Prisma } from "~/.generated/prisma/client"
import { AdCard } from "~/components/web/ads/ad-card"
import type { PaginationProps } from "~/components/web/pagination"
import { StructuredData } from "~/components/web/structured-data"
import { ToolList, type ToolListProps } from "~/components/web/tools/tool-list"
import { BrokerList, type BrokerListProps } from "~/components/web/tools/broker-list"
import { ToolListing, type ToolListingProps } from "~/components/web/tools/tool-listing"
import { adsConfig } from "~/config/ads"
import { createGraph, generateItemList } from "~/lib/structured-data"
import { searchBrokers } from "~/server/web/tools/queries"
import { type ToolFilterParams, toolFilterParamsCache } from "~/server/web/tools/schema"
import { ToolTier } from "~/.generated/prisma/client"

type ToolQueryProps = Omit<ToolListingProps, "list" | "pagination"> & {
  searchParams: Promise<SearchParams>
  overrideParams?: Partial<ToolFilterParams>
  where?: any
  list?: Partial<Omit<BrokerListProps, "brokers">>
  pagination?: Partial<Omit<PaginationProps, "total" | "pageSize">>
  ad?: AdType
  name?: string
}

const ToolQuery = async ({
  searchParams,
  overrideParams,
  where,
  list,
  pagination,
  ad,
  name,
  ...props
}: ToolQueryProps) => {
  const parsedParams = toolFilterParamsCache.parse(await searchParams)
  const params = { ...parsedParams, ...overrideParams }
  const { brokers, total, page, perPage } = await searchBrokers(params, where)

  // Map brokers to match the ToolMany structure expected by ToolList
  const mappedTools = brokers.map((broker) => ({
    id: broker.id.toString(),
    name: broker.broker_name || "Unknown Broker",
    slug: `brokers/${broker.id}`,
    websiteUrl: broker.url || "",
    affiliateUrl: null,
    faviconUrl: null, // Use default
    tagline: broker.pros || "",
    description: broker.description || broker.cons || "",
    tier: ToolTier.Free,
    status: "Published",
    publishedAt: broker.scraped_at || new Date(),
    updatedAt: broker.scraped_at || new Date(),
    ownerId: null,
    categories: [],
    tags: [],
  })) as any

  const items = mappedTools.map((tool: any) => ({
    name: tool.name,
    url: `/${tool.slug}`,
    description: tool.description,
  }))

  // Generate structured data for the tool list
  const structuredData = createGraph([generateItemList(items, name)])

  return (
    <ToolListing pagination={{ total, perPage, page, ...pagination }} {...props}>
      <StructuredData data={structuredData} />

      <BrokerList brokers={brokers} {...list}>
        {ad &&
           Array.from({ length: adsConfig.adsPerPage }, (_, index) => {
             const order = Math.ceil((perPage / adsConfig.adsPerPage) * index + 1)
             if (order > brokers.length) return null
             return <AdCard key={`ad-${index}`} type={ad} isRevealed style={{ order }} />
           })}
      </BrokerList>
    </ToolListing>
  )
}

export { ToolQuery, type ToolQueryProps }
