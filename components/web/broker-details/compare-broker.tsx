import React from 'react'

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
        ],
        rating: 4.8
    },
    {
        name: "IC Markets",
        isViewing: false,
        stats: [
            { label: "Min Deposit", value: "$0", type: "text" },
            { label: "Raw Spread", value: "0.0 pips", type: "text" },
            { label: "Max Leverage", value: "1:400", type: "text" },
            { label: "Regulations", value: "7 Regs", type: "badge-primary" },
            { label: "Platforms", value: "MT4, MT5, cTrader,TV", type: "text" },
            { label: "Islamic Acc", value: "Yes", type: "badge-light" },
            { label: "Copy Trading", value: "Yes", type: "badge-light" },
        ],
        rating: 4.8
    },
    {
        name: "XM Broker",
        isViewing: false,
        stats: [
            { label: "Min Deposit", value: "$0", type: "text" },
            { label: "Raw Spread", value: "0.0 pips", type: "text" },
            { label: "Max Leverage", value: "1:400", type: "text" },
            { label: "Regulations", value: "7 Regs", type: "badge-primary" },
            { label: "Platforms", value: "MT4, MT5, cTrader,TV", type: "text" },
            { label: "Islamic Acc", value: "Yes", type: "badge-light" },
            { label: "Copy Trading", value: "Yes", type: "badge-light" },
        ],
        rating: 4.8
    }
];

export default function CompareBroker() {
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
                    <div className='grid grid-cols-3 gap-5'>
                        {brokers.map((broker, idx) => (
                            <div key={idx} className={`relative rounded-xl border p-4 ${broker.isViewing ? 'bg-[#F5F8EA] border-[#A8DD15]' : 'bg-white border-border-light300'}`}>
                                {broker.isViewing && (
                                    <div className="absolute -top-[28px] left-1/2 -translate-x-1/2 h-[28px] flex items-center justify-center px-8 bg-primary rounded-t-xl text-[13px] font-semibold text-black">
                                        Viewing
                                    </div>
                                )}

                                <div className="flex items-center gap-3 pb-4">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-[#f0f0f0] overflow-hidden shrink-0">
                                        <BrandIcon />
                                    </div>
                                    <h4 className="text-[16px] font-bold text-black100">{broker.name}</h4>
                                </div>

                                <div className="flex flex-col">
                                    {broker.stats.map((stat, i) => (
                                        <div key={i} className="flex justify-between items-center py-2 border-b border-[#e6e6e6]">
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
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center pt-4">
                                    <span className="text-[14px] font-semibold text-black700">{broker.rating}</span>
                                    <div className="flex items-center gap-[2px]">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <StarIcon key={star} filled={true} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
