import React from 'react'
import { formatCategory } from './news-card-list'

export default function Overview({ analyzedResult }: any) {
    const overviewData = [{
        label: "HAWKISH/DOVISH",
        value: `${analyzedResult?.data?.text_signal_analysis?.hawkish_dovish_score}/10`
    },
    {
        label: "RISK ON/OFF",
        value: `${analyzedResult?.data?.text_signal_analysis?.risk_on_off_score}/10`
    },
    {
        label: "UNCERTAINITY",
        value: `${analyzedResult?.data?.text_signal_analysis?.uncertainty_intensity_score}/10`
    },
    {
        label: "SURPRISE",
        value: `${analyzedResult?.data?.core_impact_assessment?.perceived_surprise_score}/10`
    },
    {
        label: "DURATION",
        value: formatCategory(analyzedResult?.data?.time_modeling?.impact_duration)
    },
    {
        label: "REACTION",
        value: formatCategory(analyzedResult?.data?.time_modeling?.reaction_speed)
    }, {
        label: "FATIGUE",
        value: `${analyzedResult?.data?.event_fatigue_analysis?.fatigue_score}/10`
    },
    {
        label: "EXPOSURE",
        value: analyzedResult?.data?.risk_guidance?.suggested_exposure_range_pct
            ? `${analyzedResult.data.risk_guidance.suggested_exposure_range_pct}`
            : "N/A"
    },
    {

        label: "PROBABILITY",
        value: `${analyzedResult?.data?.probability_and_confidence?.overall_confidence_score}%`
    }
    ]
    return (
        <div>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                {
                    overviewData.map((item) => {
                        return (
                            <div className='p-3 rounded-md border border-border-light300 bg-[#F4F4F4]'>
                                <p className='text-sm font-medium text-black700 text-center mb-1'>
                                    {item.label}
                                </p>
                                <h3 className='text-xl max-mobile:text-lg font-medium text-black100 text-center'>
                                    {item.value}
                                </h3>
                            </div>
                        )
                    })
                }
            </div>
            <div className='py-5'>
                <div className='border border-border-light300 bg-[#F4F4F4] rounded-md p-3'>
                    <p className='text-base font-medium text-black700'>
                        <span className='text-black100'> Executive Summary : </span> {analyzedResult?.data?.executive_summary}
                    </p>
                </div>
            </div>
            <div>
                <h3 className='text-lg font-semibold text-black100 mb-3'>
                    Category Impacts
                </h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pb-4'>
                    {[
                        { label: "Forex", val: analyzedResult?.data?.core_impact_assessment?.market_category_scores?.forex, max: 10 },
                        { label: "Crypto", val: analyzedResult?.data?.core_impact_assessment?.market_category_scores?.crypto, max: 10 },
                        { label: "Equities", val: analyzedResult?.data?.core_impact_assessment?.market_category_scores?.global_equities, max: 10 },
                        { label: "Text Clarity", val: analyzedResult?.data?.probability_and_confidence?.confidence_breakdown?.text_clarity, max: 10 },
                        { label: "Shock Magnitude", val: analyzedResult?.data?.core_impact_assessment?.perceived_surprise_score, max: 10 },
                        { label: "Cross Asset Logic", val: analyzedResult?.data?.probability_and_confidence?.confidence_breakdown?.cross_asset_logic_strength, max: 10 },
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
