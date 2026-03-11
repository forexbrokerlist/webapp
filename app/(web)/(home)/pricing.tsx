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
    const plans = await findPlans()

    if (!plans?.length) return null

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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border/40 border border-border/40 rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl">
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
                                className={cx(
                                    "relative flex flex-col p-8 lg:p-10 transition-colors bg-background/50 hover:bg-background/80",
                                    plan.isPopular && "bg-background/80 shadow-[inset_0px_0px_40px_-20px_rgba(59,130,246,0.3)] ring-1 ring-blue-500/30 z-10"
                                )}
                            >
                                {plan.isPopular && (
                                    <div className="absolute top-8 right-8">
                                        <Badge variant="primary" size="sm" className="bg-blue-600 text-[10px] py-0.5 px-2 rounded-full uppercase font-black tracking-tighter shadow-lg shadow-blue-500/20 italic">
                                            Most Popular
                                        </Badge>
                                    </div>
                                )}

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
                                    asChild
                                    variant={plan.isPopular ? "fancy" : isFree ? "primary" : "primary"}
                                    className={cx(
                                        "w-full h-12 rounded-xl text-sm font-bold tracking-wide transition-all duration-300",
                                        plan.isPopular ? "bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/20" : "bg-foreground text-background hover:opacity-90 shadow-lg shadow-foreground/5"
                                    )}
                                    suffix={<ArrowRight className="size-4 transition-transform group-hover/button:translate-x-1" />}
                                >
                                    <a href={`/submit?plan=${plan.slug}`}>
                                        {isFree ? "Claim Now" : "Get Started"}
                                    </a>
                                </Button>
                            </div>
                        )
                    })}
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
