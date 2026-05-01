"use client"
import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/common/dialog'
import { searchBrokersAction } from '~/app/(web)/forex-broker/[slug]/actions';
import { X } from 'lucide-react';
import Link from 'next/link';

const StarIcon = ({ fillPercentage }: { fillPercentage: number }) => (
    <div className="relative inline-block w-4 h-4 shrink-0">
        {/* Empty Star (Gray) */}
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="#E2E8F0"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-0 left-0"
        >
            <path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z" />
        </svg>
        {/* Filled Star (Yellow) clipped by width */}
        <div
            className="absolute top-0 left-0 overflow-hidden h-full"
            style={{ width: `${fillPercentage}%` }}
        >
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="#FBA100"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z" />
            </svg>
        </div>
    </div>
);

const BrandIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#0D61F2" />
        <path d="M9 7H13C14.6569 7 16 8.34315 16 10C16 11.6569 14.6569 13 13 13H11V16H9V7ZM11 9V11H13C13.5523 11 14 10.5523 14 10C14 9.44772 13.5523 9 13 9H11Z" fill="white" />
    </svg>
);



const EmptyCompareSlot = ({ onClick, isEducation, isBridge, isLiquidity, isPSP, isTrading }: { onClick: () => void, isEducation: boolean, isBridge: boolean, isLiquidity: boolean, isPSP: boolean, isTrading: boolean }) => (
    <div onClick={onClick} className="relative rounded-xl border-[1.5px] border-dashed border-[#A8DD15] bg-[#FBFCFA] p-4 flex flex-col items-center justify-center text-center overflow-hidden cursor-pointer hover:bg-[#F5F8EA] transition-colors">
        {/* Decorative Circles */}
        <svg className="absolute top-[-30px] right-[-30px] opacity-40 pointer-events-none" width="180" height="180" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="80" cy="80" r="50" stroke="#A8DD15" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="80" cy="80" r="70" stroke="#A8DD15" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
        <svg className="absolute bottom-[-30px] left-[-30px] opacity-40 pointer-events-none" width="180" height="180" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="80" cy="80" r="50" stroke="#A8DD15" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="80" cy="80" r="70" stroke="#A8DD15" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
 
        <div className="w-[42px] h-[42px] bg-[#A8DD15] rounded-full flex items-center justify-center mb-4 z-10 transition-transform hover:scale-105">
            <div className="w-5 h-5 rounded-full border-[1.5px] border-[#1A1A1A] flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 1V9M1 5H9" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
        <h4 className="text-[16px] font-bold text-[#1A1A1A] mb-2 z-10">Compare {isEducation ? 'Trading Courses' : isBridge ? 'Bridge Providers' : isLiquidity ? 'Liquidity Providers' : isPSP ? 'PSP Partners' : isTrading ? 'Trading Platforms' : 'CRM Software'}</h4>
        <p className="text-[13px] text-[#666666] max-w-[220px] leading-relaxed z-10">Click to select another {isEducation ? 'trading course' : isBridge ? 'bridge provider' : isLiquidity ? 'liquidity provider' : isPSP ? 'PSP partner' : isTrading ? 'trading platform' : 'CRM software'} and see a detailed side-by-side comparison</p>
    </div>
);


