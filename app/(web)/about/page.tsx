import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { cache } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/common/avatar"
import { Button } from "~/components/common/button"
import { Link } from "~/components/common/link"
import { Prose } from "~/components/common/prose"
import { Stack } from "~/components/common/stack"
import { StructuredData } from "~/components/web/structured-data"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { generateAboutPage } from "~/lib/structured-data"

// I18n page namespace
const namespace = "pages.about"

// Get page data
const getData = cache(async () => {
  const t = await getTranslations()
  const url = "/about"
  const title = t(`${namespace}.title`, { siteName: siteConfig.name })
  const description = t(`${namespace}.description`, { siteName: siteConfig.name })

  return getPageData(url, title, description, {
    breadcrumbs: [{ url, title }],
    structuredData: [generateAboutPage(url, title, description)],
  })
})

export const generateMetadata = async (): Promise<Metadata> => {
  const { url, metadata } = await getData()
  return getPageMetadata({ url, metadata })
}

export default async function () {
  const t = await getTranslations()
  const { metadata, structuredData } = await getData()

  return (
    <>
      <Intro>
        <IntroTitle>{metadata.title}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <Prose>
        <h2>{t(`${namespace}.story.title`)}</h2>
        <p>{t(`${namespace}.story.content`, { siteName: siteConfig.name })}</p>

        <h2>{t(`${namespace}.mission.title`)}</h2>
        <p>{t(`${namespace}.mission.content`, { siteName: siteConfig.name })}</p>

        <section className="not-prose mt-12">
          <h2 className="text-2xl font-bold mb-8">{t(`${namespace}.team.title`)}</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Stack direction="column" className="items-center text-center p-6 border rounded-lg bg-accent/5">
              <Avatar className="size-24 mb-4">
                <AvatarImage src="https://avatars.githubusercontent.com/u/4151752?v=4" alt={t(`${namespace}.team.members.piotr.name`)} />
                <AvatarFallback>PK</AvatarFallback>
              </Avatar>
              <h3 className="font-bold text-lg">{t(`${namespace}.team.members.piotr.name`)}</h3>
              <p className="text-sm text-foreground/60 mb-3">{t(`${namespace}.team.members.piotr.role`)}</p>
              <p className="text-sm leading-relaxed">
                {t(`${namespace}.team.members.piotr.bio`)}
              </p>
            </Stack>
          </div>
        </section>

        <section className="not-prose mt-20 p-8 rounded-2xl bg-foreground text-background">
          <Stack direction="column" className="items-center text-center gap-4">
            <h2 className="text-3xl font-bold">{t(`${namespace}.contact.title`)}</h2>
            <p className="max-w-2xl opacity-80">
              {t(`${namespace}.contact.content`)}
            </p>
            <Button variant="secondary" asChild className="mt-4">
              <Link href={`mailto:${siteConfig.email}`}>
                {t(`${namespace}.contact.button`)}
              </Link>
            </Button>
          </Stack>
        </section>
      </Prose>

      <StructuredData data={structuredData} />
    </>
  )
}
