import { Suspense } from "react"
import { findPlans } from "~/server/web/plans/queries"
import { PlanCard } from "./plan-card"
import { ProductList, ProductListSkeleton } from "~/components/web/products/product-list"

type PlanQueryProps = {
    checkoutData: {
        successUrl: string
        cancelUrl: string
        metadata?: Record<string, string>
    }
}

export const PlanQuery = async ({ checkoutData }: PlanQueryProps) => {
    const plans = await findPlans()

    if (!plans || plans.length === 0) {
        return <div className="text-center p-8 text-muted-foreground">No plans available at the moment.</div>
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {plans.map((plan) => (
                <PlanCard 
                    key={plan.id} 
                    plan={plan} 
                    brokerId={checkoutData.metadata?.brokerId}
                    checkoutData={checkoutData}
                    className="h-full"
                />
            ))}
        </div>
    )
}
