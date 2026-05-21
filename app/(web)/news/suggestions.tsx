import React from 'react'

export default function Suggestions({ analyzedResult }: any) {
    const suggestions = analyzedResult?.data?.suggestions

    if (!suggestions) return null

    const hasNoSetup =
        (!suggestions.buy || suggestions.buy.length === 0) &&
        (!suggestions.sell || suggestions.sell.length === 0) &&
        (!suggestions.avoid || suggestions.avoid.length === 0) &&
        (!suggestions.watch || suggestions.watch.length === 0)

    if (hasNoSetup) {
        return (
            <div className='border border-border-light300 bg-[#F4F4F4] rounded-md p-4'>
                <div className='flex items-center gap-2 mb-2'>
                    <span className='text-xl'>⚖️</span>
                    <h3 className='text-lg font-bold text-black100'>No Clean Setup</h3>
                </div>
                <p className='text-base font-medium text-black700'>
                    {suggestions.summary}
                </p>
            </div>
        )
    }

    const sections = ['buy', 'sell', 'watch', 'avoid'] as const
    const sectionLabels: Record<string, string> = {
        buy: 'Buy',
        sell: 'Sell',
        watch: 'Watchlist',
        avoid: 'Avoid',
    }

    return (
        <div className='grid grid-cols-1 gap-4'>
            {suggestions.summary && (
                <div className='border border-border-light300 bg-[#F4F4F4] rounded-md p-3'>
                    <p className='text-base font-medium text-black700'>
                        {suggestions.summary}
                    </p>
                </div>
            )}

            {sections.map((type) => {
                const items: any[] = suggestions[type]
                if (!items || items.length === 0) return null

                return (
                    <div key={type}>
                        <h2 className='text-lg font-semibold text-black100 mb-3'>
                            {sectionLabels[type]}
                        </h2>
                        {items.map((item: any, i: number) => (
                            <div key={i}>
                                <div className='border border-border-light300 bg-[#F4F4F4] rounded-md p-3'>
                                    <div className='flex flex-wrap items-center gap-3 pb-3'>
                                        <p className='text-lg font-medium text-black100'>
                                            {item.asset}
                                        </p>
                                        {item.expected_move_pct && (
                                            <button className='py-1 px-3 text-sm font-medium text-[#2AA411] flex items-center gap-2 rounded-[6px] bg-[rgba(42,164,17,0.10)]'>
                                                Target: {item.expected_move_pct}
                                            </button>
                                        )}
                                        {item.confidence && (
                                            <button className='py-1 px-3 text-sm font-medium text-black100 flex items-center gap-2 rounded-[6px] bg-white'>
                                                CONF: {item.confidence}
                                            </button>
                                        )}
                                    </div>
                                    <div className='flex flex-col gap-3'>
                                        {item.reasoning && (
                                            <p className='text-base font-medium text-black700'>
                                                <span className='text-black100'> Reasoning : </span>{item.reasoning}
                                            </p>
                                        )}
                                       
                                        {item.market_logic && (
                                            <p className='text-base font-medium text-black700'>
                                                <span className='text-black100'> Market Logic : </span>{item.market_logic}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {item.invalidation && (
                                    <p className='text-base font-medium mt-3 text-black700'>
                                        <span className='text-black100'> Invalidation : </span>{item.invalidation}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )
            })}
        </div>
    )
}