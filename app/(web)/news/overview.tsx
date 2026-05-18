import React from 'react'

export default function Overview() {
    return (
        <div>
            <div className='grid grid-cols-3 gap-3'>
                {
                    [...Array(6)].map(() => {
                        return (
                            <div className='p-3 rounded-md border border-border-light300 bg-[#F4F4F4]'>
                                <p className='text-sm font-medium text-black700 text-center mb-1'>
                                    HAWKISH/DOVISH
                                </p>
                                <h3 className='text-xl font-medium text-black100 text-center'>
                                    0/10
                                </h3>
                            </div>
                        )
                    })
                }
            </div>
            <div className='py-5'>
                <div className='border border-border-light300 bg-[#F4F4F4] rounded-md p-3'>
                    <p className='text-base font-medium text-black700'>
                        <span className='text-black100'> Executive Summary : </span> The confirmed closure of the Strait of Hormuz is a high-impact geopolitical event. It creates a structural supply shock for energy, driving immediate risk-off sentiment. Market participants should expect heightened volatility and prioritize safe-haven assets while monitoring energy-
                        linked currencies.
                    </p>
                </div>
            </div>
            <div>
                <h3 className='text-lg font-semibold text-black100 mb-3'>
                    Category Impacts
                </h3>
                <div className='grid grid-cols-3 gap-3 pb-4'>
                    {[
                        { label: "Forex", val: 6, max: 10 },
                        { label: "Crypto", val: 4, max: 10 },
                        { label: "Equities", val: 7, max: 10 },
                        { label: "Text Clarity", val: 6, max: 10 },
                        { label: "Shock Magnitude", val: 6, max: 10 },
                        { label: "Cross Asset Logic", val: 6, max: 10 },
                    ].map((item) => (
                        <div key={item.label} className='p-3 rounded-lg border border-border-light300 bg-[#F4F4F4]'>
                            <div className='flex items-center justify-between mb-2'>
                                <span className='text-sm font-semibold text-black700'>{item.label}</span>
                                <span className='text-sm font-semibold text-black100'>{item.val}/{item.max}</span>
                            </div>
                            <div className='h-2 bg-[#E2E2E2] rounded-full overflow-hidden'>
                                <div
                                    className='h-full bg-primary rounded-full'
                                    style={{ width: `${(item.val / item.max) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
