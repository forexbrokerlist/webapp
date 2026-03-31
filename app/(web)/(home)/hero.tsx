import { getTranslations } from "next-intl/server"
import { type ComponentProps, Suspense } from "react"
import { CountBadge, CountBadgeSkeleton } from "~/app/(web)/(home)/count-badge"
import { CTAForm } from "~/components/web/cta-form"
import { CTAProof } from "~/components/web/cta-proof"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { cx } from "~/lib/utils"
export const Hero = async ({ className, ...props }: ComponentProps<"section">) => {
  const t = await getTranslations()

  return (
      <section className={cx("relative flex flex-col gap-y-12 w-full pt-16 pb-24 border-b border-border/40", className)} {...props}>
        {/* Background pattern */}
        <div className="absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 opacity-60 dark:opacity-100 -z-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(150, 150, 150, 0.3) 1px, transparent 0)', backgroundSize: '24px 24px' }} />

        <Intro alignment="center" className="relative z-10 px-4">
          <IntroTitle className="max-w-[16em] lg:text-5xl/[1.1]!">Discover and Compare the Best Forex Brokers</IntroTitle>
          <IntroDescription className="lg:mt-2">{t("brand.description")}</IntroDescription>

          <Suspense fallback={<CountBadgeSkeleton />}>
            <CountBadge />
          </Suspense>
        </Intro>

        {/* <CTAForm
          size="lg"
          className="max-w-sm mx-auto items-center text-center relative z-10"
          buttonProps={{ size: "md", variant: "fancy" }}
        >
          <CTAProof />
        </CTAForm> */}
      </section>
    )
}
