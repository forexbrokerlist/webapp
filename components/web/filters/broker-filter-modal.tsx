"use client"

import { ChevronDown, ChevronUp, SlidersHorizontal, X } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { useEffect, useState } from "react"
import { useFilters } from "~/contexts/filter-context"
import { findFilterOptions } from "~/server/web/actions/filters"
import type { ToolFilterSchema } from "~/server/web/tools/schema"

interface FilterTagsProps {
  category?: string
  regulators?: string
  platforms?: string
  rating?: string
}

const FilterTags = ({ category, regulators, platforms, rating }: FilterTagsProps) => {
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
    }
  }

  return (
    <div className="flex flex-wrap gap-2 px-6 py-3 border-b border-[#E5E7E0]">
      {category && (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#A8DD15]/20 text-[#5a7a0a] rounded-full text-xs font-medium">
          {category}
          <button
            type="button"
            onClick={() => removeFilter('category', category)}
            className="ml-1 text-[#5a7a0a] hover:text-[#4a5a0a] transition-colors"
          >
            <X size={12} />
          </button>
        </span>
      )}

      {regulators && regulators.split(",").map((reg, index) => (
        <span key={reg} className="inline-flex items-center gap-1 px-3 py-1 bg-[#A8DD15]/20 text-[#5a7a0a] rounded-full text-xs font-medium">
          {reg.trim()}
          <button
            type="button"
            onClick={() => removeFilter('regulators', reg.trim())}
            className="ml-1 text-[#5a7a0a] hover:text-[#4a5a0a] transition-colors"
          >
            <X size={12} />
          </button>
        </span>
      ))}

      {platforms && platforms.split(",").map((platform, index) => (
        <span key={platform} className="inline-flex items-center gap-1 px-3 py-1 bg-[#A8DD15]/20 text-[#5a7a0a] rounded-full text-xs font-medium">
          {platform.trim()}
          <button
            type="button"
            onClick={() => removeFilter('platforms', platform.trim())}
            className="ml-1 text-[#5a7a0a] hover:text-[#4a5a0a] transition-colors"
          >
            <X size={12} />
          </button>
        </span>
      ))}

      {rating && (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#A8DD15]/20 text-[#5a7a0a] rounded-full text-xs font-medium">
          {rating} Stars & Up
          <button
            type="button"
            onClick={() => removeFilter('rating', rating)}
            className="ml-1 text-[#5a7a0a] hover:text-[#4a5a0a] transition-colors"
          >
            <X size={12} />
          </button>
        </span>
      )}
    </div>
  )
}

