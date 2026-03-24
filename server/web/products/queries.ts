import { db } from "~/services/db"
import { sortProductsByPrice, type Price, type Product, type ProductWithPrices } from "~/lib/products"

export const findStripeProducts = async () => {
  try {
    const plans = await db.plan.findMany({
      where: { isActive: true },
      orderBy: { price: "asc" },
    })

    // Map database Plan to a shape expected by the frontend (previously Stripe.Product)
    return plans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      description: plan.description ?? "",
      marketing_features: plan.features.map((feature) => ({ name: feature })),
      default_price: {
        id: plan.id,
        unit_amount: plan.price * 100, // cents for Stripe compatibility in some components
        currency: plan.currency.toLowerCase(),
      },
    }))
  } catch (error) {
    console.error("Failed to fetch products:", error)
    throw new Error("Unable to load products. Please try again later.")
  }
}

export const findStripePricesByProduct = async (productId: string) => {
  try {
    const plan = await db.plan.findUnique({
      where: { id: productId },
    })

    if (!plan) return []

    // Return a Stripe-compatible Price object
    return [
      {
        id: plan.id,
        unit_amount: plan.price * 100,
        currency: plan.currency.toLowerCase(),
        recurring: { interval: "month" }, // Default for now
      },
    ]
  } catch (error) {
    console.error(`Failed to fetch prices for product ${productId}:`, error)
    throw new Error("Unable to load pricing information. Please try again later.")
  }
}

export const findStripeCoupon = async (code?: string) => {
  if (!code?.trim()) return undefined

  // Stripe coupons are being removed, but if you have a local Promocode model, use it here.
  // For now, return undefined to disable coupon logic if Stripe is gone.
  return undefined
}

/**
 * Fetch prices for a list of products and prepare them for display.
 */
export const getProductsWithPrices = async (
  products: Product[],
  coupon?: any,
): Promise<ProductWithPrices[]> => {
  return Promise.all(
    products.map(async product => {
      const prices = (await findStripePricesByProduct(product.id)) as Price[]
      return {
        product,
        prices,
        coupon: undefined, // Coupons disabled for now
      }
    }),
  )
}

/**
 * Get the products for a listing.
 */
export const getProductsForListing = async (discountCode?: string) => {
  const [products, coupon] = await Promise.all([
    findStripeProducts() as Promise<Product[]>,
    findStripeCoupon(discountCode),
  ])

  return getProductsWithPrices(sortProductsByPrice(products), coupon)
}
