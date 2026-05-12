"use client"

import { ChevronDown, ChevronUp, SlidersHorizontal, X } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { useEffect, useState } from "react"
import { useFilters } from "~/contexts/filter-context"
import { findFilterOptionsWithCategory } from "~/server/web/actions/filters-with-category"
import type { ToolFilterSchema } from "~/server/web/tools/schema"


interface BrokerFilterModalProps {
  category?: string
}

export const BrokerFilterModal = ({ category }: BrokerFilterModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [localCategory, setLocalCategory] = useState<string>("")
  const [localRegulators, setLocalRegulators] = useState<string[]>([])
  const [localPlatforms, setLocalPlatforms] = useState<string[]>([])
  const [localRating, setLocalRating] = useState<string>("")
  const [localFeatures, setLocalFeatures] = useState<string[]>([])
  // Forex education state
  const [localSkillLevel, setLocalSkillLevel] = useState<string>("")
  const [localLearningFormat, setLocalLearningFormat] = useState<string[]>([])
  const [localPricing, setLocalPricing] = useState<string>("")
  const [localEducationFeatures, setLocalEducationFeatures] = useState<string[]>([])
  const [localLocationLanguage, setLocalLocationLanguage] = useState<string[]>([])
  // Bridge & Plugin state
  const [localSolutionType, setLocalSolutionType] = useState<string>("")
  const [localCompatiblePlatform, setLocalCompatiblePlatform] = useState<string[]>([])
  const [localTargetClient, setLocalTargetClient] = useState<string[]>([])
  const [localHqRegion, setLocalHqRegion] = useState<string[]>([])
  // Liquidity Provider state
  const [localRegulation, setLocalRegulation] = useState<string[]>([])
  const [localAssetClass, setLocalAssetClass] = useState<string[]>([])
  const [localExecutionType, setLocalExecutionType] = useState<string[]>([])
  const [localProviderType, setLocalProviderType] = useState<string[]>([])
  // PSP Partner state
  const [localPaymentType, setLocalPaymentType] = useState<string[]>([])
  const [localSettlementCurrency, setLocalSettlementCurrency] = useState<string[]>([])
  const [localIntegrationType, setLocalIntegrationType] = useState<string[]>([])
  const [localPspFeatures, setLocalPspFeatures] = useState<string[]>([])
  // Trading Platform state
  const [localPlatformType, setLocalPlatformType] = useState<string[]>([])
  const [localPropFirm, setLocalPropFirm] = useState<string[]>([])
  const [localDeployment, setLocalDeployment] = useState<string[]>([])
  const [localBestFor, setLocalBestFor] = useState<string[]>([])
  const [localPlatformFeatures, setLocalPlatformFeatures] = useState<string[]>([])
  const [expandedSections, setExpandedSections] = useState<string[]>(["category", "features"])
  const { filters, updateFilters } = useFilters<ToolFilterSchema>()
  const { result, execute } = useAction(findFilterOptionsWithCategory)

  useEffect(() => {
    execute({ category })
  }, [execute, category])

  // Sync local state when opening modal
  useEffect(() => {
    if (isOpen) {
      setLocalCategory(filters.category || "")
      setLocalRegulators(filters.regulators ? filters.regulators.split(",") : [])
      setLocalPlatforms(filters.platforms ? filters.platforms.split(",") : [])
      setLocalRating(filters.rating || "")
      setLocalFeatures(filters.features ? filters.features.split(",") : [])
      // Sync forex education filters
      setLocalSkillLevel(filters.skillLevel || "")
      setLocalLearningFormat(filters.learningFormat ? filters.learningFormat.split(",") : [])
      setLocalPricing(filters.pricing || "")
      setLocalEducationFeatures(filters.educationFeatures ? filters.educationFeatures.split(",") : [])
      setLocalLocationLanguage(filters.locationLanguage ? filters.locationLanguage.split(",") : [])
      // Sync bridge & plugin filters
      setLocalSolutionType(filters.solutionType || "")
      setLocalCompatiblePlatform(filters.compatiblePlatform ? filters.compatiblePlatform.split(",") : [])
      setLocalTargetClient(filters.targetClient ? filters.targetClient.split(",") : [])
      setLocalHqRegion(filters.hqRegion ? filters.hqRegion.split(",") : [])
      // Sync liquidity provider filters
      setLocalRegulation(filters.regulation ? filters.regulation.split(",") : [])
      setLocalAssetClass(filters.assetClass ? filters.assetClass.split(",") : [])
      setLocalExecutionType(filters.executionType ? filters.executionType.split(",") : [])
      setLocalProviderType(filters.providerType ? filters.providerType.split(",") : [])
      // Sync PSP partner filters
      setLocalPaymentType(filters.paymentType ? filters.paymentType.split(",") : [])
      setLocalSettlementCurrency(filters.settlementCurrency ? filters.settlementCurrency.split(",") : [])
      setLocalIntegrationType(filters.integrationType ? filters.integrationType.split(",") : [])
      setLocalPspFeatures(filters.pspFeatures ? filters.pspFeatures.split(",") : [])
      // Sync trading platform filters
      setLocalPlatformType(filters.platformType ? filters.platformType.split(",") : [])
      setLocalPropFirm(filters.propFirm ? filters.propFirm.split(",") : [])
      setLocalDeployment(filters.deployment ? filters.deployment.split(",") : [])
      setLocalBestFor(filters.bestFor ? filters.bestFor.split(",") : [])
      setLocalPlatformFeatures(filters.platformFeatures ? filters.platformFeatures.split(",") : [])
    }
  }, [isOpen, filters.category, filters.regulators, filters.platforms, filters.rating, filters.features, filters.skillLevel, filters.learningFormat, filters.pricing, filters.educationFeatures, filters.locationLanguage, filters.solutionType, filters.compatiblePlatform, filters.targetClient, filters.hqRegion, filters.regulation, filters.assetClass, filters.executionType, filters.providerType, filters.paymentType, filters.settlementCurrency, filters.integrationType, filters.pspFeatures, filters.platformType, filters.propFirm, filters.deployment, filters.bestFor, filters.platformFeatures])

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
      features: localFeatures.join(","),
      // Apply forex education filters
      skillLevel: localSkillLevel,
      learningFormat: localLearningFormat.join(","),
      pricing: localPricing,
      educationFeatures: localEducationFeatures.join(","),
      locationLanguage: localLocationLanguage.join(","),
      // Apply bridge & plugin filters
      solutionType: localSolutionType,
      compatiblePlatform: localCompatiblePlatform.join(","),
      targetClient: localTargetClient.join(","),
      hqRegion: localHqRegion.join(","),
      // Apply liquidity provider filters
      regulation: localRegulation.join(","),
      assetClass: localAssetClass.join(","),
      executionType: localExecutionType.join(","),
      providerType: localProviderType.join(","),
      // Apply PSP partner filters
      paymentType: localPaymentType.join(","),
      settlementCurrency: localSettlementCurrency.join(","),
      integrationType: localIntegrationType.join(","),
      pspFeatures: localPspFeatures.join(","),
      // Apply trading platform filters
      platformType: localPlatformType.join(","),
      propFirm: localPropFirm.join(","),
      deployment: localDeployment.join(","),
      bestFor: localBestFor.join(","),
      platformFeatures: localPlatformFeatures.join(",")
    })
    setIsOpen(false)
  }

  const handleClear = () => {
    setLocalCategory("")
    setLocalRegulators([])
    setLocalPlatforms([])
    setLocalRating("")
    setLocalFeatures([])
    // Clear forex education filters
    setLocalSkillLevel("")
    setLocalLearningFormat([])
    setLocalPricing("")
    setLocalEducationFeatures([])
    setLocalLocationLanguage([])
    // Clear bridge & plugin filters
    setLocalSolutionType("")
    setLocalCompatiblePlatform([])
    setLocalTargetClient([])
    setLocalHqRegion([])
    // Clear liquidity provider filters
    setLocalRegulation([])
    setLocalAssetClass([])
    setLocalExecutionType([])
    setLocalProviderType([])
    // Clear PSP partner filters
    setLocalPaymentType([])
    setLocalSettlementCurrency([])
    setLocalIntegrationType([])
    setLocalPspFeatures([])
    // Clear trading platform filters
    setLocalPlatformType([])
    setLocalPropFirm([])
    setLocalDeployment([])
    setLocalBestFor([])
    setLocalPlatformFeatures([])
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
      solutionType: "",
      compatiblePlatform: "",
      targetClient: "",
      hqRegion: "",
      regulation: "",
      assetClass: "",
      executionType: "",
      providerType: "",
      paymentType: "",
      settlementCurrency: "",
      integrationType: "",
      pspFeatures: "",
      platformType: "",
      propFirm: "",
      deployment: "",
      bestFor: "",
      platformFeatures: ""
    })
    setIsOpen(false)
  }

  const activeCount =
    (filters.category ? 1 : 0) +
    (filters.regulators ? filters.regulators.split(",").length : 0) +
    (filters.platforms ? filters.platforms.split(",").length : 0) +
    (filters.rating ? 1 : 0) +
    (filters.features ? filters.features.split(",").length : 0) +
    (filters.skillLevel ? 1 : 0) +
    (filters.learningFormat ? filters.learningFormat.split(",").length : 0) +
    (filters.pricing ? 1 : 0) +
    (filters.educationFeatures ? filters.educationFeatures.split(",").length : 0) +
    (filters.locationLanguage ? filters.locationLanguage.split(",").length : 0) +
    (filters.solutionType ? 1 : 0) +
    (filters.compatiblePlatform ? filters.compatiblePlatform.split(",").length : 0) +
    (filters.targetClient ? filters.targetClient.split(",").length : 0) +
    (filters.hqRegion ? filters.hqRegion.split(",").length : 0) +
    (filters.regulation ? filters.regulation.split(",").length : 0) +
    (filters.assetClass ? filters.assetClass.split(",").length : 0) +
    (filters.executionType ? filters.executionType.split(",").length : 0) +
    (filters.providerType ? filters.providerType.split(",").length : 0) +
    (filters.paymentType ? filters.paymentType.split(",").length : 0) +
    (filters.settlementCurrency ? filters.settlementCurrency.split(",").length : 0) +
    (filters.integrationType ? filters.integrationType.split(",").length : 0) +
    (filters.pspFeatures ? filters.pspFeatures.split(",").length : 0) +
    (filters.platformType ? filters.platformType.split(",").length : 0) +
    (filters.propFirm ? filters.propFirm.split(",").length : 0) +
    (filters.deployment ? filters.deployment.split(",").length : 0) +
    (filters.bestFor ? filters.bestFor.split(",").length : 0) +
    (filters.platformFeatures ? filters.platformFeatures.split(",").length : 0)

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
    } else if (filterType === 'platformType') {
      const currentPlatformTypes = filters.platformType ? filters.platformType.split(",") : []
      const newPlatformTypes = currentPlatformTypes.filter(p => p !== value)
      updateFilters({ platformType: newPlatformTypes.join(",") })
    } else if (filterType === 'propFirm') {
      const currentPropFirms = filters.propFirm ? filters.propFirm.split(",") : []
      const newPropFirms = currentPropFirms.filter(p => p !== value)
      updateFilters({ propFirm: newPropFirms.join(",") })
    } else if (filterType === 'deployment') {
      const currentDeployments = filters.deployment ? filters.deployment.split(",") : []
      const newDeployments = currentDeployments.filter(d => d !== value)
      updateFilters({ deployment: newDeployments.join(",") })
    } else if (filterType === 'bestFor') {
      const currentBestFor = filters.bestFor ? filters.bestFor.split(",") : []
      const newBestFor = currentBestFor.filter(b => b !== value)
      updateFilters({ bestFor: newBestFor.join(",") })
    } else if (filterType === 'platformFeatures') {
      const currentPlatformFeatures = filters.platformFeatures ? filters.platformFeatures.split(",") : []
      const newPlatformFeatures = currentPlatformFeatures.filter(f => f !== value)
      updateFilters({ platformFeatures: newPlatformFeatures.join(",") })
    }
  }

  const sectionLabel = (type: string) => {
    const labels: Record<string, string> = {
      category: "CATEGORY",
      regulators: "REGULATORS",
      platforms: "PLATFORMS",
      rating: "RATING",
      features: "FEATURES",
      skillLevel: "SKILL LEVEL",
      learningFormat: "LEARNING FORMAT",
      pricing: "PRICING",
      educationFeatures: "EDUCATION FEATURES",
      locationLanguage: "LOCATION/LANGUAGE",
      solutionType: "SOLUTION TYPE",
      compatiblePlatform: "COMPATIBLE PLATFORM",
      targetClient: "TARGET CLIENT",
      hqRegion: "HQ / REGION",
      regulation: "REGULATION",
      assetClass: "ASSETCLASS",
      executionType: "EXECUTIONTYPE",
      providerType: "PROVIDERTYPE",
      paymentType: "PAYMENT TYPE",
      settlementCurrency: "SETTLEMENT CURRENCY",
      integrationType: "INTEGRATION TYPE",
      pspFeatures: "FEATURES",
      platformType: "PLATFORM TYPE",
      propFirm: "PROP FIRM",
      deployment: "DEPLOYMENT",
      bestFor: "BEST FOR",
      platformFeatures: "PLATFORM FEATURES"
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
                    {type === "skillLevel" && (
                      <>
                        {/* "All Skill Levels" option */}
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={localSkillLevel === ""}
                            onChange={() => setLocalSkillLevel("")}
                            className="w-4 h-4 rounded accent-[#A8DD15] cursor-pointer"
                          />
                          <span className="text-sm text-[#444] group-hover:text-[#222] transition-colors">
                            All Skill Levels
                          </span>
                        </label>

                        {options.map(({ slug, name }) => (
                          <label key={slug} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={localSkillLevel === slug}
                              onChange={() =>
                                setLocalSkillLevel(prev => (prev === slug ? "" : slug))
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
                    {type === "learningFormat" && (
                      <>
                        {/* "All Formats" option */}
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={localLearningFormat.length === 0}
                            onChange={() => setLocalLearningFormat([])}
                            className="w-4 h-4 rounded accent-[#A8DD15] cursor-pointer"
                          />
                          <span className="text-sm text-[#444] group-hover:text-[#222] transition-colors">
                            All Formats
                          </span>
                        </label>

                        {options.map(({ slug, name }) => (
                          <label key={slug} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={localLearningFormat.includes(slug)}
                              onChange={() =>
                                setLocalLearningFormat(prev =>
                                  prev.includes(slug)
                                    ? prev.filter(f => f !== slug)
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
                    {type === "pricing" && (
                      <>
                        {/* "All Pricing" option */}
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={localPricing === ""}
                            onChange={() => setLocalPricing("")}
                            className="w-4 h-4 rounded accent-[#A8DD15] cursor-pointer"
                          />
                          <span className="text-sm text-[#444] group-hover:text-[#222] transition-colors">
                            All Pricing
                          </span>
                        </label>

                        {options.map(({ slug, name }) => (
                          <label key={slug} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={localPricing === slug}
                              onChange={() =>
                                setLocalPricing(prev => (prev === slug ? "" : slug))
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
                    {type === "educationFeatures" && (
                      <>
                        {/* "All Education Features" option */}
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={localEducationFeatures.length === 0}
                            onChange={() => setLocalEducationFeatures([])}
                            className="w-4 h-4 rounded accent-[#A8DD15] cursor-pointer"
                          />
                          <span className="text-sm text-[#444] group-hover:text-[#222] transition-colors">
                            All Education Features
                          </span>
                        </label>

                        {options.map(({ slug, name }) => (
                          <label key={slug} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={localEducationFeatures.includes(slug)}
                              onChange={() =>
                                setLocalEducationFeatures(prev =>
                                  prev.includes(slug)
                                    ? prev.filter(f => f !== slug)
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
                    {type === "locationLanguage" && (
                      <>
                        {/* "All Locations/Languages" option */}
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={localLocationLanguage.length === 0}
                            onChange={() => setLocalLocationLanguage([])}
                            className="w-4 h-4 rounded accent-[#A8DD15] cursor-pointer"
                          />
                          <span className="text-sm text-[#444] group-hover:text-[#222] transition-colors">
                            All Locations/Languages
                          </span>
                        </label>

                        {options.map(({ slug, name }) => (
                          <label key={slug} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={localLocationLanguage.includes(slug)}
                              onChange={() =>
                                setLocalLocationLanguage(prev =>
                                  prev.includes(slug)
                                    ? prev.filter(l => l !== slug)
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
                    {type === "solutionType" && (
                      <>
                        {/* "All Solution Types" option */}
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={localSolutionType === ""}
                            onChange={() => setLocalSolutionType("")}
                            className="w-4 h-4 rounded accent-[#A8DD15] cursor-pointer"
                          />
                          <span className="text-sm text-[#444] group-hover:text-[#222] transition-colors">
                            All Solution Types
                          </span>
                        </label>

                        {options.map(({ slug, name }) => (
                          <label key={slug} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={localSolutionType === slug}
                              onChange={() =>
                                setLocalSolutionType(prev => (prev === slug ? "" : slug))
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
                    {type === "compatiblePlatform" && (
                      <>
                        {/* "All Platforms" option */}
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={localCompatiblePlatform.length === 0}
                            onChange={() => setLocalCompatiblePlatform([])}
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
                              checked={localCompatiblePlatform.includes(slug)}
                              onChange={() =>
                                setLocalCompatiblePlatform(prev =>
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
                    {type === "targetClient" && (
                      <>
                        {/* "All Target Clients" option */}
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={localTargetClient.length === 0}
                            onChange={() => setLocalTargetClient([])}
                            className="w-4 h-4 rounded accent-[#A8DD15] cursor-pointer"
                          />
                          <span className="text-sm text-[#444] group-hover:text-[#222] transition-colors">
                            All Target Clients
                          </span>
                        </label>

                        {options.map(({ slug, name }) => (
                          <label key={slug} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={localTargetClient.includes(slug)}
                              onChange={() =>
                                setLocalTargetClient(prev =>
                                  prev.includes(slug)
                                    ? prev.filter(c => c !== slug)
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
                    {type === "hqRegion" && (
                      <>
                        {/* "All Regions" option */}
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={localHqRegion.length === 0}
                            onChange={() => setLocalHqRegion([])}
                            className="w-4 h-4 rounded accent-[#A8DD15] cursor-pointer"
                          />
                          <span className="text-sm text-[#444] group-hover:text-[#222] transition-colors">
                            All Regions
                          </span>
                        </label>

                        {options.map(({ slug, name }) => (
                          <label key={slug} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={localHqRegion.includes(slug)}
                              onChange={() =>
                                setLocalHqRegion(prev =>
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
                    {type === "regulation" && (
                      <>
                        {/* "All Regulation" option */}
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={localRegulation.length === 0}
                            onChange={() => setLocalRegulation([])}
                            className="w-4 h-4 rounded accent-[#A8DD15] cursor-pointer"
                          />
                          <span className="text-sm text-[#444] group-hover:text-[#222] transition-colors">
                            All Regulation
                          </span>
                        </label>

                        {options.map(({ slug, name }) => (
                          <label key={slug} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={localRegulation.includes(slug)}
                              onChange={() =>
                                setLocalRegulation(prev =>
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
                    {type === "assetClass" && (
                      <>
                        {/* "All Asset Classes" option */}
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={localAssetClass.length === 0}
                            onChange={() => setLocalAssetClass([])}
                            className="w-4 h-4 rounded accent-[#A8DD15] cursor-pointer"
                          />
                          <span className="text-sm text-[#444] group-hover:text-[#222] transition-colors">
                            All Asset Classes
                          </span>
                        </label>

                        {options.map(({ slug, name }) => (
                          <label key={slug} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={localAssetClass.includes(slug)}
                              onChange={() =>
                                setLocalAssetClass(prev =>
                                  prev.includes(slug)
                                    ? prev.filter(a => a !== slug)
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
                    {type === "executionType" && (
                      <>
                        {/* "All Execution Types" option */}
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={localExecutionType.length === 0}
                            onChange={() => setLocalExecutionType([])}
                            className="w-4 h-4 rounded accent-[#A8DD15] cursor-pointer"
                          />
                          <span className="text-sm text-[#444] group-hover:text-[#222] transition-colors">
                            All Execution Types
                          </span>
                        </label>

                        {options.map(({ slug, name }) => (
                          <label key={slug} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={localExecutionType.includes(slug)}
                              onChange={() =>
                                setLocalExecutionType(prev =>
                                  prev.includes(slug)
                                    ? prev.filter(e => e !== slug)
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
                    {type === "providerType" && (
                      <>
                        {/* "All Provider Types" option */}
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={localProviderType.length === 0}
                            onChange={() => setLocalProviderType([])}
                            className="w-4 h-4 rounded accent-[#A8DD15] cursor-pointer"
                          />
                          <span className="text-sm text-[#444] group-hover:text-[#222] transition-colors">
                            All Provider Types
                          </span>
                        </label>

                        {options.map(({ slug, name }) => (
                          <label key={slug} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={localProviderType.includes(slug)}
                              onChange={() =>
                                setLocalProviderType(prev =>
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
                    {type === "paymentType" && (
                      <>
                        {/* "All Payment Types" option */}
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={localPaymentType.length === 0}
                            onChange={() => setLocalPaymentType([])}
                            className="w-4 h-4 rounded accent-[#A8DD15] cursor-pointer"
                          />
                          <span className="text-sm text-[#444] group-hover:text-[#222] transition-colors">
                            All Payment Types
                          </span>
                        </label>

                        {options.map(({ slug, name }) => (
                          <label key={slug} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={localPaymentType.includes(slug)}
                              onChange={() =>
                                setLocalPaymentType(prev =>
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
                    {type === "settlementCurrency" && (
                      <>
                        {/* "All Settlement Currencies" option */}
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={localSettlementCurrency.length === 0}
                            onChange={() => setLocalSettlementCurrency([])}
                            className="w-4 h-4 rounded accent-[#A8DD15] cursor-pointer"
                          />
                          <span className="text-sm text-[#444] group-hover:text-[#222] transition-colors">
                            All Settlement Currencies
                          </span>
                        </label>

                        {options.map(({ slug, name }) => (
                          <label key={slug} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={localSettlementCurrency.includes(slug)}
                              onChange={() =>
                                setLocalSettlementCurrency(prev =>
                                  prev.includes(slug)
                                    ? prev.filter(s => s !== slug)
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
                    {type === "integrationType" && (
                      <>
                        {/* "All Integration Types" option */}
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={localIntegrationType.length === 0}
                            onChange={() => setLocalIntegrationType([])}
                            className="w-4 h-4 rounded accent-[#A8DD15] cursor-pointer"
                          />
                          <span className="text-sm text-[#444] group-hover:text-[#222] transition-colors">
                            All Integration Types
                          </span>
                        </label>

                        {options.map(({ slug, name }) => (
                          <label key={slug} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={localIntegrationType.includes(slug)}
                              onChange={() =>
                                setLocalIntegrationType(prev =>
                                  prev.includes(slug)
                                    ? prev.filter(i => i !== slug)
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
                    {type === "pspFeatures" && (
                      <>
                        {/* "All Features" option */}
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={localPspFeatures.length === 0}
                            onChange={() => setLocalPspFeatures([])}
                            className="w-4 h-4 rounded accent-[#A8DD15] cursor-pointer"
                          />
                          <span className="text-sm text-[#444] group-hover:text-[#222] transition-colors">
                            All Features
                          </span>
                        </label>

                        {options.map(({ slug, name }) => (
                          <label key={slug} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={localPspFeatures.includes(slug)}
                              onChange={() =>
                                setLocalPspFeatures(prev =>
                                  prev.includes(slug)
                                    ? prev.filter(f => f !== slug)
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
                    {type === "platformType" && (
                      <>
                        {/* "All Platform Types" option */}
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={localPlatformType.length === 0}
                            onChange={() => setLocalPlatformType([])}
                            className="w-4 h-4 rounded accent-[#A8DD15] cursor-pointer"
                          />
                          <span className="text-sm text-[#444] group-hover:text-[#222] transition-colors">
                            All Platform Types
                          </span>
                        </label>

                        {options.map(({ slug, name }) => (
                          <label key={slug} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={localPlatformType.includes(slug)}
                              onChange={() =>
                                setLocalPlatformType(prev =>
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
                    {type === "propFirm" && (
                      <>
                        {/* "All Prop Firm Support" option */}
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={localPropFirm.length === 0}
                            onChange={() => setLocalPropFirm([])}
                            className="w-4 h-4 rounded accent-[#A8DD15] cursor-pointer"
                          />
                          <span className="text-sm text-[#444] group-hover:text-[#222] transition-colors">
                            All Prop Firm Support
                          </span>
                        </label>

                        {options.map(({ slug, name }) => (
                          <label key={slug} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={localPropFirm.includes(slug)}
                              onChange={() =>
                                setLocalPropFirm(prev =>
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
                    {type === "deployment" && (
                      <>
                        {/* "All Deployment Types" option */}
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={localDeployment.length === 0}
                            onChange={() => setLocalDeployment([])}
                            className="w-4 h-4 rounded accent-[#A8DD15] cursor-pointer"
                          />
                          <span className="text-sm text-[#444] group-hover:text-[#222] transition-colors">
                            All Deployment Types
                          </span>
                        </label>

                        {options.map(({ slug, name }) => (
                          <label key={slug} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={localDeployment.includes(slug)}
                              onChange={() =>
                                setLocalDeployment(prev =>
                                  prev.includes(slug)
                                    ? prev.filter(d => d !== slug)
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
                    {type === "bestFor" && (
                      <>
                        {/* "All Best For" option */}
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={localBestFor.length === 0}
                            onChange={() => setLocalBestFor([])}
                            className="w-4 h-4 rounded accent-[#A8DD15] cursor-pointer"
                          />
                          <span className="text-sm text-[#444] group-hover:text-[#222] transition-colors">
                            All Best For
                          </span>
                        </label>

                        {options.map(({ slug, name }) => (
                          <label key={slug} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={localBestFor.includes(slug)}
                              onChange={() =>
                                setLocalBestFor(prev =>
                                  prev.includes(slug)
                                    ? prev.filter(b => b !== slug)
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
                    {type === "platformFeatures" && (
                      <>
                        {/* "All Platform Features" option */}
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={localPlatformFeatures.length === 0}
                            onChange={() => setLocalPlatformFeatures([])}
                            className="w-4 h-4 rounded accent-[#A8DD15] cursor-pointer"
                          />
                          <span className="text-sm text-[#444] group-hover:text-[#222] transition-colors">
                            All Platform Features
                          </span>
                        </label>

                        {options.map(({ slug, name }) => (
                          <label key={slug} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={localPlatformFeatures.includes(slug)}
                              onChange={() =>
                                setLocalPlatformFeatures(prev =>
                                  prev.includes(slug)
                                    ? prev.filter(f => f !== slug)
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
                  </div>
                )}
              </div>
            )
          }
          )}
        
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
