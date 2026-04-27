"use client"
import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/common/dialog'
import { searchBrokersAction } from '~/app/(web)/broker/[slug]/actions';
import { X } from 'lucide-react';

const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "#FBA100" : "#E2E8F0"} xmlns="http://www.w3.org/2000/svg">
        <path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z" />
    </svg>
);

const BrandIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#0D61F2" />
        <path d="M9 7H13C14.6569 7 16 8.34315 16 10C16 11.6569 14.6569 13 13 13H11V16H9V7ZM11 9V11H13C13.5523 11 14 10.5523 14 10C14 9.44772 13.5523 9 13 9H11Z" fill="white" />
    </svg>
);



const EmptyCompareSlot = ({ onClick }: { onClick: () => void }) => (
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
        <h4 className="text-[16px] font-bold text-[#1A1A1A] mb-2 z-10">Compare CRM Software</h4>
        <p className="text-[13px] text-[#666666] max-w-[220px] leading-relaxed z-10">Click to select another CRM software and see a detailed side-by-side comparison</p>
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
            name: broker.broker_name,
            logoUrl: broker.logoUrl,
            isViewing: true,
            stats: (() => {
                const mt4 = broker.trading_platforms?.toLowerCase().includes('mt4');
                const mt5 = broker.trading_platforms?.toLowerCase().includes('mt5');
                const mt4mt5Value = mt4 && mt5 ? "Yes" : mt4 ? "MT4 only" : mt5 ? "MT5 only" : "No";
                const mt4mt5Type = mt4 && mt5 ? "badge-dark" : (mt4 || mt5) ? "badge-light" : "badge-danger";
                return [
                    { label: "MT4/MT5", value: mt4mt5Value, type: mt4mt5Type },
                    { label: "IB Module", value: broker.features?.some((f: string) => f.toLowerCase().includes('ib')) ? "Yes" : "No", type: broker.features?.some((f: string) => f.toLowerCase().includes('ib')) ? "badge-dark" : "badge-danger" },
                    { label: "Free Demo", value: broker.demoAccount ? "Yes" : "No", type: broker.demoAccount ? "badge-dark" : "badge-danger" },
                    { label: "Starting price", value: broker.starting_price || "-", type: "text" },
                    { label: "Overall rating", value: broker.overall_rating, type: "star" }
                ];
            })(),
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
                    const results = await searchBrokersAction(searchTerm);
                    setDisplayBrokers(results.filter((b: any) => b.id !== broker.id));
                } catch (error) {
                    console.error("Search failed:", error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setDisplayBrokers(filteredTrustedBrokers.slice(0, 18));
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, trustedBrokers]);

    const handleSelectBroker = (broker: any) => {
        if (activeSlot === null) return;
        const newSlots = [...slots];
        newSlots[activeSlot] = {
            name: broker.name,
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
        setSlots(newSlots);
    }

    return (
        <div id='compare-crm' className='rounded-xl scroll-mt-20 border border-border-light180 border-solid bg-white overflow-hidden'>
            <div className='p-4 relative flex items-center '>
                <div className='absolute top-3 left-0 w-1 h-[26px] bg-primary rounded-r-[4px]'></div>
                <h3 className='text-base text-black100 font-semibold uppercase'>
                    COMPARE CRM
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
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-[#f0f0f0] overflow-hidden shrink-0">
                                            {broker.logoUrl && (
                                                <img src={broker.logoUrl} alt={broker.name} className="max-w-[24px] max-h-[24px] object-contain" />
                                            )}
                                        </div>
                                        <h4 className="text-[16px] font-bold text-black100">{broker.name}</h4>
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
                                                    <div key={i} className="flex justify-between items-center pt-4">
                                                        <span className="text-[14px] font-semibold text-black700">{stat.label}</span>
                                                        <div className="flex items-center gap-[2px]">
                                                            {[1, 2, 3, 4, 5].map(star => (
                                                                <StarIcon key={star} filled={star <= Math.round(Number(stat.value))} />
                                                            ))}
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
                                <EmptyCompareSlot key={idx} onClick={() => setActiveSlot(idx)} />
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
                        <DialogTitle className="text-xl font-bold text-black100">Select CRM Software to Compare</DialogTitle>
                        <div className="mt-4 relative">
                            <input
                                type="text"
                                placeholder="Search CRM software..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border-light300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                            />
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-black400" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </DialogHeader>
                    <div className="grid grid-cols-3 gap-4 overflow-y-auto px-6 pb-6 items-start min-h-[300px]">
                        {isSearching ? (
                            <div className="py-10 text-center col-span-full">
                                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-black600 font-medium">Searching CRM software...</p>
                            </div>
                        ) : displayBrokers.length > 0 ? (
                            displayBrokers.map((tb: any, i: number) => (
                                <div
                                    key={i}
                                    onClick={() => handleSelectBroker(tb)}
                                    className="flex items-center justify-between p-4 border border-border-light300 rounded-xl cursor-pointer hover:border-primary hover:bg-[#F5F8EA] group transition-all"
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
                                            <p className="text-[12px] text-black600 font-medium">{tb.stats.find((s: any) => s.label === "Starting price")?.value || "CRM Provider"}</p>
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
                                <p className="text-black600 font-medium">No CRM software found matching "{searchTerm}"</p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>

    )
}
