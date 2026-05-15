"use client"

import { useTranslations } from "next-intl"
import type { ComponentProps } from "react"
import { Link } from "~/components/common/link"
import { Skeleton } from "~/components/common/skeleton"
import { cx } from "~/lib/utils"
import type { TagMany } from "~/server/web/tags/payloads"

type TagCardProps = ComponentProps<"div"> & {
  tag: TagMany
}

const TagCard = ({ tag, className, ...props }: TagCardProps) => {
  const t = useTranslations()
  const count = tag?._count?.brokers ?? 0

  return (
    <div className={cx("group relative", className)} {...props}>
      <Link
        href={`/tags/${tag.slug}`}
        className="flex items-center justify-between p-5 bg-white border border-black/[0.03] rounded-2xl transition-all duration-300 hover:border-primary hover:shadow-[0_12px_24px_rgba(168,221,21,0.15)] hover:-translate-y-1"
      >
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[15px] font-bold text-black100 truncate group-hover:text-black capitalize">
            {tag.slug.replace(/-/g, " ")}
          </span>
          <span className="text-[10px] font-bold text-black/30 uppercase tracking-widest">
            {count} {t("tools.count_tools", { count })}
          </span>
        </div>

        <div className="flex items-center justify-center size-8 bg-[#F0F2EC] rounded-full group-hover:bg-primary transition-all duration-300">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-black/40 group-hover:text-black transition-colors"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </div>
      </Link>
    </div>
  )
}

const TagCardSkeleton = () => {
  return (
    <div className="p-5 bg-white border border-black/[0.03] rounded-2xl flex items-center justify-between">
      <div className="flex flex-col gap-2 w-1/2">
        <Skeleton className="h-5 w-full rounded-md" />
        <Skeleton className="h-3 w-1/3 rounded-md" />
      </div>
      <Skeleton className="size-8 rounded-full" />
    </div>
  )
}

export { TagCard, TagCardSkeleton }
