import React from 'react'

export default function ScenarioRisk({analyzedResult}:any) {
    return (
        <div className='grid grid-cols-1 gap-4'>
            <div>
                <h2 className='text-lg font-semibold text-black100 mb-3'>
                    Scenario & Risk
                </h2>
                <div className='grid grid-cols-1 gap-3'>
                    <div className='border border-border-light300 bg-[#F4F4F4] rounded-md p-3'>
                      {analyzedResult?.data?.scenario_analysis?.if_event_strengthens &&  <p className='text-base font-medium text-black700'>
                            <span className='text-black100'> If Strengthens : </span> {analyzedResult?.data?.scenario_analysis?.if_event_strengthens}
                        </p>}
                    </div>
                    {analyzedResult?.data?.scenario_analysis?.if_event_fades && (
                        <div className='border border-border-light300 bg-[#F4F4F4] rounded-md p-3'>
                            <p className='text-base font-medium text-black700'>
                                <span className='text-black100'> If Fades : </span> {analyzedResult.data.scenario_analysis.if_event_fades}
                            </p>
                        </div>
                    )}
                    {analyzedResult?.data?.scenario_analysis?.invalidation_trigger && (
                        <div className='border border-border-light300 bg-[#F4F4F4] rounded-md p-3'>
                            <p className='text-base font-medium text-black700'>
                                <span className='text-black100'> Invalidation : </span> {analyzedResult.data.scenario_analysis.invalidation_trigger}
                            </p>
                        </div>
                    )}
                </div>
            </div>
           {analyzedResult?.data?.macro_linkage_reasoning?.causal_chain_explanation && <div>
                <h2 className='text-lg font-semibold text-black100 mb-3'>
                    Macro Linkage
                </h2>
                <div className='border border-border-light300 bg-[#F4F4F4] rounded-md p-3'>
                   {analyzedResult?.data?.macro_linkage_reasoning?.causal_chain_explanation && 
                    <p className='text-base font-medium text-black700'>
                        {analyzedResult?.data?.macro_linkage_reasoning?.causal_chain_explanation}
                    </p>}
                </div>
            </div>}
        </div>
    )
}
