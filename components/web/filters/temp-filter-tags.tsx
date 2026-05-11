// Temporary component to display selected filter tags outside modal
import { X, RotateCcw } from "lucide-react"
import { findFilterOptions } from "~/server/web/actions/filters"
import type { ToolFilterSchema } from "~/server/web/tools/schema"
import { useFilters } from "~/contexts/filter-context"

interface FilterTagsProps {
  category?: string
  regulators?: string
  platforms?: string
  rating?: string
  features?: string
}

export const FilterTags = ({ category, regulators, platforms, rating, features }: FilterTagsProps) => {
  const { filters, updateFilters } = useFilters<ToolFilterSchema>()

  const removeFilter = (filterType: string, value: string) => {
    if (filterType === 'category') {
      updateFilters({ category: filters.category === value ? "" : value })
    } else if (filterType === 'regulators') {
      const currentRegulators = filters.regulators ? filters.regulators.split(",") : []
      const newRegulators = currentRegulators.filter(r => r !== value)
      updateFilters({ regulators: newRegulators.join(",") })
    } else if (filterType === 'platforms') {
      const currentPlatforms = filters.platforms ? filters.platforms.split(",") : []
      const newPlatforms = currentPlatforms.filter(p => p !== value)
      updateFilters({ platforms: newPlatforms.join(",") })
    } else if (filterType === 'rating') {
      updateFilters({ rating: filters.rating === value ? "" : value })
    } else if (filterType === 'features') {
      const currentFeatures = filters.features ? filters.features.split(",") : []
      const newFeatures = currentFeatures.filter(f => f !== value)
      updateFilters({ features: newFeatures.join(",") })
    }
  }

  const resetAllFilters = () => {
    updateFilters({
      category: "",
      regulators: "",
      platforms: "",
      rating: "",
      features: "",
      q: ""
    })
  }

  const hasActiveFilters = !!(category || regulators || platforms || rating || features)

  return (
    <div className="flex flex-wrap items-center gap-2 px-6 py-3 border-b border-[#E5E7E0]">
      {/* {category && (
        <span className="inline-flex items-center gap-1 px-4 py-2 bg-[#A8DD15]/20 text-[#5a7a0a] rounded-full text-xs font-medium">
          {category}
          <button
            type="button"
            onClick={() => removeFilter('category', category)}
            className="ml-1 text-[#5a7a0a] hover:text-[#4a5a0a] transition-colors"
          >
            <X size={12} />
          </button>
        </span>
      )} */}

      {regulators && regulators.split(",").map((reg, index) => (
        <span key={reg} className="inline-flex items-center gap-1 px-4 py-2 bg-[#E9EAE3]  rounded-full text-sm text-[#1A1A1A] font-medium">
          {reg.trim()}
          <button
            type="button"
            onClick={() => removeFilter('regulators', reg.trim())}
            className="ml-1 text-[#1A1A1A]  transition-colors cursor-pointer"
          >
            <X size={12} />
          </button>
        </span>
      ))}

      {platforms && platforms.split(",").map((platform, index) => (
        <span key={platform} className="inline-flex items-center gap-1 px-4 py-2 bg-[#E9EAE3] text-[#1A1A1A] rounded-full text-sm font-medium">
          {platform.trim()}
          <button
            type="button"
            onClick={() => removeFilter('platforms', platform.trim())}
            className="ml-1 text-[#1A1A1A] transition-colors cursor-pointer "
          >
            <X size={12} />
          </button>
        </span>
      ))}

      {rating && (
        <span className="inline-flex items-center gap-1 px-4 py-2 bg-[#E9EAE3] text-[#1A1A1A]   rounded-full text-xs font-medium">
          {rating} Stars +
          <button
            type="button"
            onClick={() => removeFilter('rating', rating)}
            className="ml-1  text-[#1A1A1A]  transition-colors cursor-pointer"
          >
            <X size={12} />
          </button>
        </span>
      )}

      {features && features.split(",").map((feature, index) => (
        <span key={feature} className="inline-flex items-center gap-1 px-4 py-2 bg-[#E9EAE3] text-[#1A1A1A] rounded-full text-sm font-medium">
          {feature.trim()}
          <button
            type="button"
            onClick={() => removeFilter('features', feature.trim())}
            className="ml-1 text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X size={12} />
          </button>
        </span>
      ))}

      {hasActiveFilters && (
        <button
          type="button"
          onClick={resetAllFilters}
          className="inline-flex items-center gap-1 px-4 py-2 bg-[#A8DD15] text-black100 rounded-full text-sm font-medium cursor-pointer transition-colors"
        >
          Reset Filter
          <RotateCcw size={14} />

        </button>
      )}
    </div>
  )
}
