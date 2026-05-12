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
  // Liquidity Partner fields
  regulation?: string
  assetClass?: string
  executionType?: string
  providerType?: string
  // PSP Partner fields
  paymentType?: string
  settlementCurrency?: string
  integrationType?: string
  pspFeatures?: string
  // Trading Platform fields
  platformType?: string
  propFirm?: string
  deployment?: string
  bestFor?: string
  platformFeatures?: string
  // Algo Trading fields
  botStrategyType?: string
  automationLevel?: string
  pricingModel?: string
  algoFeatures?: string
}

// Helper function to map filter slugs to display names
const getFilterDisplayName = (slug: string, filterType: string): string => {
  switch (filterType) {
    case 'paymentType':
      const paymentTypeMap: Record<string, string> = {
        'crypto_gateway': 'Crypto gateway',
        'card_processing': 'Card processing',
        'bank_transfer': 'Bank transfer',
        'e_wallet': 'E-wallet',
        'local_payments': 'Local payments',
        'open_banking': 'Open banking'
      }
      return paymentTypeMap[slug] || slug

    case 'settlementCurrency':
      const currencyMap: Record<string, string> = {
        'usd': 'USD',
        'eur': 'EUR',
        'usdt': 'USDT',
        'gbp': 'GBP',
        'multi_fiat': 'Multi-fiat',
        'crypto_only': 'Crypto only'
      }
      return currencyMap[slug] || slug

    case 'integrationType':
      const integrationMap: Record<string, string> = {
        'api': 'API',
        'plugin': 'Plugin',
        'hosted_checkout': 'Hosted checkout',
        'mass_payout': 'Mass payout',
        'white_label': 'White label'
      }
      return integrationMap[slug] || slug

    case 'pspFeatures':
      const featureMap: Record<string, string> = {
        'auto_fiat_conversion': 'Auto fiat conversion',
        'instant_settlement': 'Instant settlement',
        'invoice_payments': 'Invoice payments',
        'recurring_billing': 'Recurring billing',
        'chargeback_protection': 'Chargeback protection'
      }
      return featureMap[slug] || slug

    default:
      return slug
  }
}

