import { HashIcon } from "lucide-react"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { cache, Suspense } from "react"
import Image from "next/image"
import { Badge } from "~/components/common/badge"
import { Button } from "~/components/common/button"
import { Card, CardHeader } from "~/components/common/card"
import { H2, H5 } from "~/components/common/heading"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { AdCard, AdCardSkeleton } from "~/components/web/ads/ad-card"
import { Markdown } from "~/components/web/markdown"
import { Nav } from "~/components/web/nav"
import { StructuredData } from "~/components/web/structured-data"
import { Backdrop } from "~/components/web/ui/backdrop"
import { Favicon } from "~/components/web/ui/favicon"
import { IntroDescription } from "~/components/web/ui/intro"
import { BrokerBookmarkButton } from "~/components/web/brokers/broker-bookmark-button"
import { BrokerClaimButton } from "~/components/web/brokers/broker-claim-button"
import { BrokerScreenshot } from "~/components/web/brokers/broker-screenshot"
import { ProductListSkeleton } from "~/components/web/products/product-list"
import { PlanQuery } from "~/components/web/plans/plan-query"
import { Section } from "~/components/web/ui/section"
import { Sticky } from "~/components/web/ui/sticky"
import type { OpenGraphParams } from "~/lib/opengraph"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { generateCollectionPage } from "~/lib/structured-data"
import { findBrokerBySlug } from "~/server/web/tools/queries"
import { getPresignedUrlFromFull, getScreenshotFetchUrl } from "~/lib/media"

type Props = {
  params: {
    slug: string
  }
}

// type Props = PageProps<"/brokers/[slug]">

// Get page data
const getData = cache(async ({ params }: Props) => {
  const { slug } = await params

  if (!slug) {
    notFound()
  }

  const broker = await findBrokerBySlug(slug)

  if (!broker) {
    notFound()
  }

  const t = await getTranslations()
  const url = `/brokers/${broker.slug}`
  const title = broker.seo_title || `${broker.broker_name || "Unknown Broker"} Review`
  const description = broker.seo_meta_description || broker.subtitle || broker.description || broker.pros || ""
  const data = getPageData(url, title, description, {
    breadcrumbs: [
      { url: "/", title: t("navigation.tools") },
      { url, title: broker.broker_name || "Broker" },
    ],
    structuredData: [generateCollectionPage(url, title, description)],
  })

  const screenshotUrl = await getPresignedUrlFromFull(broker.screenshotUrl)

  return { broker: { ...broker, screenshotUrl }, ...data }
})


export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const { broker, url, metadata } = await getData(props)

  const ogImage: OpenGraphParams = {
    title: String(broker.broker_name),
    description: String(broker.description),
  }

  return getPageMetadata({
    url,
    title: metadata.title,
    description: metadata.description,
    metadata: {
      ...metadata,
      title: broker.seo_title || metadata.title,
      description: broker.seo_meta_description || metadata.description,
    }
  })
}

