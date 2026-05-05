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

const brokers = [
    {
        name: "Pepperstone",
        isViewing: true,
        stats: [
            { label: "Min Deposit", value: "$0", type: "text" },
            { label: "Raw Spread", value: "0.0 pips", type: "text" },
            { label: "Max Leverage", value: "1:400", type: "text" },
            { label: "Regulations", value: "7 Regs", type: "badge-primary" },
            { label: "Platforms", value: "MT4, MT5, cTrader,TV", type: "text" },
            { label: "Islamic Acc", value: "Yes", type: "badge-dark" },
            { label: "Copy Trading", value: "Yes", type: "badge-dark" },
            { label: "Overall rating", value: "4.8", type: "star" }
        ],

    },
    null,
    null
];

const EmptyCompareSlot = ({ onClick }: { onClick: () => void }) => (
    <div onClick={onClick} className="relative h-full rounded-xl border-[1.5px] border-dashed border-[#A8DD15] bg-[#FBFCFA] p-4 flex flex-col items-center justify-center text-center min-h-[380px] overflow-hidden cursor-pointer hover:bg-[#F5F8EA] transition-colors">
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
        <h4 className="text-[16px] font-bold text-[#1A1A1A] mb-2 z-10">Compare Broker</h4>
        <p className="text-[13px] text-[#666666] max-w-[220px] leading-relaxed z-10">Click to select another broker and see a detailed side-by-side comparison</p>
    </div>
);


export default function CompareBrokers({ broker, trustedBrokers = [] }: { broker: any, trustedBrokers?: any[] }) {
    const formatList = (str: string | null | undefined, max: number = 3) => {
        if (!str) return "None";
        const list = str.split(',')
            .map((r: string) => r.replace(/\s*\(.*?\)/g, '').trim())
            .filter(Boolean)
            .filter(r => r.toLowerCase() !== 'other');
        if (list.length <= max) return list.join(', ');
        return `${list.slice(0, max).join(', ')}, +${list.length - max} others`;
    };

    const initialBrokers = [
        {
            id: broker.id,
            name: broker.broker_name,
            slug: broker.slug,
            typeSlug: broker.type?.slug,
            logoUrl: broker.logoUrl,
            isViewing: true,
            stats: [
                { label: "Min Deposit", value: broker.minimum_deposit, type: "text" },
                { label: "Raw Spread", value: broker.minimum_raw_spreads, type: "text" },
                { label: "Max Leverage", value: broker.maxLeverage, type: "text" },
                { label: "Regulations", value: formatList(broker.regulators, 3), type: "text" },
                { label: "Platforms", value: formatList(broker.trading_platforms, 2), type: "text" },

                { label: "Islamic Acc", value: broker.islamicAccount ? "Yes" : "No", type: broker.islamicAccount ? "badge-dark" : "badge-danger" },
                { label: "Copy Trading", value: broker.copyTrading ? "Yes" : "No", type: broker.copyTrading ? "badge-dark" : "badge-danger" },
                { label: "Overall rating", value: broker.overall_rating, type: "star" }
            ],
        },
        null,
        null
    ];

    const filteredTrustedBrokers = trustedBrokers.filter(tb => tb.id !== broker.id);
    const [slots, setSlots] = useState<any[]>(initialBrokers);
    const [activeSlot, setActiveSlot] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [displayBrokers, setDisplayBrokers] = useState<any[]>(filteredTrustedBrokers.slice(0, 18));
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm) {
                setIsSearching(true);
                try {
                    const results = await searchBrokersAction(searchTerm, 'broker');
                    const currentSelectedIds = slots.filter(s => s !== null).map(s => s.id);
                    setDisplayBrokers(results.filter((b: any) => !currentSelectedIds.includes(b.id) && b.id !== broker.id));
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
                        const results = await searchBrokersAction("", 'broker');
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
    }, [searchTerm, trustedBrokers, slots]);

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
            case 'botprovider':
                return `/algo-trading/${slug}`;
            default:
                return `/forex-broker/${slug}`;
        }
    };

    return (
        <div id='compare-broker' className='rounded-xl scroll-mt-20 border border-border-light180 border-solid bg-white overflow-hidden'>
            <div className='p-4 relative flex items-center '>
                <div className='absolute top-3 left-0 w-1 h-[26px] bg-primary rounded-r-[4px]'></div>
                <h3 className='text-base text-black100 font-semibold uppercase'>
                    COMPARE BROKERS
                </h3>
            </div>
            <div className='px-4 pb-4'>
                <div className='border border-border-light300 border-solid bg-[#f0f1ec4d] rounded-xl px-4 pb-4 pt-10 mt-4'>
                    <div className='grid grid-cols-3 gap-5 items-start'>
                        {slots.map((broker, idx) => (
                            broker ? (
                                <div key={idx} className={`relative rounded-xl border p-4 ${broker.isViewing ? 'bg-[#F5F8EA] border-[#A8DD15]' : 'bg-white border-border-light300'}`}>
                                    {broker.isViewing && (
                                        <div className="absolute -top-[28px] left-1/2 -translate-x-1/2 h-[28px] flex items-center justify-center px-8 bg-primary rounded-t-xl text-[13px] font-semibold text-black">
                                            Viewing
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3 pb-4">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-[#f0f0f0] overflow-hidden shrink-0">
                                            {broker.logoUrl && (
                                                <img src={broker.logoUrl} alt={broker.name} className="max-w-[24px] max-h-[24px] object-contain" />
                                            )}
                                        </div>
                                        {broker.isViewing ? (
                                            <h4 className="text-[16px] font-bold text-black100">{broker.name}</h4>
                                        ) : (
                                            <Link href={getBrokerUrl(broker.slug, broker.typeSlug)} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline transition-colors">
                                                <h4 className="text-[16px] font-bold text-black100">{broker.name}</h4>
                                            </Link>
                                        )}
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

                                            const needsAlignment = ['Max Leverage', 'Regulations', 'Platforms'].includes(stat.label);

                                            return (
                                                <div
                                                    key={i}
                                                    className={`flex justify-between items-start gap-5 py-2 border-b border-[#e6e6e6] ${needsAlignment ? 'min-h-[60px]' : ''}`}
                                                >
                                                    <span className="text-[14px] font-medium text-black700">{stat.label}</span>
                                                    {stat.type === 'text' && (
                                                        <span className="text-[14px] font-semibold text-black100">{stat.value}</span>
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
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <EmptyCompareSlot key={idx} onClick={() => {
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
                        <DialogTitle className="text-xl font-bold text-black100">Select Broker to Compare</DialogTitle>
                        <div className="mt-4 relative">
                            <input
                                type="text"
                                placeholder="Search brokers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border-light300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                            />
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-black400" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </DialogHeader>
                    <div className="grid grid-cols-3 gap-2 overflow-y-auto px-6 pb-4 items-start min-h-[220px]">
                        {isSearching ? (
                            <div className="py-10 text-center col-span-full">
                                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-black600 font-medium">Searching brokers...</p>
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
                                                <img src={tb.logoUrl} alt={tb.name} className="max-w-[32px] max-h-[32px] object-contain" />
                                            ) : (
                                                <BrandIcon />
                                            )}
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-black100 group-hover:text-primary transition-colors">{tb.name}</h5>
                                            <p className="text-[12px] text-black600 font-medium">{tb.stats.find((s: any) => s.label === "Regulations")?.value || "Regulated"}</p>
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
                                <p className="text-black600 font-medium">No brokers found matching "{searchTerm}"</p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>

    )
}
