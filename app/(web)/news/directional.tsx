import React from 'react'

export default function Directional() {
    return (
        <div className='grid grid-cols-1 gap-4'>
            <div className='p-3 border border-border-light300 rounded-xl bg-[#F4F4F4]'>
                <p className='text-sm font-medium text-black700 mb-2.5'>
                    Forex Directional Bias
                </p>
                <div className='flex items-center gap-2.5'>
                    <p className='text-xl font-medium text-black100'>
                        USD/CAD bearish
                    </p>
                    <button className='py-1 px-2 border-none text-sm font-medium flex items-center rounded-md bg-[#FFE3E3] text-[#DB1111]'>
                        0.50%
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M10.5426 8.41797L7.00177 11.9588L3.46094 8.41797" stroke="#DB1111" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M7 2.04102V11.8585" stroke="#DB1111" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className='grid grid-cols-2  gap-3 '>
                {[
                    { label: "Forex", val: 6, max: 10 },
                    { label: "Crypto", val: 4, max: 10 },
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
            <div className='border border-border-light300 bg-[#F4F4F4] rounded-md p-3'>
                <p className='text-base font-medium text-black700'>
                    <span className='text-black100'> Short Term : </span> CAD benefits from higher oil prices resulting from Strait of Hormuz closure.
                </p>
            </div>
            <div className=''>
                <div className='p-3 border border-border-light300 rounded-xl bg-[#F4F4F4]'>
                    <p className='text-sm font-medium text-black700 mb-2.5'>
                        Global Equities Directional Bias
                    </p>
                    <div className='flex items-center gap-2.5'>
                        <p className='text-xl font-medium text-black100'>
                            SPX bearish
                        </p>
                        <button className='py-1 px-2 border-none text-sm font-medium flex items-center rounded-md bg-[#FFE3E3] text-[#DB1111]'>
                            0.50%
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M10.5426 8.41797L7.00177 11.9588L3.46094 8.41797" stroke="#DB1111" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M7 2.04102V11.8585" stroke="#DB1111" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-2  gap-3 '>
                {[
                    { label: "Forex", val: 6, max: 10 },
                    { label: "Crypto", val: 4, max: 10 },
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
            <div className='border border-border-light300 bg-[#F4F4F4] rounded-md p-3'>
                <p className='text-base font-medium text-black700'>
                    <span className='text-black100'> Short Term : </span> CAD benefits from higher oil prices resulting from Strait of Hormuz closure.
                </p>
            </div>

        </div>
    )
}
