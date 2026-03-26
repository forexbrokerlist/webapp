import { addDays, differenceInMonths } from "date-fns"
import plur from "plur"
import type { ReactNode } from "react"
import { submissionsConfig } from "~/config/submissions"

const SYMBOLS = {
  positive: "✓ ",
  neutral: "• ",
  negative: "✗ ",
} as const

type SymbolType = keyof typeof SYMBOLS

export type ProductInterval = "month" | "year"

export type ProductFeature = {
  name: ReactNode
  footnote?: ReactNode
  type?: keyof typeof SYMBOLS
}

// Custom types to replace Stripe ones
export type Product = {
  id: string
  name: string
  description: string
  marketing_features: { name: string }[]
  default_price?: Price
}

export type Price = {
  id: string
  unit_amount: number
  currency: string
  recurring?: { interval: ProductInterval }
  type?: "one_time" | "recurring"
}

export type ProductWithPrices = {
  product: Product
  prices: Price[]
  coupon: any | undefined
}

export type ProductProps = {
  product?: Partial<Product>
  isDisabled?: boolean
  buttonLabel?: ReactNode
} | null

export const calculateQueueDuration = (queueSize: number) => {
  const queueDays = Math.ceil((queueSize / submissionsConfig.postingRate) * 7)
  const queueMonths = Math.max(differenceInMonths(addDays(new Date(), queueDays), new Date()), 1)

  return `${queueMonths} ${plur("month", queueMonths)}`
}

const extractFeatureTypeFromName = (featureName?: string) => {
  return Object.keys(SYMBOLS).find(key => featureName?.startsWith(SYMBOLS[key as SymbolType])) as
    | SymbolType
    | undefined
}

const removeTypeSymbolFromName = (name: string, type?: SymbolType) => {
  return type ? name.replace(SYMBOLS[type], "") : name
}

/**
 * Get the price amount from a Product or Price object.
 */
const extractPriceAmount = (price?: Price | string | null) => {
  return typeof price === "object" && price !== null ? (price.unit_amount ?? 0) : 0
}

/*
 * Sort products by price
 */
export const sortProductsByPrice = (products: Product[]) => {
  return (products as any).sort(
    (a: any, b: any) => extractPriceAmount(a.default_price) - extractPriceAmount(b.default_price),
  )
}

/**
 * Get the normalized features of a product.
 */
export const getProductFeatures = (product: Product) => {
  return product.marketing_features.map(feature => {
    const type = extractFeatureTypeFromName(feature.name)
    const name = removeTypeSymbolFromName(feature.name || "", type)

    return { name, type } satisfies ProductFeature
  })
}
