"use client"

import { useLocale, useTranslations } from "next-intl"
import type { ComponentProps } from "react"
import { MDXComponents } from "~/components/web/mdx-components"
import { Stat } from "~/components/web/ui/stat"
import { cva, cx, type VariantProps } from "~/lib/utils"

const statsVariants = cva({
  base: "flex flex-wrap items-start  gap-[30px]",

  variants: {
    alignment: {
      start: "items-start  text-start",
      center: "items-center  text-center",
      end: "items-end  text-end",
    },
  },

  defaultVariants: {
    alignment: "center",
  },
})

type StatsProps = ComponentProps<"div"> & VariantProps<typeof statsVariants>

export const Stats = ({ alignment, className, ...props }: StatsProps) => {
  const t = useTranslations("components.stats")
  const locale = useLocale()

  const stats = [
    { value: 250000, label: t("pageviews") },
    { value: 2000, label: t("tools") },
    { value: 5000, label: t("subscribers") },
  ]

  return (
    <div className={cx(statsVariants({ alignment, className }))} {...props}>
      {stats.map(({ value, label }, index) => (
        <MDXComponents.a
          key={`${index}-${label}`}
          className="space-y-1 basis-40 hover:[[href]]:opacity-80 lg:basis-48"
        >
          <Stat
            value={value}
            format={{ notation: "compact" }}
            locales={locale}
            // @ts-expect-error
            style={{ "--number-flow-char-height": "0.75em" }}
            className="text-4xl max-mobile:text-2xl font-display font-semibold"
          />

          <p className="text-base max-mobile:text-sm text-black700 font-medium">{label}</p>
        </MDXComponents.a>
      ))}
    </div>
  )
}
