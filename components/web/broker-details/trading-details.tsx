import React from 'react'
const RoundIcon = '/assets/images/round.svg';

const brokerDetails = [
    { label: "Headquarters", value: "Australia" },
    { label: "Established", value: "2010" },
    { label: "Min Deposit", value: "$0" },
    { label: "Execution", value: "NDD" },
    { label: "Regulators", value: "ASIC, BaFin, CySEC, FCA, DFSA" },
    { label: "Max Leverage", value: "1:400", isNew: true },
    { label: "Total Instruments", value: "1,200+", isNew: true },
    { label: "India Available", value: "Yes", isNew: true, isPositive: true }
];

export default function TradingDetails() {
    return (
        <div id='broker-trading-details' className='rounded-xl scroll-mt-20 border border-border-light180 border-solid bg-white overflow-hidden'>
            <div className='p-4 relative flex items-center '>
                <div className='absolute top-3 left-0 w-1 h-[26px] bg-primary rounded-r-[4px]'></div>
                <h3 className='text-base text-black100 font-semibold uppercase'>
                    BROKER & TRADING DETAILS
                </h3>
            </div>
            <div className='px-4 pb-4'>
                <div className='grid grid-cols-2 gap-5'>
                    {
                        [...Array(2)].map(() => {
                            return (
                                <div className='border border-border-light300 border-solid bg-[#f0f1ec4d] rounded-xl p-4'>
                                    <div className='flex items-center gap-2 pb-3'>
                                        <img src={RoundIcon} alt="RoundIcon" className='block' />
                                        <span className='block text-base font-medium text-black'>
                                            Broker Details:
                                        </span>
                                    </div>
                                    <div className='w-full h-[1px] bg-[linear-gradient(170deg,rgba(168,221,21,0.80)_0%,rgba(251,251,250,0.80)_60%)]'></div>
                                    <div className='pt-2'>
                                        {brokerDetails.map((detail, index) => (
                                            <div key={index} className='flex justify-between items-center last:pb-0 py-2 border-b border-border-light300 last:border-0 border-solid'>
                                                <div className='flex items-center gap-2'>
                                                    <span className='text-[15px] font-medium text-black700'>{detail.label}</span>
                                                    {detail.isNew && (
                                                        <span className='text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#FCF2E1] text-[#D88A2E] leading-tight'>New</span>
                                                    )}
                                                </div>
                                                {detail.isPositive ? (
                                                    <span className='text-[13px] font-semibold px-3 py-1 rounded-full bg-[#E5F0DF] text-[#296D2C] leading-tight'>{detail.value}</span>
                                                ) : (
                                                    <span className='text-[15px] font-medium text-black100 text-right'>{detail.value}</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

