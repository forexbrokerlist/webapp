"use client"

import { useTranslations } from "next-intl"
import type { ComponentProps } from "react"
import { Stack } from "~/components/common/stack"
import { BrokerFilterModal } from "~/components/web/filters/broker-filter-modal"
import { Filters } from "~/components/web/filters/filters"
import { Sort } from "~/components/web/filters/sort"
import { useFilters } from "~/contexts/filter-context"
import type { ToolFilterSchema } from "~/server/web/tools/schema"
import { X } from "lucide-react"
import { FilterTags } from "~/components/web/filters/temp-filter-tags"

export type ToolSearchProps = ComponentProps<typeof Stack> & {
  placeholder?: string
  category?: string
}

export const ToolSearch = ({ placeholder, category, ...props }: ToolSearchProps) => {
  console.log("🔍 ToolSearch received category:", category)
  const t = useTranslations("tools.filters")
  const { enableSort, enableFilters, filters } = useFilters<ToolFilterSchema>()

  const sortOptions = [
    { value: "publishedAt.desc", label: t("sort_latest") },
    { value: "name.asc", label: t("sort_name_asc") },
    { value: "name.desc", label: t("sort_name_desc") },
  ]

  return (
    <Stack {...props}>
      <Filters placeholder={placeholder || t("search_placeholder")}>
        {enableFilters && <BrokerFilterModal category={category} />}
        {enableSort && <Sort options={sortOptions} />}
      </Filters>

      {/* Selected Filter Tags - Positioned below search bar */}
      <FilterTags
        category={filters.category}
        regulators={filters.regulators}
        platforms={filters.platforms}
        rating={filters.rating}
        features={filters.features}
        skillLevel={filters.skillLevel}
        learningFormat={filters.learningFormat}
        pricing={filters.pricing}
        educationFeatures={filters.educationFeatures}
        locationLanguage={filters.locationLanguage}
        // Bridge & Plugin filters
        solutionType={filters.solutionType}
        compatiblePlatform={filters.compatiblePlatform}
        targetClient={filters.targetClient}
        hqRegion={filters.hqRegion}
        // Liquidity Provider filters
        regulation={filters.regulation}
        assetClass={filters.assetClass}
        executionType={filters.executionType}
        providerType={filters.providerType}
      />
    </Stack>
  )
}
