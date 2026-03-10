import { createLoader, parseAsStringEnum, type SearchParams } from "nuqs/server"
import { AdType } from "~/.generated/prisma/enums"
import { AdvertiseFlow } from "~/app/(web)/advertise/advertise-flow"
import { findAds } from "~/server/web/ads/queries"

type AdvertisePickersProps = {
  searchParams: Promise<SearchParams>
}

export const AdvertisePickers = async ({ searchParams }: AdvertisePickersProps) => {
  const searchParamsLoader = createLoader({ type: parseAsStringEnum(Object.values(AdType)) })
  const { type } = searchParamsLoader(await searchParams)
  const ads = await findAds({})

  return <AdvertiseFlow ads={ads} type={type} />
}
