import React from 'react'
import { formatCategory } from './news-card-list'

export default function Predictions({ predictionResult }: any) {
    const predictions = predictionResult?.data

    if (!predictions || predictions.length === 0) return null

    const fmt = (val: number | null | undefined) =>
        val != null ? Number(val).toFixed(2) : null

    return (
        <div className='grid grid-cols-1 gap-6'>
            {predictions.map((item: any, i: number) => (
                <div key={i} className='grid grid-cols-1 gap-3'>
                    {/* Header */}
                    <div>
                        <h2 className='text-lg font-semibold text-black100'>
                            {item.asset_display_name} <span className='text-sm font-normal text-black700'>{formatCategory(item.direction)}</span>
                        </h2>
                        <p className='text-sm text-black700'>
                            Duration: {item.expected_duration_label}
                        </p>
                    </div>

                    {/* 3 price cards */}
                    <div className='grid grid-cols-3 gap-3'>
                        <div className='p-3 rounded-md border border-border-light300 bg-[#F4F4F4] flex flex-col gap-1'>
                            <p className='text-sm font-medium text-black700 text-center mt-1'>Start Price</p>
                            <p className='text-xl font-semibold text-black100 text-center'>
                                {fmt(item.start_price) ? `$${fmt(item.start_price)}` : '—'}
                            </p>
                           
                            <p className='text-xs text-black700 text-center mt-0.5'>Entry</p>
                        </div>
                        <div className='p-3 rounded-md border border-border-light300 bg-[#F4F4F4] flex flex-col gap-1'>
                            <p className='text-sm font-medium text-black700 text-center mt-1'>Current Price</p>
                            <p className='text-xl font-semibold text-black100 text-center'>
                                {fmt(item.last_price) ? `$${fmt(item.last_price)}` : fmt(item.start_price) ? `$${fmt(item.start_price)}` : '—'}
                            </p>
                        
                            <p className='text-xs text-black700 text-center mt-0.5'>
                                {item.last_move_pct != null ? `${item.last_move_pct > 0 ? '+' : ''}${Number(item.last_move_pct).toFixed(2)}%` : '+0.01%'}
                            </p>
                        </div>
                        <div className='p-3 rounded-md border border-border-light300 bg-[#F4F4F4] flex flex-col gap-1'>
                            <p className='text-sm font-medium text-black700 text-center mt-1'>Target Price</p>
                            <p className='text-xl font-semibold text-black100 text-center'>
                                {fmt(item.target_price) ? `$${fmt(item.target_price)}` : '—'}
                            </p>
                            <p className='text-xs text-black700 text-center mt-0.5'>
                                {Number(item.predicted_move_pct).toFixed(2)}%
                            </p>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className='p-3 mb-2 rounded-lg border border-border-light300 bg-[#F4F4F4]'>
                        <div className='flex items-center justify-between mb-2'>
                            <span className='text-sm font-semibold text-black700'>Max Favorite Excursion</span>
                            <span className='text-sm font-semibold text-black100'>{Number(item.mfe_pct ?? 0).toFixed(2)}%</span>
                        </div>
                        <div className='h-2 bg-[#E2E2E2] rounded-full overflow-hidden'>
                            <div
                                className='h-full bg-primary rounded-full'
                                style={{ width: `${Math.min((item.mfe_pct / 100) * 100, 100)}%` }}
                            />
                        </div>
                        <div className='flex items-center justify-between mt-1'>
                            <span className='text-xs text-black700'>0%</span>
                            <span className='text-xs text-black700'>
                                Progress Strictly Towards Target ({Number(item.predicted_move_pct).toFixed(2)}%)
                            </span>
                            <span className='text-xs text-black700'>
                                100%
                            </span>
                        </div>
                    </div>

                    {/* Divider between multiple predictions */}
                    {i < predictions.length - 1 && (
                        <div className='w-full h-[1px] bg-[rgba(26,26,26,0.14)]' />
                    )}
                </div>
            ))}
        </div>
    )
}