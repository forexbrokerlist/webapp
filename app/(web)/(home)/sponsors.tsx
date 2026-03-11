import { ArrowRight, ExternalLink } from "lucide-react"
import type { ComponentProps } from "react"
import { Button } from "~/components/common/button"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { cx } from "~/lib/utils"
import { db } from "~/services/db"
import Image from "next/image"
import Link from "next/link"

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
    const categoryId = sponsor.categoryId || (sponsor.Category?.id) || "other"
    if (!acc[categoryId]) {
      acc[categoryId] = {
        name: sponsor.Category?.name || (sponsor.category as string),
        slug: sponsor.Category?.slug || null,
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
            className="rounded-full shadow-sm px-6 py-5 h-auto text-base hover:bg-primary hover:text-primary-foreground transition-all duration-300"
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-px bg-border/40 border border-border/40 rounded-2xl overflow-hidden shadow-sm">
              {group.items.map((sponsor) => (
                <a 
                  key={sponsor.id} 
                  href={sponsor.websiteUrl || undefined}
                  target="_blank"
                  rel="noreferrer"
                  className={cx(
                    "flex flex-col items-center justify-center py-8 px-6 gap-4 bg-background hover:bg-muted/30 transition-all duration-300 group/item relative",
                    !sponsor.websiteUrl && "pointer-events-none"
                  )}
                >
                  <div className="absolute top-3 right-3 opacity-0 group-hover/item:opacity-40 transition-opacity">
                    <ExternalLink className="size-3" />
                  </div>
                  
                  {sponsor.logoUrl ? (
                    <div className="relative w-full h-10 md:h-12 shrink-0">
                      <Image 
                        src={sponsor.logoUrl} 
                        alt={sponsor.name} 
                        fill 
                        className="object-contain opacity-70 group-hover/item:opacity-100 group-hover/item:scale-105 transition-all duration-300 grayscale group-hover/item:grayscale-0" 
                      />
                    </div>
                  ) : (
                    <div className="size-10 md:size-12 rounded-lg bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground font-bold text-lg">
                        {sponsor.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  
                  <span className="font-semibold text-sm md:text-base tracking-tight text-muted-foreground group-hover/item:text-foreground transition-colors overflow-hidden text-ellipsis whitespace-nowrap text-center w-full px-2">
                    {sponsor.name}
                  </span>
                </a>
              ))}
              
              {/* Decorative fill for empty spots if needed, but modern grid often looks better without hard borders if using gaps */}
              {/* We use gap-px and bg-border to create the grid lines effect */}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
