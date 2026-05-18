import React from 'react'

export default function Suggestions() {
    return (
        <div className='grid grid-cols-1 gap-4'>
            <div className='border border-border-light300 bg-[#F4F4F4] rounded-md p-3'>
                <p className='text-base font-medium text-black700'>
                    The closure of a critical energy chokepoint is a structural shock. Focus on energy-linked currencies and broad risk-off positioning.
                </p>
            </div>
            <div>
                <h2 className='text-lg font-semibold text-black100 mb-3'>
                    watchlist
                </h2>
                <div className='border border-border-light300 bg-[#F4F4F4] rounded-md p-3'>
                    <div className='flex items-center gap-3 pb-3'>
                        <p className='text-lg font-medium text-black100'>
                            Oil
                        </p>
                        <button className='py-1 px-3 text-sm font-medium text-[#2AA411] flex items-center gap-2 rounded-[6px] bg-[rgba(42,164,17,0.10)]'>
                            Target: 2.0%
                        </button>
                        <button className='py-1 px-3 text-sm font-medium text-black100 flex items-center gap-2 rounded-[6px] bg-white'>
                            CONF: 80
                        </button>
                    </div>
                    <div className='flex gap-3'>
                        <p className='text-base font-medium text-black700'>
                            <span className='text-black100'> Reasoning : </span> Direct supply disruption.
                        </p>
                        <div className='w-[1px] h-[20px] bg-[rgba(26,26,26,0.14)]'></div>
                        <p className='text-base font-medium text-black700'>
                            <span className='text-black100'> Market Logic : </span> Direct supply disruption.
                        </p>
                    </div>
                </div>
                <p className='text-base font-medium mt-3 text-black700'>
                    <span className='text-black100'> Invalidation : </span> Strait reopening.
                </p>
            </div>

        </div>
    )
}
