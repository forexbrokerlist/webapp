import { ArrowRight } from "lucide-react"
import type { ComponentProps } from "react"
import { Button } from "~/components/common/button"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { cx } from "~/lib/utils"
import { db } from "~/services/db"
import Image from "next/image"

import { getPresignedUrlFromFull } from "~/lib/media"

export const Sponsors = async ({ className, ...props }: ComponentProps<"section">) => {
  const sponsors = await db.sponsor.findMany({
    where: { isActive: true },
    include: { Category: true },
    orderBy: { order: "asc" },
  })

  // Only render if sponsors exist
  if (sponsors.length === 0) return null

  const sponsorsWithPresigned = await Promise.all(
    sponsors.map(async (sponsor) => ({
      ...sponsor,
      logoUrl: sponsor.logoUrl ? await getPresignedUrlFromFull(sponsor.logoUrl) : null,
    }))
  )

  const groupedSponsors = sponsorsWithPresigned.reduce((acc, sponsor) => {
    const categoryName = sponsor.Category?.name || (sponsor.category as string)
    if (!acc[categoryName]) {
      acc[categoryName] = []
    }
    acc[categoryName].push(sponsor as any)
    return acc
  }, {} as Record<string, typeof sponsors>)

  return (
    <section className={cx("flex flex-col gap-y-8 w-full py-8 md:py-12", className)} {...props}>
      <Intro alignment="center">
        <IntroTitle className="text-2xl md:text-3xl font-bold">Supported by the best</IntroTitle>
        <IntroDescription className="max-w-2xl mx-auto text-muted-foreground mt-4 text-sm md:text-base">
          Our platform is supported by incredible partners and sponsors who make it possible for our team to maintain this directory.
        </IntroDescription>
        <div className="mt-6 flex justify-center">
          <Button 
            variant="secondary" 
            className="rounded-full shadow-sm text-sm"
            suffix={<ArrowRight className="size-4" />}
          >
            Become a sponsor
          </Button>
        </div>
      </Intro>

      {Object.entries(groupedSponsors).map(([categoryName, categorySponsors]) => (
        <div key={categoryName} className="mx-auto w-full max-w-5xl mt-8">
          <h3 className="text-xl font-bold mb-4 text-center md:text-left">{categoryName}</h3>
          <div className="border border-border rounded-xl overflow-hidden bg-background">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 -mb-px -mr-px">
              {categorySponsors.map((sponsor) => (
                <a 
                  key={sponsor.id} 
                  href={sponsor.websiteUrl || undefined}
                  target="_blank"
                  rel="noreferrer"
                  className={cx(
                    "flex items-center justify-center py-6 px-4 gap-3 hover:bg-muted/30 transition-colors group border-r border-b border-border",
                    !sponsor.websiteUrl && "pointer-events-none"
                  )}
                >
                  {sponsor.logoUrl && (
                    <div className="relative size-6 md:size-8 shrink-0">
                      <Image 
                        src={sponsor.logoUrl} 
                        alt={sponsor.name} 
                        fill 
                        className="object-contain opacity-80 group-hover:opacity-100 transition-opacity" 
                      />
                    </div>
                  )}
                  <span className="font-bold text-base md:text-lg tracking-tight text-foreground md:text-foreground/80 group-hover:text-foreground transition-colors overflow-hidden text-ellipsis whitespace-nowrap">
                    {sponsor.name}
                  </span>
                </a>
              ))}
              {/* Fill empty grid blocks if count is irregular for cosmetic reasons */}
              {categorySponsors.length % 5 !== 0 && 
                Array.from({ length: 5 - (categorySponsors.length % 5) }).map((_, i) => (
                  <div key={i} className="hidden lg:block border-r border-b border-border py-6 px-4" />
                ))
              }
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}
