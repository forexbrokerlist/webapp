"use server"

import { findBrokers } from "~/server/web/tools/queries"
import { getPresignedUrlFromFull } from "~/lib/media"

export async function searchBrokersAction(query: string, typeSlug: string = "broker") {
    const rawBrokers = await findBrokers({
        where: {
            type: { slug: typeSlug },
            broker_name: { contains: query, mode: 'insensitive' }
        },
        include: { type: true },
        take: 50
    });

    return Promise.all(rawBrokers.map(async (broker) => {
        const logoUrl = await getPresignedUrlFromFull(broker.logoUrl);
        
        let stats = [];
        if (typeSlug === "crm") {
            stats = [
                {
                    label: "MT4/MT5",
                    value: broker.trading_platforms
                        ? broker.trading_platforms.toLowerCase().includes("mt4") &&
                            broker.trading_platforms.toLowerCase().includes("mt5")
                            ? "Yes"
                            : broker.trading_platforms.toLowerCase().includes("mt4")
                                ? "MT4 only"
                                : broker.trading_platforms.toLowerCase().includes("mt5")
                                    ? "MT5 only"
                                    : "No"
                        : "No",
                    type: "text",
                },
                {
                    label: "IB/Affiliate Module",
                    value: broker.features?.some((f) => f.toLowerCase().includes("ib"))
                        ? "Yes"
                        : "No",
                    type: broker.features?.some((f) => f.toLowerCase().includes("ib"))
                        ? "badge-dark"
                        : "badge-danger",
                },
                {
                    label: "KYC/AML automation",
                    value: broker.features?.some((f) => {
                        const lowerF = f.toLowerCase();
                        return lowerF.includes("kyc") || lowerF.includes("aml");
                    })
                        ? "Yes"
                        : "No",
                    type: broker.features?.some((f) => {
                        const lowerF = f.toLowerCase();
                        return lowerF.includes("kyc") || lowerF.includes("aml");
                    })
                        ? "badge-dark"
                        : "badge-danger",
                },
                {
                    label: "Client Portal",
                    value: broker.features?.some((f) => f.toLowerCase().includes("client portal"))
                        ? "Yes"
                        : "No",
                    type: broker.features?.some((f) => f.toLowerCase().includes("client portal"))
                        ? "badge-dark"
                        : "badge-danger",
                },
                {
                    label: "Free Demo",
                    value: broker.demoAccount ? "Yes" : "No",
                    type: broker.demoAccount ? "badge-dark" : "badge-danger",
                },
                {
                    label: "API access",
                    value: broker.api_access ? "Yes" : "No",
                    type: broker.api_access ? "badge-dark" : "badge-danger",
                },
                {
                    label: "Deployment Type",
                    value: broker.deployment_type || "-",
                    type: "text",
                },
                {
                    label: "Starting price",
                    value: broker.starting_price || "-",
                    type: "text",
                },
                {
                    label: "Best For",
                    value: broker.bestFor&& broker.bestFor.length>0 ? broker.bestFor?.join(', ') : '-',
                    type: "text",
                },
                {
                    label: "Overall rating",
                    value: broker.overall_rating || "0",
                    type: "star",
                },
            ];
        } else if (typeSlug === "educationplatforms") {
            stats = [
                {
                    label: "Skill level",
                    value: (() => {
                        const levels = broker.skill_level || [];
                        if (levels.length === 0) return "-";
                        const hasBeginner = levels.includes("Beginner");
                        const hasIntermediate = levels.includes("Intermediate");
                        const hasAdvanced = levels.includes("Advanced");

                        if (hasBeginner && hasAdvanced) return "Beginner -> Advanced";
                        if (hasBeginner && hasIntermediate) return "Beginner -> Intermediate";
                        if (hasIntermediate && hasAdvanced) return "Intermediate -> Advanced";
                        return levels[0];
                    })(),
                    type: "text",
                },
                {
                    label: "Learning format",
                    value: (broker.learning_format || []).join(" + ") || "-",
                    type: "text",
                },
                {
                    label: "Free trial",
                    value: broker.free_trial_available ? "Yes" : "No",
                    type: broker.free_trial_available ? "badge-dark" : "badge-danger",
                },
                {
                    label: "Certificate on completion",
                    value: broker.certificate_available ? "Yes" : "No",
                    type: broker.certificate_available ? "badge-dark" : "badge-danger",
                },
                {
                    label: "Community access",
                    value: broker.community_access ? "Yes" : "No",
                    type: broker.community_access ? "badge-dark" : "badge-danger",
                },
                {
                    label: "1-on-1 mentorship",
                    value: broker.mentorship_available ? "Available" : "No",
                    type: broker.mentorship_available ? "badge-dark" : "badge-danger",
                },
                {
                    label: "MT4 / MT5 training",
                    value: broker.trading_platforms
                        ? broker.trading_platforms.toLowerCase().includes("mt4") ||
                            broker.trading_platforms.toLowerCase().includes("mt5")
                            ? "Yes"
                            : "No"
                        : "No",
                    type:
                        broker.trading_platforms?.toLowerCase().includes("mt4") ||
                            broker.trading_platforms?.toLowerCase().includes("mt5")
                            ? "badge-dark"
                            : "badge-danger",
                },
                {
                    label: "Pricing model",
                    value: broker.pricingModel && broker.pricingModel?.length>0 && broker.pricingModel.join('/') || "-",
                    type: "text",
                },
                {
                    label: "Language",
                    value: (broker.languages_supported || []).join(", ") || "English",
                    type: "text",
                },
                {
                    label: "HQ / Region",
                    value: broker.headquarters || "-",
                    type: "text",
                },
                {
                    label: "Score",
                    value: broker.overall_rating || "0",
                    type: "star",
                },
            ];
        } else if (typeSlug === "forexbridge") {
            stats = [
                {
                    label: "Solution type",
                    value: broker.solution_type || "-",
                    type: "text",
                },
                {
                    label: "Compatible platforms",
                    value: broker.trading_platforms || "-",
                    type: "text",
                },
                {
                    label: "Latency",
                    value: broker.latency || "-",
                    type: "text",
                },
                {
                    label: "Target clients",
                    value: (broker.target_clients || []).join(", ") || "-",
                    type: "text",
                },
                {
                    label: "White label",
                    value: broker.white_label ? "Yes" : "No",
                    type: broker.white_label ? "badge-dark" : "badge-danger",
                },
                {
                    label: "API access",
                    value: broker.api_access ? "Yes" : "No",
                    type: broker.api_access ? "badge-dark" : "badge-danger",
                },
                {
                    label: "Demo available",
                    value: broker.demoAccount ? "Yes" : "No",
                    type: broker.demoAccount ? "badge-dark" : "badge-danger",
                },
                {
                    label: "Pricing model",
                    value: broker.pricingModel && broker.pricingModel?.length>0 && broker.pricingModel.join('/') || "-",
                    type: "text",
                },
                {
                    label: "Setup time",
                    value: broker.setup_time || "-",
                    type: "text",
                },
                {
                    label: "Score",
                    value: broker.overall_rating || "0",
                    type: "star",
                },
            ];
        } else if (typeSlug === "liquidity") {
            stats = [
                {
                    label: "Provider type",
                    value: broker.solution_type || "-",
                    type: "text",
                },
                {
                    label: "Execution latency",
                    value: broker.latency || "-",
                    type: "text",
                },
                {
                    label: "Asset classes",
                    value: broker.asset_classes && broker.asset_classes.length > 0 
                        ? (broker.asset_classes.length > 2 
                            ? `${broker.asset_classes.slice(0, 2).join(", ")}, +${broker.asset_classes.length - 2} others`
                            : broker.asset_classes.join(", "))
                        : "-",
                    type: "text",
                },
                {
                    label: "No last look",
                    value: broker.no_last_look ? "Yes" : "No",
                    type: broker.no_last_look ? "badge-dark" : "badge-danger",
                },
                {
                    label: "Target clients",
                    value: broker.target_clients && broker.target_clients.length > 0 
                        ? (() => {
                            const mapped = broker.target_clients.map(t => {
                                if (t === "Hedge Funds") return "Funds";
                                if (t === "Prop Trading Firms") return "Prop Firms";
                                if (t === "Forex brokers") return "Brokers";
                                return t;
                            });
                            return mapped.length > 3 
                                ? `${mapped.slice(0, 3).join(", ")}, +${mapped.length - 3} others`
                                : mapped.join(", ");
                        })()
                        : "-",
                    type: "text",
                },
                {
                    label: "White label",
                    value: broker.white_label ? "Yes" : "No",
                    type: broker.white_label ? "badge-dark" : "badge-danger",
                },
                {
                    label: "API access",
                    value: broker.api_access ? "Yes" : "No",
                    type: broker.api_access ? "badge-dark" : "badge-danger",
                },
                {
                    label: "Pricing model",
                    value: broker.pricingModel&&broker.pricingModel?.length > 0 ? broker.pricingModel.join("/") : "-",
                    type: "text",
                },
                {
                    label: "Demo available",
                    value: broker.demoAccount ? "Yes" : "No",
                    type: broker.demoAccount ? "badge-dark" : "badge-danger",
                },
                {
                    label: "Regulators",
                    value: broker.regulators || "-",
                    type: "text",
                },
                {
                    label: "Score",
                    value: broker.overall_rating || "0",
                    type: "star",
                },
            ];
        } else if (typeSlug === "psp") {
            stats = [
                {
                    label: "Company type",
                    value: broker.company_type || "-",
                    type: "text",
                },
                {
                    label: "Target clients",
                    value: broker.target_clients && broker.target_clients.length > 0 
                        ? (() => {
                            const mapped = broker.target_clients.map(t => {
                                if (t === "Hedge Funds") return "Funds";
                                if (t === "Prop Trading Firms") return "Prop Firms";
                                if (t === "Forex brokers") return "Brokers";
                                return t;
                            });
                            return mapped.length > 3 
                                ? `${mapped.slice(0, 3).join(", ")}, +${mapped.length - 3} others`
                                : mapped.join(", ");
                        })()
                        : "-",
                    type: "text",
                },
                {
                    label: "Settlement",
                    value: broker.settlement_time || "-",
                    type: "text",
                },
                {
                    label: "Auto fiat conversion",
                    value: broker.auto_fiat_conversion ? "Yes" : "No",
                    type: broker.auto_fiat_conversion ? "badge-dark" : "badge-danger",
                },
                {
                    label: "Supported cryptos",
                    value: broker.supported_cryptos || "-",
                    type: "text",
                },
                {
                    label: "Fiat currencies",
                    value: broker.fiat_currencies || "-",
                    type: "text",
                },
                {
                    label: "Integration",
                    value: broker.integration_type && broker.integration_type.length > 0 
                        ? broker.integration_type.join(", ")
                        : "-",
                    type: "text",
                },
                {
                    label: "White label",
                    value: broker.white_label ? "Yes" : "No",
                    type: broker.white_label ? "badge-dark" : "badge-danger",
                },
                {
                    label: "KYB required",
                    value: broker.kyb_required ? "Business" : "No",
                    type: broker.kyb_required ? "badge-dark" : "badge-danger",
                },
                {
                    label: "Mass payout",
                    value: broker.mass_payout ? "Yes" : "No",
                    type: broker.mass_payout ? "badge-dark" : "badge-danger",
                },
                {
                    label: "Score",
                    value: broker.overall_rating || "0",
                    type: "star",
                },
            ];
        } else if (typeSlug === "botprovider") {
            stats = [
                {
                    label: "Bot type",
                    value: broker.bot_type?.replace(/\s*\(.*?\)/g, "") || "-",
                    type: "text",
                },
                {
                    label: "Strategy",
                    value: broker.strategy_type && broker.strategy_type.length > 0
                        ? broker.strategy_type.map(s => s.replace(/\s*\(.*?\)/g, "")).join(", ")
                        : "-",
                    type: "text",
                },
                {
                    label: "Automation level",
                    value: broker.automation_level&&broker.automation_level.length>0 ?broker.automation_level:"-",
                    
                    type: broker.automation_level?.toLowerCase().includes("fully") ? "badge-success" : "badge-warning",
                },
                {
                    label: "Compatible platforms",
                    value: broker.trading_platforms
                        ? (() => {
                            const platformList = broker.trading_platforms
                                .split(",")
                                .map((r: string) => r.replace(/\s*\(.*?\)/g, "").trim())
                                .filter(Boolean);
                            if (platformList.length <= 2) return platformList.join(", ");
                            return `${platformList.slice(0, 2).join(", ")}, +${platformList.length - 2} others`;
                        })()
                        : "-",
                    type: "text",
                },
                {
                    label: "Win rate",
                    value: broker.win_rate || "-",
                    type: "text",
                },
                {
                    label: "Verified performance",
                    value: broker.verified_performance || "No",
                    type: broker.verified_performance && broker.verified_performance !== "No" ? "badge-success" : "badge-danger",
                },
                {
                    label: "Pricing model",
                    value: broker.pricingModel && broker.pricingModel.length > 0 ? broker.pricingModel.join("/") : "-",
                    type: "text",
                },
                {
                    label: "Price",
                    value: broker.starting_price || "-",
                    type: "text",
                },
                {
                    label: "Free trial",
                    value: broker.free_trial_available ? "Yes" : broker.demoAccount ? "Demo only" : "No",
                    type: broker.free_trial_available ? "badge-dark" : broker.demoAccount ? "badge-warning" : "badge-danger",
                },
                {
                    label: "Best for",
                    value: broker.bestFor && broker.bestFor.length > 0 ? broker.bestFor.join(" + ") : "-",
                    type: "text",
                },
                {
                    label: "Min deposit",
                    value: broker.minimum_deposit || "-",
                    type: "text",
                },
                {
                    label: "Trades/day",
                    value: broker.trades_per_day || "-",
                    type: "text",
                },
                {
                    label: "NFA/FIFO compatible",
                    value: broker.nfa_fifo ? "Yes" : "No",
                    type: broker.nfa_fifo ? "badge-success" : "badge-danger",
                },
                {
                    label: "Score",
                    value: broker.overall_rating || "0",
                    type: "star",
                },
            ];
        } else {
            // Default broker stats
            stats = [
                { label: "Min Deposit", value: broker.minimum_deposit || "-", type: "text" },
                { label: "Raw Spread", value: broker.minimum_raw_spreads || "-", type: "text" },
                { label: "Max Leverage", value: broker.maxLeverage || "-", type: "text" },
                { label: "Regulations", value: broker.regulators ? (() => {
                    const regList = broker.regulators.split(',')
                        .map((r: string) => r.replace(/\s*\(.*?\)/g, '').trim())
                        .filter(Boolean)
                         .filter(r => r.toLowerCase() !== 'other');
                    if (regList.length <= 3) return regList.join(', ');
                    return `${regList.slice(0, 3).join(', ')}, +${regList.length - 3} others`;
                })() : "None", type: "text" },
                { label: "Platforms", value: broker.trading_platforms ? (() => {
                    const platformList = broker.trading_platforms.split(',')
                        .map((r: string) => r.replace(/\s*\(.*?\)/g, '').trim())
                        .filter(Boolean)
                        .filter(r => r.toLowerCase() !== 'other');
                    if (platformList.length <= 2) return platformList.join(', ');
                    return `${platformList.slice(0, 2).join(', ')}, +${platformList.length - 2} others`;
                })() : "-", type: "text" },
                { label: "Islamic Acc", value: broker.islamicAccount ? "Yes" : "No", type: broker.islamicAccount ? "badge-dark" : "badge-danger" },
                { label: "Copy Trading", value: broker.copyTrading ? "Yes" : "No", type: broker.copyTrading ? "badge-dark" : "badge-danger" },
                { label: "Overall rating", value: broker.overall_rating || "0", type: "star" }
            ];
        }

        return {
            id: broker.id,
            name: broker.broker_name || "Unknown Broker",
            slug: broker.slug,
            typeSlug: (broker as any).type?.slug,
            logoUrl: logoUrl,
            stats: stats
        };
    }));
}
