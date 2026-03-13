"use client"

import { ArrowRight, Check } from "lucide-react"
import { Badge } from "~/components/common/badge"
import { Button } from "~/components/common/button"
import { cx } from "~/lib/utils"
import { type ReactNode, useState } from "react"
import { ClaimFlow } from "~/components/web/brokers/claim-flow"

export type PlanData = {
    id: string
    name: string
    slug: string
    description: string | null
    price: number
    currency: string
    features: string[]
    isPopular: boolean
}

type PlanCardProps = {
    plan: PlanData
    brokerId?: string
    checkoutData?: {
        successUrl: string
        cancelUrl: string
        metadata?: Record<string, string>
    }
    className?: string
    buttonLabel?: ReactNode
}

export const PlanCard = ({ plan, brokerId, checkoutData, className, buttonLabel }: PlanCardProps) => {
    const [isClaiming, setIsClaiming] = useState(false)
    const isFree = plan.slug === "free"
    const isGrowth = plan.slug === "growth"
    const isScale = plan.slug === "scale"

    // Custom copy based on slugs from home page
    const planName = isFree ? "Free (Claim Ownership)" : isGrowth ? "Growth Plan" : isScale ? "Scale Plan" : plan.name
    const planDescription = isFree
        ? "Perfect for brokers who want to claim their ownership and manage their profile."
        : isGrowth
            ? "Boost your reach with advertisement placement and custom blog posts."
            : isScale
                ? "Maximum visibility with prime sponsor section placement and full features."
                : plan.description

    const planFeatures = isFree
        ? ["Claim Ownership", "Basic Profile Management", "Standard Listing"]
        : isGrowth
            ? ["Everything in Free", "Advertisement Placement", "2 Custom Blog Posts", "Increased Visibility"]
            : isScale
                ? ["Everything in Growth", "Sponsor Section Placement", "Featured Logo Placement", "Priority Support"]
                : plan.features

    const onAction = () => {
        if (isFree && brokerId) {
            setIsClaiming(true)
            return
        }

        // Here we would normally trigger the checkout
        // For now, we'll redirect to the success URL or handle it as needed
        if (checkoutData?.successUrl) {
            window.location.href = `${checkoutData.successUrl}&plan=${plan.slug}`
        }
    }

    return (
        <div
            className={cx(
                "relative flex flex-col p-8 lg:p-10 transition-colors bg-background/50 hover:bg-background/80 border border-border/40 rounded-3xl",
                plan.isPopular && "bg-background/80 shadow-[inset_0px_0px_40px_-20px_rgba(59,130,246,0.3)] ring-1 ring-blue-500/30 z-10",
                className
            )}
        >
            {plan.isPopular && (
                <div className="absolute top-8 right-8">
                    <Badge variant="primary" size="sm" className="bg-blue-600 text-[10px] py-0.5 px-2 rounded-full uppercase font-black tracking-tighter shadow-lg shadow-blue-500/20 italic">
                        Most Popular
                    </Badge>
                </div>
            )}

            {isClaiming && brokerId ? (
                <div className="flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsClaiming(false)}>
                            <ArrowRight className="size-4 rotate-180" />
                        </Button>
                        <h3 className="font-bold">Claiming Ownership</h3>
                    </div>
                    <ClaimFlow brokerId={brokerId} />
                </div>
            ) : (
                <>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold tracking-tight mb-2">{planName}</h3>
                        <p className="text-sm text-muted-foreground mb-8 min-h-10">
                            {planDescription}
                        </p>

                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-2xl text-muted-foreground mr-1">$</span>
                            <span className="text-5xl font-bold tracking-tight">{plan.price}</span>
                            {plan.price > 0 && (
                                <div className="ml-2 relative">
                                    <span className="text-muted-foreground line-through text-sm opacity-50 decoration-red-500/50">{Math.round(plan.price * 1.25)}</span>
                                    <div className="absolute -top-1 -right-1 size-1.5 rounded-full bg-red-400/30 blur-sm shrink-0" />
                                </div>
                            )}
                        </div>

                        <div className="space-y-4 mb-10 border-t border-border/40 pt-8">
                            {planFeatures.map((feature, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <Check className="size-4 text-blue-500 shrink-0 mt-0.5" />
                                    <span className="text-sm text-secondary-foreground leading-snug">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button
                        variant={plan.isPopular ? "fancy" : isFree ? "primary" : "primary"}
                        className={cx(
                            "w-full h-12 rounded-xl text-sm font-bold tracking-wide transition-all duration-300",
                            plan.isPopular ? "bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/20" : "bg-foreground text-background hover:opacity-90 shadow-lg shadow-foreground/5"
                        )}
                        suffix={<ArrowRight className="size-4 transition-transform group-hover/button:translate-x-1" />}
                        onClick={onAction}
                        disabled={isFree && !brokerId}
                    >
                        {buttonLabel || (isFree ? "Claim Now" : "Get Started")}
                    </Button>
                </>
            )}
        </div>
    )
}
