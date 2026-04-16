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
import { ExternalLink } from "~/components/web/external-link"
import { FullLogo } from "~/components/web/ui/full-logo"
import { NavLink, navLinkVariants } from "~/components/web/ui/nav-link"
import { adsConfig } from "~/config/ads"
import { linksConfig } from "~/config/links"
import { cx } from "~/lib/utils";
const FooterLogo = '/assets/images/footer-logo.svg';

export const Footer = ({ children, className, ...props }: ComponentProps<"div">) => {
  const t = useTranslations()

  return (
    <>
      <footer className="pt-[70px] pb-100 max-tab:pb-16 max-mobile:pb-[40px]">
        <div className="max-w-[1640px] px-5 max-laptop:px-16 mx-auto">
          <div className="flex justify-center pb-5">
            <img src={FooterLogo} alt="Footer Logo" />
          </div>
          <h2 className="text-2xl max-mobile:text-xl max-mobile:leading-10 font-bold text-black100 text-center mb-1">
            {t("components.footer.cta_title")}
          </h2>
          <p className="text-base max-mobile:text-sm font-medium text-black700 text-center mb-[30px]">
            {t("components.footer.cta_description", { count: formatNumber(5000, "standard") })}
          </p>
        </div>
        <div className="max-w-[500px] mx-auto max-mobile:px-4">
          <CTAForm />
        </div>
        <div className="max-w-[872px] mx-auto w-full pt-[60px] max-laptop:px-16 max-tab:px-5 max-mobile:px-4 max-mobile:pt-[40px]">
          <div className="flex justify-between gap-5 max-mobile:grid max-mobile:grid-cols-1 max-mobile:gap-5">
            <div>
              <FullLogo className="h-6 max-w-[175px] w-full" />
              <p className="text-base font-medium text-black700 max-w-[364px] mt-5">
              ForexBrokerList.io is a free forex broker directory helping traders discover, compare, and review 512+ verified forex brokers worldwide.

              </p>
              <div className="pt-6 flex items-center gap-2.5">


                <Tooltip tooltip={t("navigation.rss_feed")}>
                  <ExternalLink href={linksConfig.feed} className={navLinkVariants()}>
                    <div className="w-[50px] h-[50px] bg-white rounded-full flex items-center justify-center">
                      <RssIcon className="text-primary text-2xl" />
                    </div>
                  </ExternalLink>
                </Tooltip>

                <Tooltip tooltip={t("navigation.contact_us")}>
                  <NavLink href="/contact" className={navLinkVariants()}>
                    <div className="w-[50px] h-[50px] bg-white rounded-full flex items-center justify-center">
                      <AtSignIcon className="text-primary text-2xl" />
                    </div>
                  </NavLink>
                </Tooltip>
              </div>
            </div>
            <div className="flex gap-18 max-tab:gap-10 ">
              <div>
                <h6 className="text-lg mb-3 text-black font-medium">{t("navigation.browse")}:</h6>
                <NavLink className="text-base font-medium text-black700 block pb-2" href="/">{t("navigation.tools")}</NavLink>
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
            </div>
          </div>
          <div className="text-base max-mobile:pt-[40px] font-medium text-black700 pt-[60px]">
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
              For queries or listing requests, contact us at: <span className="text-primary underline"> forexbrokerlist24@gmail.com </span>
            </p>
          </div>
      <div className='w-full mt-4  h-[1px]   bg-[#1A1A1A1A]'></div>
          <p className='text-center text-base font-medium text-black700 mt-4'> © 2026 ForexBrokerList.io - All rights reserved.</p>
        </div>
      </footer>

    </>
  )
}