export const BrokerFilterModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [localCategory, setLocalCategory] = useState<string>("")
  const [localRegulators, setLocalRegulators] = useState<string[]>([])
  const [localPlatforms, setLocalPlatforms] = useState<string[]>([])
  const [localRating, setLocalRating] = useState<string>("")
  const [localFeatures, setLocalFeatures] = useState<string[]>([])
  const [expandedSections, setExpandedSections] = useState<string[]>(["category", "features"])
  const { filters, updateFilters } = useFilters<ToolFilterSchema>()
  const { result, execute } = useAction(findFilterOptions)

  useEffect(execute, [execute])

  // Sync local state when opening modal
  useEffect(() => {
    if (isOpen) {
      setLocalCategory(filters.category || "")
      setLocalRegulators(filters.regulators ? filters.regulators.split(",") : [])
      setLocalPlatforms(filters.platforms ? filters.platforms.split(",") : [])
      setLocalRating(filters.rating || "")
      setLocalFeatures(filters.features ? filters.features.split(",") : [])
    }
  }, [isOpen, filters.category, filters.regulators, filters.platforms, filters.rating, filters.features])

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const toggleSection = (type: string) => {
    setExpandedSections(prev =>
      prev.includes(type) ? prev.filter(s => s !== type) : [...prev, type],
    )
  }

  const handleApply = () => {
    updateFilters({
      category: localCategory,
      regulators: localRegulators.join(","),
      platforms: localPlatforms.join(","),
      rating: localRating,
      features: localFeatures.join(",")
    })
    setIsOpen(false)
  }

  const handleClear = () => {
    setLocalCategory("")
    setLocalRegulators([])
    setLocalPlatforms([])
    setLocalRating("")
    setLocalFeatures([])
    updateFilters({
      category: "",
      regulators: "",
      platforms: "",
      rating: "",
      features: ""
    })
    setIsOpen(false)
  }

  const activeCount =
    (filters.category ? 1 : 0) +
    (filters.regulators ? filters.regulators.split(",").length : 0) +
    (filters.platforms ? filters.platforms.split(",").length : 0) +
    (filters.rating ? 1 : 0) +
    (filters.features ? filters.features.split(",").length : 0)

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
    }
  }

  const sectionLabel = (type: string) => {
    const labels: Record<string, string> = {
      category: "CATEGORY",
      regulators: "REGULATORS",
      platforms: "PLATFORMS",
      rating: "RATING"
    }
    return labels[type] ?? type.replace(/_/g, " ").toUpperCase()
  }

  return (
    <>

      {/* Trigger Button */}
      <button
        id="broker-filter-modal-trigger"
        type="button"
        onClick={() => setIsOpen(true)}
        className={[
          "flex items-center cursor-pointer gap-2 px-4 h-11 rounded-lg border text-sm font-medium transition-all whitespace-nowrap",
          activeCount > 0
            ? "border-[#A8DD15] bg-[#A8DD15]/10 text-[#5a7a0a]"
            : "border-[#E5E7E0] bg-white text-[#333] hover:border-[#A8DD15] hover:text-[#5a7a0a]",
        ].join(" ")}
      >
        <SlidersHorizontal size={16} />
        Filters
        {activeCount > 0 && (
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#A8DD15] text-white text-[10px] font-bold leading-none">
            {activeCount}
          </span>
        )}
      </button>


      {/* Backdrop */}
      {isOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 bg-black/40 z-[1000] transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Side panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filter Providers"
        className={[
          "fixed top-0 right-0 h-full w-[400px] max-w-[95vw] bg-white z-[1001] shadow-2xl flex flex-col",
          "transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E7E0]">
          <h2 className="text-lg font-semibold text-[#1a1a1a]">Filter Providers</h2>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-md hover:bg-gray-100 text-[#666] transition-colors"
            aria-label="Close filters"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {!result.data && (
            <div className="flex items-center justify-center h-32 text-sm text-gray-400">
              Loading filters…
            </div>
          )}

          {result.data?.map(({ type, options }) => {
            const isExpanded = expandedSections.includes(type)

            return (
              <div key={type} className="border-b border-[#E5E7E0]">
                {/* Section toggle */}
                <button
                  type="button"
                  className="flex items-center justify-between w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => toggleSection(type)}
                >
                  <span className="text-[11px] font-semibold tracking-widest text-[#888] uppercase">
                    {sectionLabel(type)}
                  </span>
                  {isExpanded ? (
                    <ChevronUp size={16} className="text-[#888]" />
                  ) : (
                    <ChevronDown size={16} className="text-[#888]" />
                  )}
                </button>

                {/* Options grid */}
                {isExpanded && (
                  <div className="px-6 pb-5 grid grid-cols-2 gap-x-4 gap-y-3 bg-gradient-to-b from-transparent to-[#A8DD15]/5">
                    {type === "category" && (
                      <>
                        {/* "All Category" option */}
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={localCategory === ""}
                            onChange={() => setLocalCategory("")}
                            className="w-4 h-4 rounded accent-[#A8DD15] cursor-pointer"
                          />
                          <span className="text-sm text-[#444] group-hover:text-[#222] transition-colors">
                            All Category
                          </span>
                        </label>

                        {options.map(({ slug, name }) => (
                          <label key={slug} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={localCategory === slug}
                              onChange={() =>
                                setLocalCategory(prev => (prev === slug ? "" : slug))
                              }
                              className="w-4 h-4 rounded accent-[#A8DD15] cursor-pointer"
                            />
                            <span className="text-sm text-[#444] group-hover:text-[#222] transition-colors line-clamp-1">
                              {name as string}
                            </span>
                          </label>
                        ))}
                      </>
                    )}

                    {type === "regulators" && (
                      <>
                        {/* "All Regulators" option */}
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={localRegulators.length === 0}
                            onChange={() => setLocalRegulators([])}
                            className="w-4 h-4 rounded accent-[#A8DD15] cursor-pointer"
                          />
                          <span className="text-sm text-[#444] group-hover:text-[#222] transition-colors">
                            All Regulators
                          </span>
                        </label>

                        {options.map(({ slug, name }) => (
                          <label key={slug} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={localRegulators.includes(slug)}
                              onChange={() =>
                                setLocalRegulators(prev =>
                                  prev.includes(slug)
                                    ? prev.filter(r => r !== slug)
                                    : [...prev, slug]
                                )
                              }
                              className="w-4 h-4 rounded accent-[#A8DD15] cursor-pointer"
                            />
                            <span className="text-sm text-[#444] group-hover:text-[#222] transition-colors line-clamp-1">
                              {name as string}
                            </span>
                          </label>
                        ))}
                      </>
                    )}

                    {type === "platforms" && (
                      <>
                        {/* "All Platforms" option */}
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={localPlatforms.length === 0}
                            onChange={() => setLocalPlatforms([])}
                            className="w-4 h-4 rounded accent-[#A8DD15] cursor-pointer"
                          />
                          <span className="text-sm text-[#444] group-hover:text-[#222] transition-colors">
                            All Platforms
                          </span>
                        </label>

                        {options.map(({ slug, name }) => (
                          <label key={slug} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={localPlatforms.includes(slug)}
                              onChange={() =>
                                setLocalPlatforms(prev =>
                                  prev.includes(slug)
                                    ? prev.filter(p => p !== slug)
                                    : [...prev, slug]
                                )
                              }
                              className="w-4 h-4 rounded accent-[#A8DD15] cursor-pointer"
                            />
                            <span className="text-sm text-[#444] group-hover:text-[#222] transition-colors line-clamp-1">
                              {name as string}
                            </span>
                          </label>
                        ))}
                      </>
                    )}

                    {type === "rating" && (
                      <>
                        {/* "All Rating" option */}
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={localRating === ""}
                            onChange={() => setLocalRating("")}
                            className="w-4 h-4 rounded accent-[#A8DD15] cursor-pointer"
                          />
                          <span className="text-sm text-[#444] group-hover:text-[#222] transition-colors">
                            All Rating
                          </span>
                        </label>

                        {options.map(({ slug, name }) => (
                          <label key={slug} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={localRating === slug}
                              onChange={() =>
                                setLocalRating(prev => (prev === slug ? "" : slug))
                              }
                              className="w-4 h-4 rounded accent-[#A8DD15] cursor-pointer"
                            />
                            <span className="text-sm text-[#444] group-hover:text-[#222] transition-colors line-clamp-1">
                              {name as string}
                            </span>
                          </label>
                        ))}
                      </>
                    )}
                    {type === "features" && (
                      <>
                        {/* "All Features" option */}
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={localFeatures.length === 0}
                            onChange={() => setLocalFeatures([])}
                            className="w-4 h-4 rounded accent-[#A8DD15] cursor-pointer"
                          />
                          <span className="text-sm text-[#444] group-hover:text-[#222] transition-colors">
                            All Features
                          </span>
                        </label>

                        {[
                          "Islamic Account",
                          "Copy Trading",
                          "Demo Account",
                          "India Available"
                        ].map((feature) => (
                          <label key={feature} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={localFeatures.includes(feature)}
                              onChange={() =>
                                setLocalFeatures(prev =>
                                  prev.includes(feature)
                                    ? prev.filter(f => f !== feature)
                                    : [...prev, feature]
                                )
                              }
                              className="w-4 h-4 rounded accent-[#A8DD15] cursor-pointer"
                            />
                            <span className="text-sm text-[#444] group-hover:text-[#222] transition-colors line-clamp-1">
                              {feature}
                            </span>
                          </label>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer actions */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-[#E5E7E0] bg-white">
          <button
            type="button"
            onClick={handleClear}
            className="flex-1 py-3 rounded-lg border cursor-pointer border-[#E5E7E0] text-sm font-medium text-[#444] hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-3 rounded-lg bg-[#A8DD15] text-sm font-medium cursor-pointer rounded-full text-black100 hover:bg-[#97c813] active:bg-[#85b311] transition-colors"
          >
            Show Result
          </button>
        </div>
      </div>
    </>
  )
}
