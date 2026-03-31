import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import { cache } from "react"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { db } from "~/services/db"

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ order_id?: string }>
}

// I18n page namespace
const namespace = "pages.submit"

// Get page data
const getData = cache(async ({ params }: Props) => {
  const { slug } = await params

  const broker = await db.brokers.findFirst({
    where: { slug },
    select: { broker_name: true, slug: true },
  })

  if (!broker) {
    notFound()
  }

  const t = await getTranslations()
  const name = broker.broker_name || "Broker"
  const url = `/submit/${broker.slug}/success`
  const title = t(`${namespace}.success.title`, { name })
  const description = t(`${namespace}.success.description`, { name, siteName: siteConfig.name })

  const data = getPageData(url, title, description, {
    breadcrumbs: [{ url, title }],
  })

  return { broker, ...data }
})

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const { url, metadata } = await getData(props)
  return getPageMetadata({
    url,
    title: metadata.title,
    description: metadata.description,
    metadata
  })
}

import { CheckCircle2 } from "lucide-react"

export default async function (props: Props) {
  const { order_id } = await props.searchParams
  const { metadata } = await getData(props)

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto py-12 px-4 text-center">
      <Intro alignment="center">
        <IntroTitle>{metadata.title}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      {order_id && (
        <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl flex flex-col items-center gap-3 animate-in fade-in zoom-in-95">
          <CheckCircle2 className="size-8 text-green-600 dark:text-green-500" />
          <h3 className="text-xl font-medium text-green-900 dark:text-green-300">Payment Successful</h3>
          <p className="text-sm text-green-700 dark:text-green-400">
            Order #{order_id} has been processed. Your broker will be upgraded shortly.
          </p>
        </div>
      )}
    </div>
  )
}