export default async function (props: Props) {
  const { broker, metadata, structuredData } = await getData(props)
  const headerList = await headers()

  return (
    <>
      <Section>
        <Section.Content className="max-md:contents">
          <Sticky isOverlay>
            <Stack className="@container self-stretch justify-between items-start md:items-center gap-y-4 flex-col md:flex-row">
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <div className="flex items-center gap-4">
                  {(() => {
                    let domain = "forex.com";
                    const targetUrl = broker.broker_website || broker.url;
                    try {
                      if (targetUrl) {
                        const urlObj = new URL(targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`);
                        domain = urlObj.hostname;
                      }
                    } catch (e) { }

                    return (
                      <Favicon
                        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
                        title={broker.broker_name || "Broker"}
                        contained
                        className="size-10 rounded-xl shadow-sm border border-border/40"
                      />
                    );
                  })()}
                  <div className="flex flex-col">
                    <H2 as="h1" className="leading-tight! md:whitespace-normal line-clamp-2">
                      {broker.broker_name}
                    </H2>
                    {broker.subtitle && (
                      <p className="text-muted-foreground text-sm font-medium line-clamp-1 italic">
                        {broker.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {broker.overall_rating && (
                  <div className="flex items-center gap-2">
                    <Badge variant="primary" size="lg" className="w-fit text-white">
                      Rating: {broker.overall_rating} / 5
                    </Badge>
                    {broker.beginner_friendly && (
                      <Badge variant="success" size="lg" className="w-fit">
                        Beginner Friendly
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center flex-wrap gap-2 z-10 w-full md:w-auto justify-start md:justify-end">
                <BrokerBookmarkButton brokerId={broker.id} showLabel variant="secondary" size="md" />
                <BrokerClaimButton broker={broker}>
                  <Suspense fallback={<ProductListSkeleton />}>
                    <PlanQuery
                      checkoutData={{
                        successUrl: `${headerList.get("origin")}/brokers/${broker.slug}?claimed=true`,
                        cancelUrl: headerList.get("referer") || "",
                        metadata: {
                          brokerId: String(broker.id),
                          type: "claim",
                        },
                      }}
                    />
                  </Suspense>
                </BrokerClaimButton>
                {(broker.broker_website || broker.url) && (
                  <Button asChild variant="fancy" size="md">
                    <a href={broker.broker_website || broker.url || "#"} target="_blank" rel="noopener noreferrer nofollow">
                      Visit Broker
                    </a>
                  </Button>
                )}
              </div>
              <Backdrop />
            </Stack>
          </Sticky>

          {broker.description && (
            <IntroDescription className="-mt-fluid-md pt-4 italic border-l-4 border-primary pl-4">
              <Markdown code={broker.description} />
            </IntroDescription>
          )}

          {(broker.broker_website || broker.url) && (
            <div className="mt-8 rounded-xl overflow-hidden border border-border/50 shadow-sm aspect-video relative max-w-4xl mx-auto bg-muted">
              <BrokerScreenshot
                src={broker.screenshotUrl || getScreenshotFetchUrl((broker.broker_website || broker.url || "").startsWith('http') ? (broker.broker_website || broker.url || "") : `https://${broker.broker_website || broker.url}`)}
                alt={`${broker.broker_name} Website Screenshot`}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Broker Details */}
            {(broker.headquarters || broker.year_established || broker.minimum_deposit || broker.execution_types || broker.regulators) && (
              <Card className="p-0 overflow-hidden shadow-sm h-full">
                <CardHeader className="bg-muted/30 py-4 px-6 border-b">
                  <H5 as="h3" className="mb-0">Broker Details</H5>
                </CardHeader>
                <dl className="divide-y border-border/10 dark:border-border/50 text-sm">
                  {broker.headquarters && (
                    <div className="flex justify-between items-start px-6 py-4 gap-4">
                      <dt className="text-muted-foreground font-medium shrink-0">Headquarters</dt>
                      <dd className="font-semibold text-right">{broker.headquarters}</dd>
                    </div>
                  )}
                  {broker.year_established && (
                    <div className="flex justify-between items-start px-6 py-4 gap-4">
                      <dt className="text-muted-foreground font-medium shrink-0">Established</dt>
                      <dd className="font-semibold text-right">{broker.year_established}</dd>
                    </div>
                  )}
                  {broker.minimum_deposit && (
                    <div className="flex justify-between items-start px-6 py-4 gap-4">
                      <dt className="text-muted-foreground font-medium shrink-0">Min Deposit</dt>
                      <dd className="font-semibold text-right">{broker.minimum_deposit}</dd>
                    </div>
                  )}
                  {broker.execution_types && (
                    <div className="flex justify-between items-start px-6 py-4 gap-4">
                      <dt className="text-muted-foreground font-medium shrink-0">Execution</dt>
                      <dd className="font-semibold text-right">{broker.execution_types}</dd>
                    </div>
                  )}
                  {broker.regulators && (
                    <div className="flex justify-between items-start px-6 py-4 gap-4">
                      <dt className="text-muted-foreground font-medium min-w-24 shrink-0">Regulators</dt>
                      <dd className="font-semibold text-right max-w-xs">{broker.regulators}</dd>
                    </div>
                  )}
                </dl>
              </Card>
            )}

            {/* Trading Conditions */}
            {(broker.daily_loss_limit || broker.retail_loss_rate || broker.trading_hours || broker.minimum_raw_spreads || broker.minimum_standard_spreads || broker.minimum_commission_for_forex || broker.profit_share) && (
              <Card className="p-0 overflow-hidden shadow-sm h-full">
                <CardHeader className="bg-muted/30 py-4 px-6 border-b">
                  <H5 as="h3" className="mb-0">Trading Conditions</H5>
                </CardHeader>
                <dl className="divide-y border-border/10 dark:border-border/50 text-sm">
                  {broker.retail_loss_rate && (
                    <div className="flex justify-between items-start px-6 py-4 gap-4">
                      <dt className="text-muted-foreground font-medium shrink-0">Retail Loss Rate</dt>
                      <dd className="font-semibold text-right">{broker.retail_loss_rate}</dd>
                    </div>
                  )}
                  {broker.daily_loss_limit && (
                    <div className="flex justify-between items-start px-6 py-4 gap-4">
                      <dt className="text-muted-foreground font-medium shrink-0">Daily Loss Limit</dt>
                      <dd className="font-semibold text-right">{broker.daily_loss_limit}</dd>
                    </div>
                  )}
                  {broker.minimum_raw_spreads && (
                    <div className="flex justify-between items-start px-6 py-4 gap-4">
                      <dt className="text-muted-foreground font-medium shrink-0">Min Raw Spreads</dt>
                      <dd className="font-semibold text-right">{broker.minimum_raw_spreads}</dd>
                    </div>
                  )}
                  {broker.minimum_standard_spreads && (
                    <div className="flex justify-between items-start px-6 py-4 gap-4">
                      <dt className="text-muted-foreground font-medium shrink-0">Min Standard Spreads</dt>
                      <dd className="font-semibold text-right">{broker.minimum_standard_spreads}</dd>
                    </div>
                  )}
                  {broker.minimum_commission_for_forex && (
                    <div className="flex justify-between items-start px-6 py-4 gap-4">
                      <dt className="text-muted-foreground font-medium shrink-0">Min Forex Commission</dt>
                      <dd className="font-semibold text-right">{broker.minimum_commission_for_forex}</dd>
                    </div>
                  )}
                  {broker.profit_share && (
                    <div className="flex justify-between items-start px-6 py-4 gap-4">
                      <dt className="text-muted-foreground font-medium shrink-0">Profit Share</dt>
                      <dd className="font-semibold text-right">{broker.profit_share}</dd>
                    </div>
                  )}
                  {broker.trading_hours && (
                    <div className="flex flex-col px-6 py-4 gap-3">
                      <dt className="text-muted-foreground font-medium shrink-0">Trading Hours</dt>
                      <dd className="font-semibold text-left max-w-full">
                        {(() => {
                          try {
                            const parsed = JSON.parse(broker.trading_hours as string);
                            if (Array.isArray(parsed)) {
                              return (
                                <div className="flex flex-col w-full bg-muted/30 rounded-md p-3 gap-1">
                                  {parsed.map((item: any, i: number) => {
                                    const keys = Object.keys(item);
                                    if (keys.length < 2) return null;
                                    const label = String(item[keys[0]] || "").replace(/_/g, " ");
                                    const valKeys = keys.slice(1);
                                    const value = valKeys.map(k => String(item[k])).join(" - ");
                                    return (
                                      <div key={i} className="flex justify-between items-start gap-4 py-1.5 border-b border-border/30 last:border-0 text-sm font-normal text-left">
                                        <span className="text-muted-foreground shrink-0">{label}</span>
                                        <span className="font-medium text-right text-foreground">{value}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            }
                          } catch (e) {
                            // Not JSON, continue to fallback
                          }
                          return broker.trading_hours;
                        })()}
                      </dd>
                    </div>
                  )}
                </dl>
              </Card>
            )}

            {/* Accounts & Funding */}
            {(broker.deposit_options || broker.withdrawal_options || broker.funding_methods || broker.funded_account_options || broker.deposit_fees || broker.withdrawal_fee) && (
              <Card className="p-0 overflow-hidden shadow-sm h-full">
                <CardHeader className="bg-muted/30 py-4 px-6 border-b">
                  <H5 as="h3" className="mb-0">Accounts & Funding</H5>
                </CardHeader>
                <dl className="divide-y border-border/10 dark:border-border/50 text-sm">
                  {broker.funded_account_options && (
                    <div className="flex justify-between items-start px-6 py-4 gap-4">
                      <dt className="text-muted-foreground font-medium shrink-0">Funded Accounts</dt>
                      <dd className="font-semibold text-right">{broker.funded_account_options}</dd>
                    </div>
                  )}
                  {broker.funding_methods && (
                    <div className="flex justify-between items-start px-6 py-4 gap-4">
                      <dt className="text-muted-foreground font-medium mt-0.5 shrink-0">Funding Methods</dt>
                      <dd className="flex flex-wrap justify-end gap-1.5 max-w-[75%]">
                        {broker.funding_methods.split(/[,;]+/).map((item, i) => {
                          if (!item.trim()) return null;
                          return <Badge key={i} variant="outline" className="font-normal text-xs px-2 py-0 border-border/50 whitespace-normal text-right">{item.trim()}</Badge>
                        })}
                      </dd>
                    </div>
                  )}
                  {broker.deposit_options && (
                    <div className="flex justify-between items-start px-6 py-4 gap-4">
                      <dt className="text-muted-foreground font-medium min-w-24 mt-0.5 shrink-0">Deposit Options</dt>
                      <dd className="flex flex-wrap justify-end gap-1.5 max-w-[75%]">
                        {broker.deposit_options.split(/[,;]+/).map((item, i) => {
                          if (!item.trim()) return null;
                          return <Badge key={i} variant="outline" className="font-normal text-xs px-2 py-0 whitespace-normal text-right">{item.trim()}</Badge>
                        })}
                      </dd>
                    </div>
                  )}
                  {broker.deposit_fees && (
                    <div className="flex justify-between items-start px-6 py-4 gap-4">
                      <dt className="text-muted-foreground font-medium shrink-0">Deposit Fees</dt>
                      <dd className="font-semibold text-right">{broker.deposit_fees}</dd>
                    </div>
                  )}
                  {broker.withdrawal_options && (
                    <div className="flex justify-between items-start px-6 py-4 gap-4">
                      <dt className="text-muted-foreground font-medium min-w-24 mt-0.5 shrink-0">Withdrawal Options</dt>
                      <dd className="flex flex-wrap justify-end gap-1.5 max-w-[75%]">
                        {broker.withdrawal_options.split(/[,;]+/).map((item, i) => {
                          if (!item.trim()) return null;
                          return <Badge key={i} variant="primary" className="font-normal text-xs px-2 py-0 whitespace-normal text-right">{item.trim()}</Badge>
                        })}
                      </dd>
                    </div>
                  )}
                  {broker.withdrawal_fee && (
                    <div className="flex justify-between items-start px-6 py-4 gap-4">
                      <dt className="text-muted-foreground font-medium shrink-0">Withdrawal Fee</dt>
                      <dd className="font-semibold text-right">{broker.withdrawal_fee}</dd>
                    </div>
                  )}
                </dl>
              </Card>
            )}

            {/* Trading Costs */}
            {(broker.average_trading_cost_eur_usd || broker.average_trading_cost_gbp_usd || broker.average_trading_cost_gold || broker.average_trading_cost_bitcoin || broker.average_trading_cost_wti_crude_oil || broker.inactivity_fee || broker.maximum_evaluation_fee) && (
              <Card className="p-0 overflow-hidden shadow-sm h-full">
                <CardHeader className="bg-muted/30 py-4 px-6 border-b">
                  <H5 as="h3" className="mb-0">Trading Costs & Spreads</H5>
                </CardHeader>
                <dl className="divide-y border-border/10 dark:border-border/50 text-sm">
                  {broker.average_trading_cost_eur_usd && (
                    <div className="flex justify-between items-start px-6 py-4 gap-4">
                      <dt className="text-muted-foreground font-medium shrink-0">EUR/USD</dt>
                      <dd className="font-semibold text-right">{broker.average_trading_cost_eur_usd}</dd>
                    </div>
                  )}
                  {broker.average_trading_cost_gbp_usd && (
                    <div className="flex justify-between items-start px-6 py-4 gap-4">
                      <dt className="text-muted-foreground font-medium shrink-0">GBP/USD</dt>
                      <dd className="font-semibold text-right">{broker.average_trading_cost_gbp_usd}</dd>
                    </div>
                  )}
                  {broker.average_trading_cost_gold && (
                    <div className="flex justify-between items-start px-6 py-4 gap-4">
                      <dt className="text-muted-foreground font-medium shrink-0">Gold</dt>
                      <dd className="font-semibold text-right">{broker.average_trading_cost_gold}</dd>
                    </div>
                  )}
                  {broker.average_trading_cost_bitcoin && (
                    <div className="flex justify-between items-start px-6 py-4 gap-4">
                      <dt className="text-muted-foreground font-medium shrink-0">Bitcoin</dt>
                      <dd className="font-semibold text-right">{broker.average_trading_cost_bitcoin}</dd>
                    </div>
                  )}
                  {broker.average_trading_cost_wti_crude_oil && (
                    <div className="flex justify-between items-start px-6 py-4 gap-4">
                      <dt className="text-muted-foreground font-medium min-w-24 shrink-0">WTI Crude</dt>
                      <dd className="font-semibold text-right max-w-xs">{broker.average_trading_cost_wti_crude_oil}</dd>
                    </div>
                  )}
                  {broker.inactivity_fee && (
                    <div className="flex justify-between items-start px-6 py-4 gap-4">
                      <dt className="text-muted-foreground font-medium shrink-0">Inactivity Fee</dt>
                      <dd className="font-semibold text-right">{broker.inactivity_fee}</dd>
                    </div>
                  )}
                  {broker.maximum_evaluation_fee && (
                    <div className="flex justify-between items-start px-6 py-4 gap-4">
                      <dt className="text-muted-foreground font-medium shrink-0">Max Evaluation Fee</dt>
                      <dd className="font-semibold text-right">{broker.maximum_evaluation_fee}</dd>
                    </div>
                  )}
                </dl>
              </Card>
            )}

            {/* Platform & Features */}
            {(broker.trading_platforms || broker.trader_table || broker.regulators_table) && (
              <Card className="p-0 overflow-hidden shadow-sm h-full md:col-span-2">
                <CardHeader className="bg-muted/30 py-4 px-6 border-b">
                  <H5 as="h3" className="mb-0">Platform & Features</H5>
                </CardHeader>
                <div className="p-6">
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    {broker.trading_platforms && (
                      <div className="flex flex-col space-y-1 border-b md:border-b-0 border-border/50 pb-3 md:pb-0">
                        <dt className="text-muted-foreground font-medium shrink-0">Trading Platforms</dt>
                        <dd className="font-semibold text-pretty">{broker.trading_platforms}</dd>
                      </div>
                    )}
                    {broker.trader_table && (
                      <div className="flex flex-col space-y-2 md:col-span-2 border-t border-border/50 pt-4">
                        <dt className="text-muted-foreground font-medium shrink-0">Trader Details</dt>
                        <dd className="font-semibold text-pretty mt-2">
                          {(() => {
                            try {
                              const parsed = JSON.parse(broker.trader_table as string)
                              if (Array.isArray(parsed) && parsed.length > 0) {
                                return (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {parsed.map((item: any, i: number) => {
                                      const keys = Object.keys(item)
                                      if (keys.length === 0) return null
                                      return (
                                        <div key={i} className="bg-muted/30 rounded-lg p-3 border border-border/50 flex flex-col gap-1.5 text-sm font-normal">
                                          {keys.map(k => (
                                            <div key={k} className="flex flex-col">
                                              <span className="text-xs text-muted-foreground capitalize">{k.replace(/_/g, ' ')}:</span>
                                              <span className="font-medium">{item[k]}</span>
                                            </div>
                                          ))}
                                        </div>
                                      )
                                    })}
                                  </div>
                                )
                              }
                            } catch (e) {
                              // not json
                            }
                            return broker.trader_table
                          })()}
                        </dd>
                      </div>
                    )}
                    {broker.regulators_table && (
                      <div className="flex flex-col space-y-2 md:col-span-2 border-t border-border/50 pt-4">
                        <dt className="text-muted-foreground font-medium shrink-0">Regulators Detailed</dt>
                        <dd className="font-semibold text-pretty mt-2">
                          {(() => {
                            try {
                              const parsed = JSON.parse(broker.regulators_table as string)
                              if (Array.isArray(parsed) && parsed.length > 0) {
                                return (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {parsed.map((item: any, i: number) => (
                                      <div key={i} className="bg-muted/30 rounded-lg p-3 border border-border/50 flex flex-col gap-1 text-sm font-normal">
                                        {(item.name || item.regulator) && <div className="font-semibold text-foreground">{item.name || item.regulator}</div>}
                                        {item.country && <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><span className="font-medium">Country:</span> {item.country}</div>}
                                        {item.license_number && <div className="text-xs text-muted-foreground flex items-center gap-1"><span className="font-medium">License:</span> {item.license_number}</div>}
                                      </div>
                                    ))}
                                  </div>
                                )
                              }
                            } catch (e) {
                              // not json
                            }
                            return broker.regulators_table
                          })()}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </Card>
            )}
          </div>

          {(broker.pros || broker.cons) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {broker.pros && (
                <Card className="p-0 overflow-hidden border-green-500/30 bg-green-500/5 h-full">
                  <CardHeader className="bg-green-500/10 py-4 px-6 border-b border-green-500/20">
                    <H5 as="h4" className="text-green-700 dark:text-green-400 mb-0 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                      Pros
                    </H5>
                  </CardHeader>
                  <div className="p-6">
                    <Markdown code={broker.pros.split("; ").map(p => `- ${p}`).join("\n")} className="text-sm prose-p:my-1 text-green-900/80 dark:text-green-200/80" />
                  </div>
                </Card>
              )}
              {broker.cons && (
                <Card className="p-0 overflow-hidden border-red-500/30 bg-red-500/5 h-full">
                  <CardHeader className="bg-red-500/10 py-4 px-6 border-b border-red-500/20">
                    <H5 as="h4" className="text-red-700 dark:text-red-400 mb-0 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                      Cons
                    </H5>
                  </CardHeader>
                  <div className="p-6">
                    <Markdown code={broker.cons.split("; ").map(c => `- ${c}`).join("\n")} className="text-sm prose-p:my-1 text-red-900/80 dark:text-red-200/80" />
                  </div>
                </Card>
              )}
            </div>
          )}

          {broker.review_article && (
            <Card className="mt-8 overflow-hidden shadow-sm">
              <CardHeader className="bg-muted/30 py-4 px-6 border-b">
                <H2 as="h3" className="mb-0 text-xl font-bold">Comprehensive Review</H2>
              </CardHeader>
              <div className="p-6 md:p-8 prose prose-slate dark:prose-invert max-w-none">
                <Markdown code={broker.review_article} />
              </div>
            </Card>
          )}

          <Stack className="w-full md:sticky md:bottom-2 md:z-10 mt-8">
            <div className="absolute -inset-x-1 -bottom-3 -top-8 -z-1 pointer-events-none bg-background mask-t-from-66% max-md:hidden" />
            <Nav className="mr-auto" title={metadata.title} />
          </Stack>
        </Section.Content>

        <Section.Sidebar className="max-md:contents">
          {/* Advertisement */}
          <Suspense fallback={<AdCardSkeleton className="max-md:order-3" />}>
            <AdCard type="ToolPage" className="max-md:order-3" />
          </Suspense>
        </Section.Sidebar>
      </Section>

      <StructuredData data={structuredData} />
    </>
  )
}
