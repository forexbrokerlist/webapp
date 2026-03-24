import { ArrowRight, Check } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Badge } from "~/components/common/badge"
import { Button } from "~/components/common/button"
import { Stack } from "~/components/common/stack"
import { Container } from "~/components/web/ui/container"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { findPlans } from "~/server/web/plans/queries"
import { cx } from "~/lib/utils"

export const Pricing = async () => {
    const t = await getTranslations()
    const allPlans = await findPlans()

    if (!allPlans?.length) return null

    // Keep only one plan for the homepage (prefer popular if available)
    const popularPlan = allPlans.find((p) => p.isPopular)
    const plans = popularPlan ? [popularPlan] : [allPlans[0]]

    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent_70%)]" />

            <Container>
                <Intro alignment="center" className="mb-16">
                    <Badge variant="soft" size="md" className="mb-4 uppercase tracking-widest text-[10px]">
                        PRICING
                    </Badge>
                    <IntroTitle className="max-w-2xl mx-auto lg:text-5xl/[1.1]">
                        Choose the right plan for your brokerage
                    </IntroTitle>
                    <IntroDescription className="mt-6 max-w-xl mx-auto">
                        Whether you're looking to claim your ownership or scale your visibility, we have the perfect plan for you.
                    </IntroDescription>

                    <div className="mt-8 flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2 p-1.5 px-3 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-bold text-green-500 uppercase tracking-wider">
                            <span className="flex size-1.5 rounded-full bg-green-500 animate-pulse" />
                            20% OFF / FIRST 250 CUSTOMERS <span className="text-foreground/50 ml-1">4 LEFT</span>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 opacity-70">
                            <Check className="size-3 text-green-500" /> 30-day money-back guarantee
                        </p>
                    </div>
                </Intro>

                <div className="mx-auto max-w-md relative group z-10">
                    <div className="absolute -inset-1 rounded-4xl bg-linear-to-r from-blue-600/30 to-indigo-600/30 blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
                    
                    <div className="relative grid grid-cols-1 gap-px bg-card/60 backdrop-blur-xl border-2 border-border/50 rounded-3xl overflow-hidden shadow-2xl">
                        {plans.map((plan) => {
                            const isFree = plan.slug === "free"
                            const isGrowth = plan.slug === "growth"
                            const isScale = plan.slug === "scale"

                            // Custom copy based on slugs
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

                            return (
                                <div
                                    key={plan.id}
                                    className="relative flex flex-col p-8 sm:p-12 transition-colors bg-background/40"
                                >
                                    {plan.isPopular && (
                                        <div className="absolute -top-3.5 inset-x-0 mx-auto w-fit z-20">
                                            <Badge variant="primary" size="sm" className="bg-linear-to-r from-blue-600 to-indigo-600 text-[10px] py-1 px-4 rounded-full uppercase font-black tracking-widest shadow-lg shadow-blue-500/25 border border-blue-400/20 text-white">
                                                Most Popular
                                            </Badge>
                                        </div>
                                    )}

                                    <div className="flex-1 text-center">
                                        <h3 className="text-3xl font-black tracking-tight mb-3 text-foreground">{planName}</h3>
                                        <p className="text-sm font-medium text-muted-foreground mb-8 max-w-[16rem] mx-auto leading-relaxed">
                                            {planDescription}
                                        </p>

                                        <div className="flex items-center justify-center gap-1.5 mb-10">
                                            <span className="text-3xl font-bold text-muted-foreground mr-1 opacity-50">$</span>
                                            <span className="text-7xl font-black tracking-tighter text-foreground drop-shadow-sm">{plan.price}</span>
                                            {plan.price > 0 && (
                                                <div className="ml-2 relative flex flex-col -mt-4">
                                                    <span className="text-muted-foreground line-through text-xl font-bold opacity-40 decoration-red-500/50 decoration-2">{Math.round(plan.price * 1.25)}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-4 mb-10 border-t border-border/40 pt-10 text-left w-full max-w-60 mx-auto">
                                            {planFeatures.map((feature, index) => (
                                                <div key={index} className="flex items-start gap-3">
                                                    <Check className="size-4 text-blue-500 shrink-0 mt-1" />
                                                    <span className="text-sm font-medium text-secondary-foreground leading-snug">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <Button
                                        asChild
                                        size="lg"
                                        variant={plan.isPopular ? "fancy" : isFree ? "primary" : "primary"}
                                        className={cx(
                                            "w-full h-14 rounded-2xl text-base font-bold tracking-wide transition-all duration-300",
                                            plan.isPopular ? "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-600/25" : "bg-foreground text-background hover:opacity-90 shadow-lg shadow-foreground/5"
                                        )}
                                        suffix={<ArrowRight className="size-5 transition-transform group-hover/button:translate-x-1" />}
                                    >
                                        <a href={`/submit?plan=${plan.slug}`}>
                                            {isFree ? "Claim Now" : "Get Started"}
                                        </a>
                                    </Button>
                                </div>
                            )
                        })}
                    </div>
                </div>


                <div className="mt-12 flex flex-col items-center gap-6 opacity-80">
                    <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase opacity-60">
                        PRICES IN USD. VAT MAY APPLY.
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="size-8 rounded-full border-2 border-background bg-muted overflow-hidden">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 123}`} alt="User" />
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col">
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(i => <Check key={i} className="size-2 text-yellow-500 fill-yellow-500" />)}
                            </div>
                            <p className="text-xs font-medium text-foreground">200+ happy customers</p>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}
