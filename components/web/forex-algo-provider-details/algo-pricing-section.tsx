import React from 'react'

const RoundIcon = '/assets/images/round.svg';

interface AlgoPricingSectionProps {
    broker: any;
    sectionId?: string;
}

export default function AlgoPricingSection({ broker, sectionId = "pricing" }: AlgoPricingSectionProps) {
    const goldPrice = broker.gold_plan_price;
    const goldStatements = broker.gold_plan_statements || [];
    const diamondPrice = broker.diamond_plan_price;
    const diamondStatements = broker.diamond_plan_statements || [];

    // Don't render if no pricing data at all
    if (!goldPrice && !diamondPrice && goldStatements.length === 0 && diamondStatements.length === 0) {
        return null;
    }

    return (
        <div id={sectionId} className='rounded-xl scroll-mt-20 border border-border-light180 border-solid bg-white overflow-hidden'>
            <div className='p-4 relative flex items-center gap-3'>
                <div className='absolute top-3 left-0 w-1 h-[26px] bg-primary rounded-r-[4px]'></div>
                <h3 className='text-base text-black100 font-semibold uppercase'>
                    PRICING
                </h3>
            
            </div>
            <div className='px-4 pb-4'>
                <div className='grid grid-cols-2 gap-5'>
                    {/* Gold Plan */}
                    {(goldPrice || goldStatements.length > 0) && (
                        <div className='border border-border-light300 border-solid bg-[#f0f1ec4d] rounded-xl p-4'>
                            <div className='flex items-center justify-between pb-3'>
                                <div className='flex items-center gap-2'>
                                    <img src={RoundIcon} alt="RoundIcon" className='block' />
                                    <span className='block text-base font-medium text-black'>
                                        Gold Plan
                                    </span>
                                </div>
                                <span className='text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FCF2E1] text-[#D88A2E] leading-tight'>
                                    Most Popular
                                </span>
                            </div>
                            <div className='w-full h-[1px] bg-[linear-gradient(170deg,rgba(168,221,21,0.80)_0%,rgba(251,251,250,0.80)_60%)]'></div>
                            <div className='pt-4 pb-2 flex items-center gap-2'>
                                <p className='text-2xl font-bold text-black100'>
                                    {goldPrice || '-'}
                                </p>
                                <p className='text-sm text-black600 font-medium'>one-time</p>
                            </div>
                            {goldStatements.length > 0 && (
                                <div className='pt-2 flex  flex-col gap-2.5'>
                                    {goldStatements.map((statement: string, index: number) => (
                                        <div key={index} className='flex items-center gap-2.5'>
                                            <span className='mt-1.5 w-2 h-2 rounded-full bg-[#A8DD15] shrink-0'></span>
                                            <span className='text-[14px] font-medium text-black700 leading-tight'>{statement}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Diamond Plan */}
                    {(diamondPrice || diamondStatements.length > 0) && (
                        <div className='border border-border-light300 border-solid bg-[#f0f1ec4d] rounded-xl p-4'>
                            <div className='flex items-center  gap-2 pb-3'>
                                <img src={RoundIcon} alt="RoundIcon" className='block' />
                                <span className='block text-base font-medium text-black'>
                                    Diamond Plan
                                </span>
                            </div>
                            <div className='w-full h-[1px] bg-[linear-gradient(170deg,rgba(168,221,21,0.80)_0%,rgba(251,251,250,0.80)_60%)]'></div>
                            <div className='pt-4 pb-2 flex items-center gap-2'>
                                <p className='text-2xl font-bold text-black100'>
                                    {diamondPrice || '-'}
                                </p>
                                <p className='text-sm text-black600 font-medium'>one-time</p>
                            </div>
                            {diamondStatements.length > 0 && (
                                <div className='pt-2 flex flex-col gap-2.5'>
                                    {diamondStatements.map((statement: string, index: number) => (
                                        <div key={index} className='flex items-center gap-2.5'>
                                            <span className='mt-1.5 w-2 h-2 rounded-full bg-[#A8DD15] shrink-0'></span>
                                            <span className='text-[14px] font-medium text-black700 leading-tight'>{statement}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
