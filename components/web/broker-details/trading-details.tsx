import React from 'react'
const RoundIcon = '/assets/images/round.svg';

export default function TradingDetails({ broker,leftHeader,rightHeader,leftSideDetails,rightSideDetails,tradingDetailsLabel,tradingDetailsId }: { broker: any,leftHeader?:string,rightHeader?:string,leftSideDetails?:any,rightSideDetails?:any,tradingDetailsLabel?:string,tradingDetailsId?:string}) {
    const brokerDetails = leftSideDetails || [
        { label: "Headquarters", value: broker.headquarters || "-" },
        { label: "Established", value: broker.year_established || "-" },
        { label: "Min Deposit", value: broker.minimum_deposit || "-" },
        { label: "Execution", value: broker.execution_types || "-" },
        { label: "Regulators", value: broker.regulators || "-" },
         { label: "Max Leverage", value: broker.maxLeverage || "-", isNew: true },
        { label: "Total Instruments", value: broker.totalInstruments || "-", isNew: true },
        { label: "India Available", value: broker.availableInIndia ? "Yes" : "No", isNew: true, isPositive: broker.availableInIndia },
       
    ];


    const additionalDetails = rightSideDetails || [
               { label: "Retail Loss Rate", value: broker.retail_loss_rate || "-" },
        { label: "Min Raw Spreads", value: broker.minimum_raw_spreads || "-" },
        { label: "Min Std Spreads", value: broker.minimum_standard_spreads || "-" },
        { label: "Min Commission", value: broker.minimum_commission_for_forex|| "-" },

       
               { label: "Islamic Account", value: broker.islamicAccount ? "Yes" : "No", isNew: true, isPositive: broker.islamicAccount },
               { label: "Demo Account", value: broker.demoAccount ? "Yes" : "No", isNew: true, isPositive: broker.demoAccount },
               { label: "Copy Trading", value: broker.copyTrading ? "Yes" : "No", isNew: true, isPositive: broker.copyTrading },
    
            ];

    return (
        <div id={tradingDetailsId||'broker-trading-details'} className='rounded-xl scroll-mt-20 border border-border-light180 border-solid bg-white overflow-hidden'>
            <div className='p-4 relative flex items-center '>
                <div className='absolute top-3 left-0 w-1 h-[26px] bg-primary rounded-r-[4px]'></div>
                <h3 className='text-base text-black100 font-semibold uppercase'>
{tradingDetailsLabel||"BROKER & TRADING DETAILS"}
                </h3>
            </div>
            <div className='px-4 pb-4'>
                <div className='grid grid-cols-2 gap-5'>
                    <div className='border border-border-light300 border-solid bg-[#f0f1ec4d] rounded-xl p-4'>
                        <div className='flex items-center gap-2 pb-3'>
                            <img src={RoundIcon} alt="RoundIcon" className='block' />
                            <span className='block text-base font-medium text-black'>
                                {leftHeader||"Broker Details:"}
                            </span>
                        </div>
                        <div className='w-full h-[1px] bg-[linear-gradient(170deg,rgba(168,221,21,0.80)_0%,rgba(251,251,250,0.80)_60%)]'></div>
                        <div className='pt-2'>
                            {brokerDetails.map((detail:any, index:number) => (
                                <div key={index} className='flex justify-between items-center last:pb-0 py-2 border-b border-border-light300 last:border-0 border-solid'>
                                    <span className='text-[15px] font-medium text-black700'>{detail.label}</span>
                                      {detail.isPositive !== undefined ? (
                                        detail.isPositive ? (
                                          <span className='text-[13px] font-semibold px-3 py-1 rounded-full bg-[#E5F0DF] text-[#296D2C] leading-tight'>{detail.value}</span>
                                        ) : (
                                          <span className='text-[13px] font-semibold px-3 py-1 rounded-full bg-[#FEE2E2] text-[#991B1B] leading-tight'>{detail.value}</span>
                                        )
                                      ) : (
                                          <span className='text-[15px] font-medium text-black100 text-right'>{detail.value}</span>
                                      )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='border border-border-light300 border-solid bg-[#f0f1ec4d] rounded-xl p-4'>
                        <div className='flex items-center gap-2 pb-3'>
                            <img src={RoundIcon} alt="RoundIcon" className='block' />
                            <span className='block text-base font-medium text-black'>
                                {rightHeader||"Trading Condition:"}
                            </span>
                        </div>
                        <div className='w-full h-[1px] bg-[linear-gradient(170deg,rgba(168,221,21,0.80)_0%,rgba(251,251,250,0.80)_60%)]'></div>
                        <div className='pt-2'>
                            {additionalDetails.map((detail:any, index:number) => (
                                <div key={index} className='flex justify-between items-center last:pb-0 py-2 border-b border-border-light300 last:border-0 border-solid'>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-[15px] font-medium text-black700'>{detail.label}</span>
                                        {/* {detail.isNew && (
                                            <span className='text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#FCF2E1] text-[#D88A2E] leading-tight'>New</span>
                                        )} */}
                                    </div>
                                    {detail.isPositive !== undefined ? (
                                        detail.isPositive ? (
                                          <span className='text-[13px] font-semibold px-3 py-1 rounded-full bg-[#E5F0DF] text-[#296D2C] leading-tight'>{detail.value}</span>
                                        ) : (
                                          <span className='text-[13px] font-semibold px-3 py-1 rounded-full bg-[#FEE2E2] text-[#991B1B] leading-tight'>{detail.value}</span>
                                        )
                                      ) : (
                                          <span className='text-[15px] font-medium text-black100 text-right'>{detail.value}</span>
                                      )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