export const FilterTags = ({ category, regulators, platforms, rating, features, skillLevel, learningFormat, pricing, educationFeatures, locationLanguage, solutionType, compatiblePlatform, targetClient, hqRegion, regulation, assetClass, executionType, providerType, paymentType, settlementCurrency, integrationType, pspFeatures, platformType, propFirm, deployment, bestFor, platformFeatures, botStrategyType, automationLevel, pricingModel, algoFeatures }: FilterTagsProps) => {
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
    } else if (filterType === 'regulation') {
      const currentRegulation = filters.regulation ? filters.regulation.split(",") : []
      const newRegulation = currentRegulation.filter(r => r !== value)
      updateFilters({ regulation: newRegulation.join(",") })
    } else if (filterType === 'assetClass') {
      const currentAssetClass = filters.assetClass ? filters.assetClass.split(",") : []
      const newAssetClass = currentAssetClass.filter(a => a !== value)
      updateFilters({ assetClass: newAssetClass.join(",") })
    } else if (filterType === 'executionType') {
      const currentExecutionType = filters.executionType ? filters.executionType.split(",") : []
      const newExecutionType = currentExecutionType.filter(e => e !== value)
      updateFilters({ executionType: newExecutionType.join(",") })
    } else if (filterType === 'providerType') {
      const currentProviderType = filters.providerType ? filters.providerType.split(",") : []
      const newProviderType = currentProviderType.filter(p => p !== value)
      updateFilters({ providerType: newProviderType.join(",") })
    } else if (filterType === 'paymentType') {
      const currentPaymentType = filters.paymentType ? filters.paymentType.split(",") : []
      const newPaymentType = currentPaymentType.filter(p => p !== value)
      updateFilters({ paymentType: newPaymentType.join(",") })
    } else if (filterType === 'settlementCurrency') {
      const currentSettlementCurrency = filters.settlementCurrency ? filters.settlementCurrency.split(",") : []
      const newSettlementCurrency = currentSettlementCurrency.filter(s => s !== value)
      updateFilters({ settlementCurrency: newSettlementCurrency.join(",") })
    } else if (filterType === 'integrationType') {
      const currentIntegrationType = filters.integrationType ? filters.integrationType.split(",") : []
      const newIntegrationType = currentIntegrationType.filter(i => i !== value)
      updateFilters({ integrationType: newIntegrationType.join(",") })
    } else if (filterType === 'pspFeatures') {
      const currentPspFeatures = filters.pspFeatures ? filters.pspFeatures.split(",") : []
      const newPspFeatures = currentPspFeatures.filter(f => f !== value)
      updateFilters({ pspFeatures: newPspFeatures.join(",") })
    } else if (filterType === 'platformType') {
      const currentPlatformType = filters.platformType ? filters.platformType.split(",") : []
      const newPlatformType = currentPlatformType.filter(p => p !== value)
      updateFilters({ platformType: newPlatformType.join(",") })
    } else if (filterType === 'propFirm') {
      const currentPropFirm = filters.propFirm ? filters.propFirm.split(",") : []
      const newPropFirm = currentPropFirm.filter(p => p !== value)
      updateFilters({ propFirm: newPropFirm.join(",") })
    } else if (filterType === 'deployment') {
      const currentDeployment = filters.deployment ? filters.deployment.split(",") : []
      const newDeployment = currentDeployment.filter(d => d !== value)
      updateFilters({ deployment: newDeployment.join(",") })
    } else if (filterType === 'bestFor') {
      const currentBestFor = filters.bestFor ? filters.bestFor.split(",") : []
      const newBestFor = currentBestFor.filter(b => b !== value)
      updateFilters({ bestFor: newBestFor.join(",") })
    } else if (filterType === 'platformFeatures') {
      const currentPlatformFeatures = filters.platformFeatures ? filters.platformFeatures.split(",") : []
      const newPlatformFeatures = currentPlatformFeatures.filter(f => f !== value)
      updateFilters({ platformFeatures: newPlatformFeatures.join(",") })
    } else if (filterType === 'botStrategyType') {
      const currentBotStrategyType = filters.botStrategyType ? filters.botStrategyType.split(",") : []
      const newBotStrategyType = currentBotStrategyType.filter(t => t !== value)
      updateFilters({ botStrategyType: newBotStrategyType.join(",") })
    } else if (filterType === 'automationLevel') {
      const currentAutomationLevel = filters.automationLevel ? filters.automationLevel.split(",") : []
      const newAutomationLevel = currentAutomationLevel.filter(l => l !== value)
      updateFilters({ automationLevel: newAutomationLevel.join(",") })
    } else if (filterType === 'pricingModel') {
      const currentPricingModel = filters.pricingModel ? filters.pricingModel.split(",") : []
      const newPricingModel = currentPricingModel.filter(m => m !== value)
      updateFilters({ pricingModel: newPricingModel.join(",") })
    } else if (filterType === 'algoFeatures') {
      const currentAlgoFeatures = filters.algoFeatures ? filters.algoFeatures.split(",") : []
      const newAlgoFeatures = currentAlgoFeatures.filter(f => f !== value)
      updateFilters({ algoFeatures: newAlgoFeatures.join(",") })
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
      // Liquidity Partner fields
      regulation: "",
      assetClass: "",
      executionType: "",
      providerType: "",
      // PSP Partner fields
      paymentType: "",
      settlementCurrency: "",
      integrationType: "",
      pspFeatures: "",
      // Trading Platform fields
      platformType: "",
      propFirm: "",
      deployment: "",
      bestFor: "",
      platformFeatures: "",
      // Algo Trading fields
      botStrategyType: "",
      automationLevel: "",
      pricingModel: "",
      algoFeatures: "",
      q: ""
    })
  }

  const hasActiveFilters = !!(category || regulators || platforms || rating || features || skillLevel || learningFormat || pricing || educationFeatures || locationLanguage || solutionType || compatiblePlatform || targetClient || hqRegion || regulation || assetClass || executionType || providerType || paymentType || settlementCurrency || integrationType || pspFeatures || platformType || propFirm || deployment || bestFor || platformFeatures || botStrategyType || automationLevel || pricingModel || algoFeatures)

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

      {regulation && regulation.split(",").map((reg, index) => (
        <span key={reg} className="inline-flex items-center gap-1 px-4 py-2 bg-[#E9EAE3] text-[#1A1A1A] rounded-full text-sm font-medium">
          {reg.trim()}
          <button
            type="button"
            onClick={() => removeFilter('regulation', reg.trim())}
            className="ml-1 text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X size={12} />
          </button>
        </span>
      ))}

      {assetClass && assetClass.split(",").map((asset, index) => (
        <span key={asset} className="inline-flex items-center gap-1 px-4 py-2 bg-[#E9EAE3] text-[#1A1A1A] rounded-full text-sm font-medium">
          {asset.trim()}
          <button
            type="button"
            onClick={() => removeFilter('assetClass', asset.trim())}
            className="ml-1 text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X size={12} />
          </button>
        </span>
      ))}

      {executionType && executionType.split(",").map((execution, index) => (
        <span key={execution} className="inline-flex items-center gap-1 px-4 py-2 bg-[#E9EAE3] text-[#1A1A1A] rounded-full text-sm font-medium">
          {execution.trim()}
          <button
            type="button"
            onClick={() => removeFilter('executionType', execution.trim())}
            className="ml-1 text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X size={12} />
          </button>
        </span>
      ))}

      {providerType && providerType.split(",").map((provider, index) => (
        <span key={provider} className="inline-flex items-center gap-1 px-4 py-2 bg-[#E9EAE3] text-[#1A1A1A] rounded-full text-sm font-medium">
          {provider.trim()}
          <button
            type="button"
            onClick={() => removeFilter('providerType', provider.trim())}
            className="ml-1 text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X size={12} />
          </button>
        </span>
      ))}

      {paymentType && paymentType.split(",").map((payment, index) => (
        <span key={payment} className="inline-flex items-center gap-1 px-4 py-2 bg-[#E9EAE3] text-[#1A1A1A] rounded-full text-sm font-medium">
          {getFilterDisplayName(payment.trim(), 'paymentType')}
          <button
            type="button"
            onClick={() => removeFilter('paymentType', payment.trim())}
            className="ml-1 text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X size={12} />
          </button>
        </span>
      ))}

      {settlementCurrency && settlementCurrency.split(",").map((currency, index) => (
        <span key={currency} className="inline-flex items-center gap-1 px-4 py-2 bg-[#E9EAE3] text-[#1A1A1A] rounded-full text-sm font-medium">
          {getFilterDisplayName(currency.trim(), 'settlementCurrency')}
          <button
            type="button"
            onClick={() => removeFilter('settlementCurrency', currency.trim())}
            className="ml-1 text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X size={12} />
          </button>
        </span>
      ))}

      {integrationType && integrationType.split(",").map((integration, index) => (
        <span key={integration} className="inline-flex items-center gap-1 px-4 py-2 bg-[#E9EAE3] text-[#1A1A1A] rounded-full text-sm font-medium">
          {getFilterDisplayName(integration.trim(), 'integrationType')}
          <button
            type="button"
            onClick={() => removeFilter('integrationType', integration.trim())}
            className="ml-1 text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X size={12} />
          </button>
        </span>
      ))}

      {pspFeatures && pspFeatures.split(",").map((feature, index) => (
        <span key={feature} className="inline-flex items-center gap-1 px-4 py-2 bg-[#E9EAE3] text-[#1A1A1A] rounded-full text-sm font-medium">
          {getFilterDisplayName(feature.trim(), 'pspFeatures')}
          <button
            type="button"
            onClick={() => removeFilter('pspFeatures', feature.trim())}
            className="ml-1 text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X size={12} />
          </button>
        </span>
      ))}

      {platformType && platformType.split(",").map((platform, index) => (
        <span key={platform} className="inline-flex items-center gap-1 px-4 py-2 bg-[#E9EAE3] text-[#1A1A1A] rounded-full text-sm font-medium">
          {platform.trim()}
          <button
            type="button"
            onClick={() => removeFilter('platformType', platform.trim())}
            className="ml-1 text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X size={12} />
          </button>
        </span>
      ))}

      {propFirm && propFirm.split(",").map((firm, index) => (
        <span key={firm} className="inline-flex items-center gap-1 px-4 py-2 bg-[#E9EAE3] text-[#1A1A1A] rounded-full text-sm font-medium">
          {firm.trim()}
          <button
            type="button"
            onClick={() => removeFilter('propFirm', firm.trim())}
            className="ml-1 text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X size={12} />
          </button>
        </span>
      ))}

      {deployment && deployment.split(",").map((deploy, index) => (
        <span key={deploy} className="inline-flex items-center gap-1 px-4 py-2 bg-[#E9EAE3] text-[#1A1A1A] rounded-full text-sm font-medium">
          {deploy.trim()}
          <button
            type="button"
            onClick={() => removeFilter('deployment', deploy.trim())}
            className="ml-1 text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X size={12} />
          </button>
        </span>
      ))}

      {bestFor && bestFor.split(",").map((best, index) => (
        <span key={best} className="inline-flex items-center gap-1 px-4 py-2 bg-[#E9EAE3] text-[#1A1A1A] rounded-full text-sm font-medium">
          {best.trim()}
          <button
            type="button"
            onClick={() => removeFilter('bestFor', best.trim())}
            className="ml-1 text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X size={12} />
          </button>
        </span>
      ))}

      {platformFeatures && platformFeatures.split(",").map((feature, index) => (
        <span key={feature} className="inline-flex items-center gap-1 px-4 py-2 bg-[#E9EAE3] text-[#1A1A1A] rounded-full text-sm font-medium">
          {feature.trim()}
          <button
            type="button"
            onClick={() => removeFilter('platformFeatures', feature.trim())}
            className="ml-1 text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X size={12} />
          </button>
        </span>
      ))}

      {botStrategyType && botStrategyType.split(",").map((type, index) => (
        <span key={type} className="inline-flex items-center gap-1 px-4 py-2 bg-[#E9EAE3] text-[#1A1A1A] rounded-full text-sm font-medium">
          {type.trim()}
          <button
            type="button"
            onClick={() => removeFilter('botStrategyType', type.trim())}
            className="ml-1 text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X size={12} />
          </button>
        </span>
      ))}

      {automationLevel && automationLevel.split(",").map((level, index) => (
        <span key={level} className="inline-flex items-center gap-1 px-4 py-2 bg-[#E9EAE3] text-[#1A1A1A] rounded-full text-sm font-medium">
          {level.trim()}
          <button
            type="button"
            onClick={() => removeFilter('automationLevel', level.trim())}
            className="ml-1 text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X size={12} />
          </button>
        </span>
      ))}

      {pricingModel && pricingModel.split(",").map((model, index) => (
        <span key={model} className="inline-flex items-center gap-1 px-4 py-2 bg-[#E9EAE3] text-[#1A1A1A] rounded-full text-sm font-medium">
          {model.trim()}
          <button
            type="button"
            onClick={() => removeFilter('pricingModel', model.trim())}
            className="ml-1 text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X size={12} />
          </button>
        </span>
      ))}

      {algoFeatures && algoFeatures.split(",").map((feature, index) => (
        <span key={feature} className="inline-flex items-center gap-1 px-4 py-2 bg-[#E9EAE3] text-[#1A1A1A] rounded-full text-sm font-medium">
          {feature.trim()}
          <button
            type="button"
            onClick={() => removeFilter('algoFeatures', feature.trim())}
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