export default function CompareBrokers({ broker, trustedBrokers = [] , sectionId }: { broker: any, trustedBrokers?: any[], sectionId?: string }) {
    const formatList = (str: string | null | undefined, max: number = 3, showOthersCount: boolean = true) => {
        if (!str) return "None";
        const list = str.split(',')
            .map((r: string) => {
                let item = r.replace(/\s*\(.*?\)/g, '').trim();
                if (item === "Hedge Funds") return "Funds";
                if (item === "Prop Trading Firms") return "Prop Firms";
                if (item === "Forex brokers") return "Brokers";
                return item;
            })
            .filter(Boolean)
            .filter(r => r.toLowerCase() !== 'other');
        if (list.length <= max) return list.join(', ');
        return showOthersCount 
            ? `${list.slice(0, max).join(', ')}, +${list.length - max} others`
            : `${list.slice(0, max).join(', ')}...`;
    };

    const isEducation = broker.type?.slug === 'educationplatforms';
    const isBridge = broker.type?.slug === 'forexbridge';
    const isLiquidity = broker.type?.slug === 'liquidity';
    const isPSP = broker.type?.slug === 'psp';
    const isTrading = broker.type?.slug === 'trading';

    const initialBrokers = [
        {
            id: broker.id,
            name: broker.broker_name,
            slug: broker.slug,
            typeSlug: broker.type?.slug,
            logoUrl: broker.logoUrl,
            isViewing: true,
            stats: (() => {
                if (isEducation) {
                    return [
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
                            value: broker.pricingModel&&broker.pricingModel.length>0 ? broker.pricingModel.join("/") : "-",
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
                        { label: "Score", value: broker.overall_rating || "0", type: "star" },
                    ];
                } else if (isBridge) {
                    return [
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
                            value: formatList(broker.target_clients?.join(", "), 3, false),
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
                            value: broker.pricingModel  && broker.pricingModel.length > 0 ? broker.pricingModel.join("/") : "-",
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
                } else if (isLiquidity) {
                    return [
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
                            value: formatList(broker.asset_classes?.join(", "), 2),
                            type: "text",
                        },
                        {
                            label: "No last look",
                            value: broker.no_last_look ? "Yes" : "No",
                            type: broker.no_last_look ? "badge-dark" : "badge-danger",
                        },
                        {
                            label: "Target clients",
                            value: formatList(broker.target_clients?.join(", "), 3, false),
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
                            value: broker.pricingModel&&broker.pricingModel.length>0 ? broker.pricingModel.join("/") : "-",
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
                } else if (isPSP) {
                    return [
                        {
                            label: "Company type",
                            value: broker.company_type || "-",
                            type: "text",
                        },
                        {
                            label: "Target clients",
                            value: formatList(broker.target_clients?.join(", "), 3, false),
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
                } else if (isTrading) {
                    return [
                        {
                            label: "Platform type",
                            value: broker.platform_type?.join(" / ") || "-",
                            type: "text"
                        },
                        {
                            label: "Best for",
                            value: broker.bestFor&& broker.bestFor.length>0 ? broker.bestFor?.join(', ') : '-',
                            type: "text"
                        },
                        {
                            label: "White label price",
                            value: broker.white_label_price || "-",
                            type: "text"
                        },
                        {
                            label: "Server licence",
                            value: broker.server_license || "-",
                            type: "text"
                        },
                        {
                            label: "Deployment",
                            value: broker.deployment_type?.join(", ") || "-",
                            type: "text"
                        },
                        {
                            label: "Charting",
                            value: broker.charting_tools?.join(" + ") || "-",
                            type: "text"
                        },
                        {
                            label: "MT5 backend",
                            value: broker.mt5_backend ? "Supported" : "No",
                            type: broker.mt5_backend ? "badge-success" : "badge-danger"
                        },
                        {
                            label: "Prop firm tools",
                            value: broker.prop_firm_support?.join(", ") || "-",
                            type: "text"
                        },
                        {
                            label: "Setup time",
                            value: broker.setup_time || "-",
                            type: "text"
                        },
                        {
                            label: "Yearly commitment",
                            value: broker.yearly_commitment ? "Required" : "Not required",
                            type: broker.yearly_commitment ? "badge-danger" : "badge-success"
                        },
                        {
                            label: "Hosting included",
                            value: broker.hosting_included ? "Yes" : "No",
                            type: broker.hosting_included ? "badge-success" : "badge-danger"
                        },
                        {
                            label: "Demo available",
                            value: broker.demoAccount ? "Yes" : "No",
                            type: broker.demoAccount ? "badge-success" : "badge-danger"
                        },
                        {
                            label: `Clients (${new Date().getFullYear()})`,
                            value: broker.clients_count || "-",
                            type: "text"
                        },
                        { label: "Overall rating", value: broker.overall_rating, type: "star" }
                    ];
                }

                const mt4 = broker.trading_platforms?.toLowerCase().includes('mt4');
                const mt5 = broker.trading_platforms?.toLowerCase().includes('mt5');
                const mt4mt5Value = mt4 && mt5 ? "Yes" : mt4 ? "MT4 only" : mt5 ? "MT5 only" : "No";
                const mt4mt5Type = mt4 && mt5 ? "badge-dark" : (mt4 || mt5) ? "badge-light" : "badge-danger";

                return [
                    { label: "MT4/MT5", value: mt4mt5Value, type: mt4mt5Type },
                    {
                        label: "IB/Affiliate Module",
                        value: broker.features?.some((f: string) => f.toLowerCase().includes('ib')) ? "Yes" : "No",
                        type: broker.features?.some((f: string) => f.toLowerCase().includes('ib')) ? "badge-dark" : "badge-danger"
                    },
                    {
                        label: "KYC/AML automation",
                        value: broker.features?.some((f: string) => {
                            const lowerF = f.toLowerCase();
                            return lowerF.includes("kyc") || lowerF.includes("aml");
                        }) ? "Yes" : "No",
                        type: broker.features?.some((f: string) => {
                            const lowerF = f.toLowerCase();
                            return lowerF.includes("kyc") || lowerF.includes("aml");
                        }) ? "badge-dark" : "badge-danger"
                    },
                    {
                        label: "Client Portal",
                        value: broker.features?.some((f: string) => f.toLowerCase().includes("client portal")) ? "Yes" : "No",
                        type: broker.features?.some((f: string) => f.toLowerCase().includes("client portal")) ? "badge-dark" : "badge-danger"
                    },
                    { label: "Free Demo", value: broker.demoAccount ? "Yes" : "No", type: broker.demoAccount ? "badge-dark" : "badge-danger" },
                    {
                        label: "API access",
                        value: broker.api_access ? "Yes" : "No",
                        type: broker.api_access ? "badge-dark" : "badge-danger"
                    },
                    {
                        label: "Deployment Type",
                        value: broker.deployment_type && broker.deployment_type.length > 0 && broker.deployment_type.join(",") || "-",
                        type: "text"
                    },
                    { label: "Starting price", value: broker.starting_price || "-", type: "text" },
                    {
                        label: "Best For",
                        value: broker.bestFor?.join(", ") || "-",
                        type: "text"
                    },
                    { label: "Overall rating", value: broker.overall_rating, type: "star" }
                ];
            })(),
        },
        null,
        null
    ];

    const [slots, setSlots] = useState<any[]>(initialBrokers);
    const [activeSlot, setActiveSlot] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Calculate initial filtered list using initialBrokers since slots state isn't available for the initial render's value
    const initialSelectedIds = initialBrokers.filter(s => s !== null).map(s => s.id);
    const [displayBrokers, setDisplayBrokers] = useState<any[]>(trustedBrokers.filter(tb => !initialSelectedIds.includes(tb.id)).slice(0, 18));
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            const typeSlug = isEducation ? 'educationplatforms' : isBridge ? 'forexbridge' : isLiquidity ? 'liquidity' : isPSP ? 'psp' : isTrading ? 'trading' : 'crm';
            if (searchTerm) {
                setIsSearching(true);
                try {
                    const results = await searchBrokersAction(searchTerm, typeSlug);
                    const currentSelectedIds = slots.filter(s => s !== null).map(s => s.id);
                    setDisplayBrokers(results.filter((b: any) => !currentSelectedIds.includes(b.id)));
                } catch (error) {
                    console.error("Search failed:", error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                if (trustedBrokers.length > 0) {
                    const currentSelectedIds = slots.filter(s => s !== null).map(s => s.id);
                    setDisplayBrokers(trustedBrokers.filter(tb => !currentSelectedIds.includes(tb.id)).slice(0, 18));
                } else {
                    // If no trusted brokers, fetch some initial results
                    setIsSearching(true);
                    try {
                        const results = await searchBrokersAction("", typeSlug);
                        const currentSelectedIds = slots.filter(s => s !== null).map(s => s.id);
                        setDisplayBrokers(results.filter((b: any) => !currentSelectedIds.includes(b.id)));
                    } catch (error) {
                        console.error("Initial fetch failed:", error);
                    } finally {
                        setIsSearching(false);
                    }
                }
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, trustedBrokers, isEducation, isBridge, isLiquidity, isPSP, isTrading, slots]);

    const handleSelectBroker = (broker: any) => {
        if (activeSlot === null) return;
        const newSlots = [...slots];
        newSlots[activeSlot] = {
            id: broker.id,
            name: broker.name,
            slug: broker.slug,
            typeSlug: broker.typeSlug,
            isViewing: false,
            logoUrl: broker.logoUrl,
            stats: broker.stats
        };
        setSlots(newSlots);
        setActiveSlot(null);
    }

    const handleRemoveBroker = (idx: number) => {
        const newSlots = [...slots];
        newSlots[idx] = null;

        // If removing the second slot (index 1) and third slot (index 2) has a broker,
        // shift the third broker to the second slot
        if (idx === 1 && newSlots[2] !== null) {
            newSlots[1] = newSlots[2];
            newSlots[2] = null;
        }

        setSlots(newSlots);
    }

    const getBrokerUrl = (slug: string, typeSlug: string) => {
        if (!slug) return "#";
        switch (typeSlug) {
            case 'crm':
                return `/forex-crm-providers/${slug}`;
            case 'liquidity':
                return `/liquidity-providers/${slug}`;
            case 'forexbridge':
                return `/forex-bridge-providers/${slug}`;
            case 'educationplatforms':
                return `/forex-trading-courses/${slug}`;
            case 'psp':
                return `/forex-psp-partners/${slug}`;
            default:
                return `/broker/${slug}`;
        }
    };

    return (
        <div id={sectionId || (isEducation ? 'compare-trading-courses' : isBridge ? 'compare-bridge-providers' : isLiquidity? 'compare-liquidity-providers': isPSP ? 'compare-psp-partners' : isTrading ? 'compare-trading-platforms' : 'compare-crm')} className='rounded-xl scroll-mt-20 border border-border-light180 border-solid bg-white overflow-hidden'>
            <div className='p-4 relative flex items-center '>
                <div className='absolute top-3 left-0 w-1 h-[26px] bg-primary rounded-r-[4px]'></div>
                <h3 className='text-base text-black100 font-semibold uppercase'>
                    COMPARE {isEducation ? 'TRADING COURSES' : isBridge ? 'BRIDGE PROVIDERS' : isLiquidity? 'LIQUIDITY PROVIDERS': isPSP ? 'PSP PARTNERS' : isTrading ? 'TRADING PLATFORMS' : 'CRM'}
                </h3>
            </div>
            <div className='px-4 pb-4'>
                <div className='border border-border-light300 border-solid bg-[#f0f1ec4d] rounded-xl px-4 pb-4 pt-10 mt-4'>
                    <div className='grid grid-cols-3 gap-5 items-stretch'>
                        {slots.map((broker, idx) => (
                            broker ? (
                                <div key={idx} className={`relative rounded-xl border p-4 ${broker.isViewing ? 'bg-[#F5F8EA] border-[#A8DD15]' : 'bg-white border-border-light300'}`}>
                                    {broker.isViewing && (
                                        <div className="absolute -top-[28px] left-1/2 -translate-x-1/2 h-[28px] flex items-center justify-center px-8 bg-primary rounded-t-xl text-[13px] font-semibold text-black">
                                            Viewing
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3 pb-4">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-[#f0f0f0] overflow-hidden shrink-0">
                                            {broker.logoUrl ? (
                                                <img
                                                    src={broker.logoUrl}
                                                    alt={broker.name}
                                                    className="w-full h-full p-2 object-contain"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = '/assets/images/FBL Logo.png'; // Fallback to a real image if available
                                                    }}
                                                />
                                            ) : (
                                                <BrandIcon />
                                            )}
                                        </div>
                                        <Link href={getBrokerUrl(broker.slug, broker.typeSlug)} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline transition-colors">
                                            <h4 className="text-[16px] font-bold text-black100">{broker.name}</h4>
                                        </Link>
                                    </div>

                                    {!broker.isViewing && (
                                        <button
                                            onClick={() => handleRemoveBroker(idx)}
                                            className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-full bg-gray-50 text-black400 hover:bg-red-50 hover:text-red-500 transition-all border border-border-light200 shadow-sm cursor-pointer"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}

                                    <div className="flex flex-col">
                                        {broker.stats.map((stat: any, i: number) => {
                                            if (stat.type === 'star') {
                                                return (
                                                    <div key={i} className="flex justify-between items-center py-2 border-b border-[#e6e6e6]">
                                                        <span className="text-[14px] font-medium text-black700">{stat.label}</span>
                                                        <div className="flex items-center gap-1.5 bg-[#F0F2EC66] rounded-full px-3 py-0.5 border border-[#1212120D]">
                                                            <div className="flex items-center gap-[1px]">
                                                                {[...Array(5)].map((_, i) => {
                                                                    const rating = parseFloat(stat.value || '0');
                                                                    const fillPercentage = Math.min(100, Math.max(0, (rating - i) * 100));
                                                                    return (
                                                                        <StarIcon
                                                                            key={i}
                                                                            fillPercentage={fillPercentage}
                                                                        />
                                                                    );
                                                                })}
                                                            </div>
                                                            <span className="text-[12px] font-bold text-black100">{stat.value}/5</span>
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            const needsAlignment = [
                                                'Skill level',
                                                'Learning format',
                                                'Deployment Type',
                                                'Deployment',
                                                'Best For',
                                                'Best for',
                                                'Pricing model',
                                                'HQ / Region',
                                                'MT4/MT5',
                                                'IB/Affiliate Module',
                                                'KYC/AML automation',
                                                'Client Portal',
                                                'Max Leverage',
                                                'Regulations',
                                                'Platforms',
                                                'Solution type',
                                                'Compatible platforms',
                                                'Latency',
                                                'Execution latency',
                                                'Asset classes',
                                                'No last look',
                                                'Target clients',
                                                'Setup time',
                                                'Demo available',
                                                'Regulators',
                                                'Company type',
                                                'Settlement',
                                                'Auto fiat conversion',
                                                'Supported cryptos',
                                                'Fiat currencies',
                                                'Integration',
                                                'KYB required',
                                                'Mass payout',
                                                'Platform type',
                                                'White label price',
                                                'Server licence',
                                                'Charting',
                                                'MT5 backend',
                                                'Prop firm tools',
                                                'Yearly commitment',
                                                'Hosting included',
                                                `Clients (${new Date().getFullYear()})`
                                            ].includes(stat.label);

                                            return (
                                                <div
                                                    key={i}
                                                    className={`grid grid-cols-[120px_1fr] gap-4 py-2 border-b border-[#e6e6e6] items-start ${(isEducation || isBridge || isLiquidity || isPSP || isTrading) && needsAlignment ? 'min-h-[63px]' : ''}`}
                                                >
                                                    <span className="text-[14px] font-medium text-black700">{stat.label}</span>
                                                    <div className="flex justify-end">
                                                        {stat.type === 'text' && (
                                                            <span className="text-[14px] font-semibold text-black100 text-right leading-tight">{stat.value}</span>
                                                        )}
                                                        {stat.type === 'badge-primary' && (
                                                            <span className="bg-[#A8DD15] text-black text-[11px] font-semibold px-2.5 py-0.5 rounded-full">{stat.value}</span>
                                                        )}
                                                        {stat.type === 'badge-dark' && (
                                                            <span className="bg-[#346B5A] text-white text-[11px] font-semibold px-4 py-0.5 rounded-full">{stat.value}</span>
                                                        )}
                                                        {stat.type === 'badge-light' && (
                                                            <span className="bg-[#EAF0E2] text-[#346B5A] text-[11px] font-semibold px-4 py-0.5 rounded-full">{stat.value}</span>
                                                        )}
                                                        {stat.type === 'badge-danger' && (
                                                            <span className="bg-[#FEE2E2] text-[#991B1B] text-[11px] font-semibold px-4 py-0.5 rounded-full">{stat.value}</span>
                                                        )}
                                                        {stat.type === 'badge-success' && (
                                                            <span className="bg-[#E5F0DF] text-[#296D2C] text-[11px] font-semibold px-4 py-0.5 rounded-full">{stat.value}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <EmptyCompareSlot key={idx} isEducation={isEducation} isBridge={isBridge} isLiquidity={isLiquidity} isPSP={isPSP} isTrading={isTrading} onClick={() => {
                                    // Find the first empty slot from left to right (excluding slot 0 which is always occupied)
                                    const firstEmptySlot = slots.findIndex((slot, index) => index > 0 && slot === null);
                                    setActiveSlot(firstEmptySlot !== -1 ? firstEmptySlot : idx);
                                }} />
                            )
                        ))}
                    </div>
                </div>
            </div>

            <Dialog open={activeSlot !== null} onOpenChange={(open) => {
                if (!open) {
                    setActiveSlot(null);
                    setSearchTerm("");
                }
            }}>
                <DialogContent className="max-w-6xl max-h-[85vh] overflow-hidden flex flex-col p-0 border-none shadow-2xl">
                    <DialogHeader className="p-6 pb-4 bg-white sticky top-0 z-10">
                        <DialogTitle className="text-xl font-bold text-black100">Select {isEducation ? 'Trading Course' : isBridge ? 'Bridge Provider' : isLiquidity ? 'Liquidity Provider' : isPSP ? 'PSP Partner' : 'CRM Software'} to Compare</DialogTitle>
                        <div className="mt-4 relative">
                            <input
                                type="text"
                                placeholder={`Search ${isEducation ? 'trading courses' : isBridge ? 'bridge providers' : isLiquidity ? 'liquidity providers' : isPSP ? 'PSP partners' : 'CRM software'}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border-light300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                            />
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-black400" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </DialogHeader>
                    <div className="grid grid-cols-3 gap-2  overflow-y-auto px-6 pb-4 items-start min-h-[220px]">
                        {isSearching ? (
                            <div className="py-10 text-center col-span-full">
                                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-black600 font-medium">Searching {isEducation ? 'trading courses' : isBridge ? 'bridge providers' : isLiquidity ? 'liquidity providers' : isPSP ? 'PSP partners' : 'CRM software'}...</p>
                            </div>
                        ) : displayBrokers.length > 0 ? (
                            displayBrokers.map((tb: any, i: number) => (
                                <div
                                    key={i}
                                    onClick={() => handleSelectBroker(tb)}
                                    className="flex items-center justify-between p-3 border border-border-light300 rounded-xl cursor-pointer hover:border-primary hover:bg-[#F5F8EA] group transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-sm border border-border-light200 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                                            {tb.logoUrl ? (
                                                <img src={tb.logoUrl} alt={tb.name} className="w-full h-full p-2 object-contain" />
                                            ) : (
                                                <BrandIcon />
                                            )}
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-black100 group-hover:text-primary transition-colors">{tb.name}</h5>
                                            <p className="text-[12px] text-black600 font-medium">{tb.stats.find((s: any) => s.label === "Starting price" || s.label === "Skill level" || s.label === "Provider type" || s.label === "Company type")?.value || (isEducation ? "Education Provider" : isLiquidity ? "Liquidity Provider" : isPSP ? "PSP Partner" : "CRM Provider")}</p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-10 text-center col-span-full">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="text-black300" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <p className="text-black600 font-medium">No {isEducation ? 'trading courses' : isBridge ? 'bridge providers' : isLiquidity ? 'liquidity providers' : isPSP ? 'PSP partners' : 'CRM software'} found matching "{searchTerm}"</p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>

    )
}
