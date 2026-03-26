import { ArrowRight, ExternalLink } from "lucide-react"
import type { ComponentProps } from "react"
import { Button } from "~/components/common/button"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { cx } from "~/lib/utils"
import { db } from "~/services/db"
import Image from "next/image"
import Link from "next/link"

import { getPresignedUrlFromFull } from "~/lib/media"
import { slugify } from "@primoui/utils"

export const Sponsors = async ({ className, ...props }: ComponentProps<"section">) => {
  const dbSponsors = await db.sponsor.findMany({
    include: { Category: true },
    orderBy: [{ isActive: "desc" }, { order: "asc" }],
  })

  // Only render if sponsors exist
  if (dbSponsors.length === 0) return null

  const sponsorsWithPresigned = await Promise.all(
    dbSponsors.map(async (sponsor) => ({
      ...sponsor,
      logoUrl: sponsor.logoUrl ? await getPresignedUrlFromFull(sponsor.logoUrl) : null,
    }))
  )

  const groupedSponsors = sponsorsWithPresigned.reduce((acc, sponsor) => {
    const category = sponsor.Category
    const categoryId = category?.id || "other"
    if (!acc[categoryId]) {
      acc[categoryId] = {
        name: category?.name || "Other",
        slug: category?.slug || null,
        items: []
      }
    }
    acc[categoryId].items.push(sponsor)
    return acc
  }, {} as Record<string, { name: string; slug: string | null; items: typeof sponsorsWithPresigned }>)

  return (
    <section className={cx("flex flex-col gap-y-12 w-full py-12 md:py-16", className)} {...props}>
      <Intro alignment="center">
        <IntroTitle className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Supported by the best
        </IntroTitle>
        <IntroDescription className="max-w-2xl mx-auto text-muted-foreground mt-4 text-base md:text-lg">
          Our platform is supported by incredible partners and sponsors who make it possible for our team to maintain this directory.
        </IntroDescription>
        <div className="mt-8 flex justify-center">
          <Button
            variant="secondary"
            className="rounded-full shadow-sm px-4 py-3 h-auto text-base hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            suffix={<ArrowRight className="size-4 animate-in fade-in slide-in-from-left-2 duration-500" />}
            asChild
          >
            <Link href="/advertise">
              Become a sponsor
            </Link>
          </Button>
        </div>
      </Intro>

      <div className="flex flex-col gap-12">
        {Object.entries(groupedSponsors).map(([categoryId, group]) => (
          <div key={categoryId} className="mx-auto w-full max-w-6xl">
            <div className="flex items-baseline justify-between mb-6 px-4 md:px-0">
              <h3 className="text-2xl font-bold tracking-tight text-foreground/90">{group.name}</h3>
              {group.slug && (
                <Link
                  href={`/categories/${group.slug}`}
                  className="group/link text-sm font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  View all
                  <ArrowRight className="size-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {group.items.map((sponsor) => (
                <Link
                  key={sponsor.id}
                  href={`/brokers/${sponsor.slug || slugify(sponsor.name || '')}`}
                  className={cx(
                    "group/card flex flex-col gap-4 p-4 rounded-3xl border border-border/50 bg-card/50 hover:bg-card shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1.5 transition-all duration-500 relative"
                  )}
                >
                  <div className="absolute top-4 right-4 opacity-0 group-hover/card:opacity-40 transition-opacity z-10">
                    <ArrowRight className="size-3.5" />
                  </div>

                  <div className="relative flex items-center justify-center bg-white dark:bg-white/5 rounded-2xl p-6 aspect-4/3 w-full overflow-hidden shadow-inner border border-border/40">
                    {sponsor.logoUrl ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={sponsor.logoUrl}
                          alt={sponsor.name || ""}
                          fill
                          className="object-contain transition-all grayscale-0 opacity-100 group-hover/card:grayscale group-hover/card:opacity-80"
                        />
                      </div>
                    ) : (
                      <div className="size-full flex items-center justify-center bg-muted/50 text-muted-foreground/30 font-bold text-4xl">
                        {sponsor.name?.charAt(0)}
                      </div>
                    )}
                  </div>


                  <div className="flex flex-col items-center gap-0.5 px-2">
                    <span className="font-bold text-base tracking-tight text-foreground/80 group-hover/card:text-foreground transition-colors line-clamp-1 text-center">
                      {sponsor.name}
                    </span>
                    {sponsor.isActive && (
                      <span className="text-[10px] uppercase tracking-widest font-bold text-primary group-hover/card:text-muted-foreground/50 transition-colors">
                        Sponsor
                      </span>
                    )}
                  </div>

                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
