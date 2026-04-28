import seoData from "~/config/seo.json"
import { LoaderIcon, Star } from "lucide-react"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { cache, Suspense } from "react"
import { AdvertisePickers } from "~/app/(web)/advertise/pickers"
import { Button } from "~/components/common/button"
import { Wrapper } from "~/components/common/wrapper"
import { ExternalLink } from "~/components/web/external-link"
import { Stats } from "~/components/web/stats"
import { StructuredData } from "~/components/web/structured-data"
import { Testimonial } from "~/components/web/testimonial"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { generateWebPage } from "~/lib/structured-data"
import CommonBanner from "~/components/web/common-banner"
import StarFill from "~/components/common/icons/star-fill"
const TradeImage = '/assets/images/advertise.png';
const ProfileImage = '/assets/images/profile2.png';

const getData = cache(async () => {
  const t = await getTranslations()
  const url = "/advertise"


})



export default async function ({ searchParams }: any) {

  return (
    <>
      <CommonBanner
        image={TradeImage}
        description='Advertise your forex brand to 5000+ active traders on Forex Brokers List. Get maximum visibility and reach the right audience. Start your campaign today.'
        highlightedText="Advertise With Us –" title="Reach 
Thousands of Active Forex 
Traders" />
      <div className="pt-[40px] pb-100 max-mobile:py-16">
        <div className="max-w-[1640px] px-5 max-laptop:px-16 mx-auto relative max-tab:px-5 max-mobile:px-4">
          <div className="grid grid-cols-2 gap-7 max-tab:grid-cols-1 max-mobile:gap-5">
            <div className="flex flex-col justify-between max-tab:gap-16">
              {/* slider */}
              <div>
                <Testimonial />
              </div>
              {/* slider */}
              <div className="pb-10">
                <Stats />
              </div>
            </div>
            <div>
              <Suspense fallback={<LoaderIcon className="mx-auto size-[1.25em] animate-spin" />}>
                <AdvertisePickers searchParams={searchParams} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
      <div className='w-full h-[1px] bg-[linear-gradient(90deg,#F0F1EC_0%,#A8DD15_50%,#F0F1EC_100%)]'></div>
      {/* <Testimonial /> */}
      {/* <Wrapper gap="xl"> */}





      {/* <Intro alignment="center">
          <IntroTitle size="h2" as="h3">
            {t(`${namespace}.cta.title`)}
          </IntroTitle>

          <IntroDescription className="max-w-lg">
            {t(`${namespace}.cta.description`)}
          </IntroDescription>

          <Button className="mt-4 min-w-40" asChild>
            <Link href={`/contact`}>
              {t(`${namespace}.cta.button`)}
            </Link>
          </Button>
        </Intro> */}

      {/* <StructuredData data={structuredData} /> */}
      {/* </Wrapper> */}
    </>
  )
}
