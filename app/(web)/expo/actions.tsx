'use server'

import { searchBrokers } from '~/server/web/tools/queries'
import { getPresignedUrlFromFull } from '~/lib/media'

export async function searchBrokersAction(query: string) {
  if (query.trim().length < 1) {
    return {
      brokers: [],
      total: 0,
      page: 1,
      perPage: 10,
    }
  }

  const results = await searchBrokers({
    q: query,
    category: 'forex-brokers',
    sort: 'broker_name.asc',
    page: 1,
    perPage: 10,
    regulators: '',
    platforms: '',
    rating: '',
    features: '',
    skillLevel: '',
    learningFormat: '',
    pricing: '',
    educationFeatures: '',
    locationLanguage: '',
    solutionType: '',
    compatiblePlatform: '',
    targetClient: '',
    hqRegion: '',
    regulation: '',
    assetClass: '',
    executionType: '',
    providerType: '',
    paymentType: '',
    settlementCurrency: '',
    integrationType: '',
    pspFeatures: '',
    platformType: '',
    propFirm: '',
    deployment: '',
    bestFor: '',
    platformFeatures: '',
    botStrategyType: '',
    automationLevel: '',
    pricingModel: '',
    algoFeatures: '',
  })

  const brokers = await Promise.all(
    (results?.brokers ?? []).map(async (b) => ({
      broker_name: b.broker_name,
      logoUrl: b.logoUrl
        ? await getPresignedUrlFromFull(b.logoUrl)
        : '/assets/images/placeholder-logo.png',
      slug: b.slug,
    }))
  )

  console.log('FINAL BROKERS =>', brokers)

  return {
    ...results,
    brokers,
  }
}