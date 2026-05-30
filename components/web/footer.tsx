"use client"

import { formatNumber } from "@primoui/utils"
import { AtSignIcon, RssIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import type { ComponentProps } from "react"
import { H5, H6 } from "~/components/common/heading"
import { BrandGitHubIcon } from "~/components/common/icons/brand-github"
import { Note } from "~/components/common/note"
import { Stack } from "~/components/common/stack"
import { Tooltip } from "~/components/common/tooltip"
import { CTAForm } from "~/components/web/cta-form"
import { usePathname } from "next/navigation"
import { ExternalLink } from "~/components/web/external-link"
import { FullLogo } from "~/components/web/ui/full-logo"
import { NavLink, navLinkVariants } from "~/components/web/ui/nav-link"
import { adsConfig } from "~/config/ads"
import { linksConfig } from "~/config/links"
import { cx } from "~/lib/utils";
const MapImage = '/assets/images/map-img.png';


export const Footer = ({ children, className, ...props }: ComponentProps<"div">) => {
  const pathname = usePathname();
  const t = useTranslations()

  return (
    <>
      <footer className="pt-[70px] pb-[50px] max-tab:pb-16 max-mobile:pb-[40px]">
        <div className="max-w-[1530px] px-5 max-laptop:px-16 mx-auto relative max-tab:px-5 max-mobile:px-4">
          <div className="relative">
            <img src={MapImage} alt="MapImage" className="block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1100px]" />
            <div className="flex max-tab:grid max-tab:grid-cols-2 max-mobile:grid-cols-1 relative z-10 gap-10 max-mobile:gap-5 justify-between">
              <div className="max-w-[360px]">
                <FullLogo className=" max-w-[175px] w-full" />
                <p className="text-base text-black700 font-medium my-5">
                  ForexBrokerList.io is a free forex broker directory helping traders discover, compare, and review 512+ verified
                  forex brokers worldwide.
                </p>
                <div className="flex items-center gap-4">
                  <Tooltip tooltip={t("navigation.rss_feed")}>
                    <ExternalLink href={linksConfig.feed} className={navLinkVariants()}>
                      <div className="w-[50px] h-[50px] bg-white rounded-full flex items-center justify-center">
                        <RssIcon className="text-black100 text-2xl" />
                      </div>
                    </ExternalLink>
                  </Tooltip>

                  <Tooltip tooltip={t("navigation.contact_us")}>
                    <NavLink href="/contact" className={navLinkVariants()}>
                      <div className="w-[50px] h-[50px] bg-white rounded-full flex items-center justify-center">
                        <AtSignIcon className=" text-black100 text-2xl" />
                      </div>
                    </NavLink>
                  </Tooltip>
                </div>
              </div>
              <div>
                <h6 className="text-lg mb-3 text-black font-medium">{t("navigation.browse")}:</h6>
                <NavLink className="text-base font-medium text-black700 block pb-2" href="/brokers">{t("navigation.tools")}</NavLink>
                <NavLink className="text-base font-medium text-black700 block pb-2" href="/categories">{t("navigation.categories")}</NavLink>
                <NavLink className="text-base font-medium text-black700 block pb-2" href="/tags">{t("navigation.tags")}</NavLink>
                <NavLink className="text-base font-medium text-black700 block " href="/blog">{t("navigation.blog")}</NavLink>
              </div>
              <div>
                <h6 className="text-lg mb-3 text-black font-medium">{t("navigation.quick_links")}:</h6>

                <NavLink className="text-base font-medium text-black700 block pb-2" href="/submit">{t("navigation.submit")}</NavLink>
                <NavLink className="text-base font-medium text-black700 block pb-2" href="/about">{t("navigation.about")}</NavLink>
                <NavLink className="text-base font-medium text-black700 block pb-2" href="/contact">{t("navigation.contact_us")}</NavLink>
                <NavLink className="text-base font-medium text-black700 block pb-2" href="/privacy">{t("navigation.privacy")}</NavLink>
                <NavLink className="text-base font-medium text-black700 block pb-2" href="/terms">{t("navigation.terms")}</NavLink>
                <NavLink className="text-base font-medium text-black700 block pb-2" href="/disclaimer">{t("navigation.disclaimer")}</NavLink>
                <NavLink className="text-base font-medium text-black700 block pb-2" href="/cookies">{t("navigation.cookies")}</NavLink>
                {adsConfig.enabled && <NavLink href="/advertise" className="text-base font-medium text-black700 block ">{t("navigation.advertise")}</NavLink>}
              </div>
              <div className="max-w-[442px]">
                <h6 className="text-lg mb-3 text-black font-medium">
                  Subscribe to our newsletter
                </h6>
                <p className="text-base text-black700 font-medium mb-6">
                  Join 5,000+ other members and get updates straight to your
                  inbox.
                </p>
                <CTAForm key={pathname} />
              </div>
            </div>
            <div className="text-base relative z-10 max-mobile:pt-[40px] font-medium text-black700 pt-[60px]">
              <p>
                ForexBrokerList.io is an independent forex broker directory for informational purposes only. We do not provide financial advice,
                execute trades, or manage client funds.

              </p>
              <p className="mt-2">
                All broker listings, reviews, and comparisons are for general information only. Trading forex and CFDs involves significant risk of loss and may not be suitable for all investors. Past performance is not indicative of future results.
              </p>
              <p className="mt-2">
                Sponsored listings are clearly marked and do not imply endorsement or recommendation. Always verify a broker's regulatory status through official authorities such as FCA, ASIC, or CySEC before depositing funds.
              </p>
              <p className="mt-2">
                For queries or listing requests, contact us at: <a href="mailto:forexbrokerlist24@gmail.com" className="text-primary underline">forexbrokerlist24@gmail.com</a>
              </p>
            </div>
            <div className='w-full mt-4  h-[1px]   bg-[#1A1A1A1A]'></div>
            <p className='text-center relative z-10 text-base font-medium text-black700 mt-4'> © 2026 ForexBrokerList.io - All rights reserved.</p>
          </div>
        </div>


      </footer>

    </>
  )
}
