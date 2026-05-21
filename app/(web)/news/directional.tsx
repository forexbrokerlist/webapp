import React, { useEffect, useState } from 'react'
import { formatCategory } from './news-card-list';
const getBiasBadge = (direction: string = '') => {
    const dir = direction.toLowerCase();
    if (dir === 'bullish') {
        return {
            bg: 'bg-[#E3F6EB]',
            text: 'text-[#2AA411]',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3.4574 5.58203L7.00003 2.0412L10.5409 5.58203" stroke="currentColor" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 11.959V2.1415" stroke="currentColor" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )
        };
    } else if (dir === 'bearish') {
        return {
            bg: 'bg-[#FFE3E3]',
            text: 'text-[#DB1111]',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M10.5426 8.41797L7.00177 11.9588L3.46094 8.41797" stroke="currentColor" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 2.04102V11.8585" stroke="currentColor" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )
        };
    }
    return {
        bg: 'bg-[rgba(26,26,26,0.10)]',
        text: 'text-black100',
        icon: null
    };
};

export default function Directional({ analyzedResult }: { analyzedResult: any }) {
    const [directionalBias, setDirectionalBias] = useState<any>({})

    useEffect(() => {
        setDirectionalBias(analyzedResult?.data?.directional_bias)
    }, [analyzedResult])

    const hasForex = directionalBias?.forex?.length > 0
    const hasEquities = directionalBias?.global_equities?.length > 0
    const hasCrypto = directionalBias?.crypto?.length > 0
    const isEmpty = !hasForex && !hasEquities && !hasCrypto

    if (isEmpty) {
        return (
            <div className='flex items-center justify-center py-10'>
                <p className='text-sm text-black700'>No directional bias data available.</p>
            </div>
        )
    }

    return (
        <div className='grid grid-cols-1 gap-4'>
            {hasForex && (
                <>
                    <div className='p-3 border border-border-light300 rounded-xl bg-[#F4F4F4]'>
                        <p className='text-sm font-medium text-black700 mb-2.5'>
                            Forex Directional Bias
                        </p>
                        <div className='flex flex-wrap items-center gap-2.5'>
                            <p className='text-xl font-medium text-black100 capitalize'>
                                {directionalBias?.forex?.[0].pair} {directionalBias?.forex?.[0].direction}
                            </p>
                            {(() => {
                                const badge = getBiasBadge(directionalBias?.forex?.[0].direction);
                                return (
                                    <button className={`py-1 px-2 border-none text-sm font-medium flex items-center gap-1 rounded-md ${badge.bg} ${badge.text}`}>
                                        {directionalBias?.forex?.[0].expected_move_pct || '0.50%'}
                                        {badge.icon}
                                    </button>
                                );
                            })()}
                        </div>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                        {[
                            { label: "Strength", val: directionalBias?.forex[0]?.impact_strength, max: 10 },
                            { label: "Confidence", val: directionalBias?.forex[0]?.confidence, max: 100 },
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
                            <span className='text-black100'> {formatCategory(directionalBias?.forex[0]?.expected_duration)} </span> {directionalBias?.forex[0]?.reason}
                        </p>
                    </div>
                </>
            )}

            {hasEquities && (
                <>
                    <div className='p-3 border border-border-light300 rounded-xl bg-[#F4F4F4]'>
                        <p className='text-sm font-medium text-black700 mb-2.5'>
                            Global Equities Directional Bias
                        </p>
                        <div className='flex flex-wrap items-center gap-2.5'>
                            <p className='text-xl font-medium text-black100 capitalize'>
                                {directionalBias?.global_equities?.[0].pair || 'SPX'} {directionalBias?.global_equities?.[0].direction || 'bearish'}
                            </p>
                            {(() => {
                                const badge = getBiasBadge(directionalBias?.global_equities?.[0].direction || 'bearish');
                                return (
                                    <button className={`py-1 px-2 border-none text-sm font-medium flex items-center gap-1 rounded-md ${badge.bg} ${badge.text}`}>
                                        {directionalBias?.global_equities?.[0].percentage || '0.50%'}
                                        {badge.icon}
                                    </button>
                                );
                            })()}
                        </div>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                        {[
                            { label: "Equities", val: 7, max: 10 },
                            { label: "Bonds", val: 3, max: 10 },
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
                            <span className='text-black100'> Short Term : </span> Market reacts to structural shifts.
                        </p>
                    </div>
                </>
            )}

            {hasCrypto && (
                <>
                    <div className='p-3 border border-border-light300 rounded-xl bg-[#F4F4F4]'>
                        <p className='text-sm font-medium text-black700 mb-2.5'>
                            Crypto Directional Bias
                        </p>
                        <div className='flex flex-wrap items-center gap-2.5'>
                            <p className='text-xl font-medium text-black100 capitalize'>
                                {directionalBias?.crypto?.[0].asset || 'BTC'} {directionalBias?.crypto?.[0].direction || 'bullish'}
                            </p>
                            {(() => {
                                const badge = getBiasBadge(directionalBias?.crypto?.[0].direction || 'bullish');
                                return (
                                    <button className={`py-1 px-2 border-none text-sm font-medium flex items-center gap-1 rounded-md ${badge.bg} ${badge.text}`}>
                                        {directionalBias?.crypto?.[0].percentage || '0.50%'}
                                        {badge.icon}
                                    </button>
                                );
                            })()}
                        </div>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                        {[
                            { label: "Strength", val: directionalBias?.crypto[0]?.impact_strength, max: 10 },
                            { label: "Confidence", val: directionalBias?.crypto[0]?.confidence, max: 100 },
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
                            <span className='text-black100'>{formatCategory(directionalBias?.crypto[0]?.expected_duration)}:</span> {directionalBias?.crypto[0]?.reason}
                        </p>
                    </div>
                </>
            )}
        </div>
    )
}