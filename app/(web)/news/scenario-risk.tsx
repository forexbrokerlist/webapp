import React from 'react'

export default function ScenarioRisk() {
    return (
        <div className='grid grid-cols-1 gap-4'>
            <div>
                <h2 className='text-lg font-semibold text-black100 mb-3'>
                    Scenario & Risk
                </h2>
                <div className='grid grid-cols-1 gap-3'>
                    <div className='border border-border-light300 bg-[#F4F4F4] rounded-md p-3'>
                        <p className='text-base font-medium text-black700'>
                            <span className='text-black100'> If Strengthens : </span> Further oil price spikes, flight to safety (USD/CHF/JPY), equity sell-off.
                        </p>
                    </div>
                    <div className='border border-border-light300 bg-[#F4F4F4] rounded-md p-3'>
                        <p className='text-base font-medium text-black700'>
                            <span className='text-black100'> If Fades : </span> Mean reversion in energy and risk assets.
                        </p>
                    </div>
                    <div className='border border-border-light300 bg-[#F4F4F4] rounded-md p-3'>
                        <p className='text-base font-medium text-black700'>
                            <span className='text-black100'> If Fades : </span> Mean reversion in energy and risk assets.
                        </p>
                    </div>
                </div>
            </div>
            <div>
                <h2 className='text-lg font-semibold text-black100 mb-3'>
                    Macro Linkage
                </h2>
                <div className='border border-border-light300 bg-[#F4F4F4] rounded-md p-3'>
                    <p className='text-base font-medium text-black700'>
                        Closure of the Strait of Hormuz represents a significant supply-side shock to global energy markets. This increases inflation expectations and creates systemic risk, driving capital into safe-haven assets and away from risk-sensitive equities.
                    </p>
                </div>
            </div>
        </div>
    )
}
