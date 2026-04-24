import React from 'react'
import PlatformFeatures from './platform-features';
import ProsCons from './pros-cons';
const RoundIcon = '/assets/images/round.svg';

const tradingHoursCol1 = [
    { label: "Currency Pairs", value: "Mon 00:00-Sat 00:00" },
    { label: "Crude Oil", value: "Mon 01:00 Fri 23:59" },
    { label: "Metals", value: "Mon 01:00 Fri 23:59" },
    { label: "Stocks", value: "Mon 10:00-Fri 22:55" },
];

const tradingHoursCol2 = [
    { label: "Commodities", value: "Mon 01:00-Fri 23:59" },
    { label: "Gold", value: "Mon 01:00- Fri 23:59" },
    { label: "Equity Indices", value: "Mon 00:01-Fri 23:59" },
    { label: "ETFS", value: "Mon 16:31-Fri 22:55" },
];

const accountFunding = [
    { label: "Account Types", value: "Standard, Razor (ECN)", isNew: true },
    { label: "Deposit Fee", value: "Free", isPositive: true },
    { label: "Withdrawal Fee", value: "Free", isPositive: true },
    { label: "Deposit Methods", value: "Visa, PayPal, Skrill, Bank Transfer" },
    { label: "Inactivity Fee", value: "$0" },
];

const tradingCostSpreads = [
    { label: "EUR/USD", value: "1.1 pips", isNew: true },
    { label: "GBP/USD", value: "1.4 pips" },
    { label: "Gold", value: "$0.15" },
    { label: "Bitcoin", value: "25" },
    { label: "WTI Crude", value: "$2.50" },
];

export default function TradingSpecifications() {
    return (
        <div id='trading-specifications' className='rounded-xl scroll-mt-20 border border-border-light180 border-solid bg-white overflow-hidden'>
            <div className='p-4 relative flex items-center '>
                <div className='absolute top-3 left-0 w-1 h-[26px] bg-primary rounded-r-[4px]'></div>
                <h3 className='text-base text-black100 font-semibold uppercase'>
                    Trading Specifications
                </h3>
            </div>
            <div className='px-4 pb-4'>
                <div className='grid grid-cols-2 gap-5'>

                    {/* Trading Hours */}
                    <div className='col-span-2 border border-border-light300 border-solid bg-[#f0f1ec4d] rounded-xl p-4'>
                        <div className='flex items-center gap-2 pb-3'>
                            <img src={RoundIcon} alt="RoundIcon" className='block' />
                            <span className='block text-base font-medium text-black'>
                                Trading Hours:
                            </span>
                        </div>
                        <div className='w-full h-[1px] bg-[linear-gradient(170deg,rgba(168,221,21,0.80)_0%,rgba(251,251,250,0.80)_60%)]'></div>
                        <div className='pt-2 grid grid-cols-[1fr_1px_1fr] gap-6'>
                            <div>
                                {tradingHoursCol1.map((detail, index) => (
                                    <div key={index} className='flex justify-between items-center py-2.5 last:pb-0 border-b border-border-light300 last:border-0 border-solid'>
                                        <div className='flex items-center gap-2'>
                                            <span className='text-[15px] font-medium text-black700'>{detail.label}</span>
                                        </div>
                                        <span className='text-[15px] font-medium text-black100 text-right'>{detail.value}</span>
                                    </div>
                                ))}
                            </div>
                            <div className='bg-border-light300 my-2'></div>
                            <div>
                                {tradingHoursCol2.map((detail, index) => (
                                    <div key={index} className='flex justify-between items-center py-2.5 last:pb-0 border-b border-border-light300 last:border-0 border-solid'>
                                        <div className='flex items-center gap-2'>
                                            <span className='text-[15px] font-medium text-black700'>{detail.label}</span>
                                        </div>
                                        <span className='text-[15px] font-medium text-black100 text-right'>{detail.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Account Funding */}
                    <div className='col-span-1 border border-border-light300 border-solid bg-[#f0f1ec4d] rounded-xl p-4'>
                        <div className='flex items-center gap-2 pb-3'>
                            <img src={RoundIcon} alt="RoundIcon" className='block' />
                            <span className='block text-base font-medium text-black'>
                                Account Funding:
                            </span>
                        </div>
                        <div className='w-full h-[1px] bg-[linear-gradient(170deg,rgba(168,221,21,0.80)_0%,rgba(251,251,250,0.80)_60%)]'></div>
                        <div className='pt-2'>
                            {accountFunding.map((detail, index) => (
                                <div key={index} className='flex justify-between items-center py-2.5 last:pb-0 border-b border-border-light300 last:border-0 border-solid'>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-[15px] font-medium text-black700'>{detail.label}</span>
                                        {detail.isNew && (
                                            <span className='text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#FCF2E1] text-[#D88A2E] leading-tight'>New</span>
                                        )}
                                    </div>
                                    {detail.isPositive ? (
                                        <span className='text-[12px] font-semibold px-3 py-0.5 rounded-full bg-[#E5F0DF] text-[#296D2C] leading-tight'>{detail.value}</span>
                                    ) : (
                                        <span className='text-[15px] font-medium text-black100 text-right'>{detail.value}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Trading Cost & Spreads */}
                    <div className='col-span-1 border border-border-light300 border-solid bg-[#f0f1ec4d] rounded-xl p-4'>
                        <div className='flex items-center gap-2 pb-3'>
                            <img src={RoundIcon} alt="RoundIcon" className='block' />
                            <span className='block text-base font-medium text-black'>
                                Trading Cost & Spreads:
                            </span>
                        </div>
                        <div className='w-full h-[1px] bg-[linear-gradient(170deg,rgba(168,221,21,0.80)_0%,rgba(251,251,250,0.80)_60%)]'></div>
                        <div className='pt-2'>
                            {tradingCostSpreads.map((detail, index) => (
                                <div key={index} className='flex justify-between items-center py-2.5 last:pb-0 border-b border-border-light300 last:border-0 border-solid'>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-[15px] font-medium text-black700'>{detail.label}</span>
                                        {detail.isNew && (
                                            <span className='text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#FCF2E1] text-[#D88A2E] leading-tight'>New</span>
                                        )}
                                    </div>
                                    <span className='text-[15px] font-medium text-black100 text-right'>{detail.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
            <div className='px-4'>
                <PlatformFeatures />
                <div className='pt-4'>
                    <ProsCons />
                </div>
            </div>

        </div>
    )
}
