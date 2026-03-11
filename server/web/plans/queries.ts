"use server"

import { cacheLife, cacheTag } from "next/cache"
import { db } from "~/services/db"

/**
 * Find all active plans for the website.
 */
export const findPlans = async () => {
  "use cache"

  cacheTag("plans")
  cacheLife("days")

  try {
    const plans = await db.plan.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        price: "asc",
      },
    })

    return plans
  } catch (error) {
    console.error("Failed to fetch plans:", error)
    throw new Error("Unable to load pricing plans. Please try again later.")
  }
}

/**
 * Find a single plan by its slug.
 */
export const findPlanBySlug = async (slug: string) => {
  "use cache"

  cacheTag(`plan-${slug}`)
  cacheLife("days")

  try {
    const plan = await db.plan.findUnique({
      where: {
        slug,
        isActive: true,
      },
    })

    return plan
  } catch (error) {
    console.error(`Failed to fetch plan with slug ${slug}:`, error)
    throw new Error("Unable to load the requested plan. Please try again later.")
  }
}
