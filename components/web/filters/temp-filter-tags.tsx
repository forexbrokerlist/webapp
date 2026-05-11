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
  skillLevel?: string
  learningFormat?: string
  pricing?: string
  educationFeatures?: string
  locationLanguage?: string
  // Bridge & Plugin fields
  solutionType?: string
  compatiblePlatform?: string
  targetClient?: string
  hqRegion?: string
}

export const FilterTags = ({ category, regulators, platforms, rating, features, skillLevel, learningFormat, pricing, educationFeatures, locationLanguage, solutionType, compatiblePlatform, targetClient, hqRegion }: FilterTagsProps) => {
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
    } else if (filterType === 'skillLevel') {
      updateFilters({ skillLevel: filters.skillLevel === value ? "" : value })
    } else if (filterType === 'learningFormat') {
      const currentFormats = filters.learningFormat ? filters.learningFormat.split(",") : []
      const newFormats = currentFormats.filter(f => f !== value)
      updateFilters({ learningFormat: newFormats.join(",") })
    } else if (filterType === 'pricing') {
      updateFilters({ pricing: filters.pricing === value ? "" : value })
    } else if (filterType === 'educationFeatures') {
      const currentEduFeatures = filters.educationFeatures ? filters.educationFeatures.split(",") : []
      const newEduFeatures = currentEduFeatures.filter(f => f !== value)
      updateFilters({ educationFeatures: newEduFeatures.join(",") })
    } else if (filterType === 'locationLanguage') {
      const currentLocations = filters.locationLanguage ? filters.locationLanguage.split(",") : []
      const newLocations = currentLocations.filter(l => l !== value)
      updateFilters({ locationLanguage: newLocations.join(",") })
    } else if (filterType === 'solutionType') {
      updateFilters({ solutionType: filters.solutionType === value ? "" : value })
    } else if (filterType === 'compatiblePlatform') {
      const currentPlatforms = filters.compatiblePlatform ? filters.compatiblePlatform.split(",") : []
      const newPlatforms = currentPlatforms.filter(p => p !== value)
      updateFilters({ compatiblePlatform: newPlatforms.join(",") })
    } else if (filterType === 'targetClient') {
      const currentClients = filters.targetClient ? filters.targetClient.split(",") : []
      const newClients = currentClients.filter(c => c !== value)
      updateFilters({ targetClient: newClients.join(",") })
    } else if (filterType === 'hqRegion') {
      const currentRegions = filters.hqRegion ? filters.hqRegion.split(",") : []
      const newRegions = currentRegions.filter(r => r !== value)
      updateFilters({ hqRegion: newRegions.join(",") })
    }
  }

  const resetAllFilters = () => {
    updateFilters({
      category: "",
      regulators: "",
      platforms: "",
      rating: "",
      features: "",
      skillLevel: "",
      learningFormat: "",
      pricing: "",
      educationFeatures: "",
      locationLanguage: "",
      // Bridge & Plugin fields
      solutionType: "",
      compatiblePlatform: "",
      targetClient: "",
      hqRegion: "",
      q: ""
    })
  }

  const hasActiveFilters = !!(category || regulators || platforms || rating || features || skillLevel || learningFormat || pricing || educationFeatures || locationLanguage || solutionType || compatiblePlatform || targetClient || hqRegion)

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

      {skillLevel && (
        <span className="inline-flex items-center gap-1 px-4 py-2 bg-[#E9EAE3] text-[#1A1A1A] rounded-full text-sm font-medium">
          {skillLevel}
          <button
            type="button"
            onClick={() => removeFilter('skillLevel', skillLevel)}
            className="ml-1 text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X size={12} />
          </button>
        </span>
      )}

      {learningFormat && learningFormat.split(",").map((format, index) => (
        <span key={format} className="inline-flex items-center gap-1 px-4 py-2 bg-[#E9EAE3] text-[#1A1A1A] rounded-full text-sm font-medium">
          {format.trim()}
          <button
            type="button"
            onClick={() => removeFilter('learningFormat', format.trim())}
            className="ml-1 text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X size={12} />
          </button>
        </span>
      ))}

      {pricing && (
        <span className="inline-flex items-center gap-1 px-4 py-2 bg-[#E9EAE3] text-[#1A1A1A] rounded-full text-sm font-medium">
          {pricing}
          <button
            type="button"
            onClick={() => removeFilter('pricing', pricing)}
            className="ml-1 text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X size={12} />
          </button>
        </span>
      )}

      {educationFeatures && educationFeatures.split(",").map((feature: string, index: number) => (
        <span key={feature} className="inline-flex items-center gap-1 px-4 py-2 bg-[#E9EAE3] text-[#1A1A1A] rounded-full text-sm font-medium">
          {feature.trim()}
          <button
            type="button"
            onClick={() => removeFilter('educationFeatures', feature.trim())}
            className="ml-1 text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X size={12} />
          </button>
        </span>
      ))}

      {locationLanguage && locationLanguage.split(",").map((location, index) => (
        <span key={location} className="inline-flex items-center gap-1 px-4 py-2 bg-[#E9EAE3] text-[#1A1A1A] rounded-full text-sm font-medium">
          {location.trim()}
          <button
            type="button"
            onClick={() => removeFilter('locationLanguage', location.trim())}
            className="ml-1 text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X size={12} />
          </button>
        </span>
      ))}

      {solutionType && (
        <span className="inline-flex items-center gap-1 px-4 py-2 bg-[#E9EAE3] text-[#1A1A1A] rounded-full text-sm font-medium">
          {solutionType}
          <button
            type="button"
            onClick={() => removeFilter('solutionType', solutionType)}
            className="ml-1 text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X size={12} />
          </button>
        </span>
      )}

      {compatiblePlatform && compatiblePlatform.split(",").map((platform, index) => (
        <span key={platform} className="inline-flex items-center gap-1 px-4 py-2 bg-[#E9EAE3] text-[#1A1A1A] rounded-full text-sm font-medium">
          {platform.trim()}
          <button
            type="button"
            onClick={() => removeFilter('compatiblePlatform', platform.trim())}
            className="ml-1 text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X size={12} />
          </button>
        </span>
      ))}

      {targetClient && targetClient.split(",").map((client, index) => (
        <span key={client} className="inline-flex items-center gap-1 px-4 py-2 bg-[#E9EAE3] text-[#1A1A1A] rounded-full text-sm font-medium">
          {client.trim()}
          <button
            type="button"
            onClick={() => removeFilter('targetClient', client.trim())}
            className="ml-1 text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X size={12} />
          </button>
        </span>
      ))}

      {hqRegion && hqRegion.split(",").map((region, index) => (
        <span key={region} className="inline-flex items-center gap-1 px-4 py-2 bg-[#E9EAE3] text-[#1A1A1A] rounded-full text-sm font-medium">
          {region.trim()}
          <button
            type="button"
            onClick={() => removeFilter('hqRegion', region.trim())}
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
