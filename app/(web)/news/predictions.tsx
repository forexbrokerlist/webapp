import React from 'react'

export default function Predictions() {
    return (
        <div className='grid grid-cols-1 gap-4'>
            <div>
                <h2 className='text-lg font-semibold text-black100 mb-1'>
                    SPX Bearish <span className='text-sm  text-black700'>Bearish</span>
                </h2>
                <p className='text-base font-medium text-black700'>
                    <span className='text-black100'> Duration : </span> short_term.
                </p>
            </div>
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
                                <p className='text-sm font-medium text-black700 text-center mb-1'>
                                    Entry
                                </p>
                            </div>
                        )
                    })
                }
            </div>
            <div className='grid grid-cols-1 gap-3 '>
                {[
                    { label: "Forex", val: 6, max: 10 },
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
            <div>
                <h2 className='text-lg font-semibold text-black100 mb-1'>
                    USD/CAD <span className='text-sm  text-black700'>Bearish</span>
                </h2>
                <p className='text-base font-medium text-black700'>
                    <span className='text-black100'> Duration : </span> short_term.
                </p>
            </div>
            <div className='grid grid-cols-3 gap-3'>
                {
                    [...Array(3)].map(() => {
                        return (
                            <div className='p-3 rounded-md border border-border-light300 bg-[#F4F4F4]'>
                                <p className='text-sm font-medium text-black700 text-center mb-1'>
                                    HAWKISH/DOVISH
                                </p>
                                <h3 className='text-xl font-medium text-black100 text-center'>
                                    0/10
                                </h3>
                                <p className='text-sm font-medium text-black700 text-center mb-1'>
                                    Entry
                                </p>
                            </div>
                        )
                    })
                }
            </div>
            <div className='grid grid-cols-1 gap-3 '>
                {[
                    { label: "Forex", val: 6, max: 10 },
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
    )
}
