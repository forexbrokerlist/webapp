import { createLoader, parseAsStringEnum, type SearchParams } from "nuqs/server"
import { AdType } from "~/.generated/prisma/enums"
import { AdvertiseFlow } from "~/app/(web)/advertise/advertise-flow"
import { findAds } from "~/server/web/ads/queries"
import { findCategories } from "~/server/web/categories/queries"
import { findSubcategories } from "~/server/web/subcategories/queries"

type AdvertisePickersProps = {
  searchParams: Promise<SearchParams>
}

export const AdvertisePickers = async ({ searchParams }: AdvertisePickersProps) => {
  const searchParamsLoader = createLoader({ 
    type: parseAsStringEnum(Object.values(AdType)),
    cancelled: parseAsStringEnum(["true", "false"])
  })
  const { type, cancelled } = searchParamsLoader(await searchParams)
  const [ads, categories, subcategories] = await Promise.all([
    findAds({}),
    findCategories({ all: true }),
    findSubcategories(),
  ])

  return <AdvertiseFlow ads={ads} type={type} categories={categories} subcategories={subcategories} isCancelled={cancelled === "true"} />
}
