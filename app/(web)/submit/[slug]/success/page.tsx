import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import { cache } from "react"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { db } from "~/services/db"

type Props = PageProps<"/submit/[slug]/success">

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
  return getPageMetadata({ url, metadata })
}

export default async function (props: Props) {
  const { metadata } = await getData(props)

  return (
    <Intro alignment="center">
      <IntroTitle>{metadata.title}</IntroTitle>
      <IntroDescription>{metadata.description}</IntroDescription>
    </Intro>
  )
}
