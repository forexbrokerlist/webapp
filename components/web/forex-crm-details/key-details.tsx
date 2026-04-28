import React from 'react'
import CourseModulesSection from './course-modules-section';
const RoundIcon = '/assets/images/round.svg';


export default function TradingDetails({ broker, sectionTitle = "CRM DETAILS", brokerDetails, additionalDetails, learnSection = false }: { broker: any, sectionTitle?: String, brokerDetails?: any[], additionalDetails?: any[], learnSection?: boolean }) {
    const brokerDetailsList = brokerDetails || [
        { label: "Deployment Type", value: broker.deployment_type || "-" },
        { label: "Pricing Model", value: broker.pricingModel ? String(broker.pricingModel).replace(/MonthlySaas/g, 'Monthly SaaS') : "-" },
        { label: "Starting Price", value: broker.starting_price || "-" },
        { label: "Free Demo", value: broker.demoAccount ? "Yes" : "No", isPositive: broker.demoAccount },
        { label: "Free Trial", value: broker.trialAccount ? "Yes" : "No", isPositive: broker.trialAccount },
    ];

    const additionalDetailsList = additionalDetails || [
        { label: "Business Size", value: broker.bestFor && broker.bestFor.length > 0 ? String(broker.bestFor).replace(/MidSize/g, 'Mid-size').replace(/,/g, ', ') : "-" },
        { label: "Support Channels", value: broker.support_channels && broker.support_channels.length > 0 ? String(broker.support_channels).replace(/,/g, ', ') : "-" },
        { label: "Support Hours", value: broker.support_hours || "-" },
        { label: "Languages", value: broker.languages_supported && broker.languages_supported.length > 0 ? String(broker.languages_supported).replace(/,/g, ', ') : "-" },
        { label: "API Access", value: broker.api_access ? "Yes" : "No", isNew: true, isPositive: broker.api_access },
    ];

    // Create separate arrays for learn section
    const learnSectionLeft = learnSection && broker.outcomes ?
        broker.outcomes.slice(0, Math.ceil(broker.outcomes.length / 2)).map((value: string) => ({ label: value, value })) : [];

    const learnSectionRight = learnSection && broker.outcomes ?
        broker.outcomes.slice(Math.ceil(broker.outcomes.length / 2)).map((value: string) => ({ label: value, value })) : [];

    return (
        <div id='crm-details' className='rounded-xl scroll-mt-20 border border-border-light180 border-solid bg-white overflow-hidden'>
            <div className='p-4 relative flex items-center '>
                <div className='absolute top-3 left-0 w-1 h-[26px] bg-primary rounded-r-[4px]'></div>
                <h3 className='text-base text-black100 font-semibold uppercase'>
                    {sectionTitle}
                </h3>
            </div>
            <div className='px-4 pb-4'>
                <div className='border border-border-light300 border-solid bg-[#f0f1ec4d] rounded-xl p-4'>
                    <div className='flex items-center gap-2 pb-3'>
                        <img src={RoundIcon} alt="RoundIcon" className='block' />
                        <span className='block text-base font-medium text-black'>
                            Key Details
                        </span>
                    </div>
                    <div className='w-full h-[1px] bg-[linear-gradient(170deg,rgba(168,221,21,0.80)_0%,rgba(251,251,250,0.80)_60%)]'></div>

                    <div className='pt-2 grid grid-cols-[1fr_1px_1fr] gap-6'>
                        <div>
                            {brokerDetailsList.map((detail, index) => (
                                <div key={index} className='flex justify-between items-center py-2.5 last:pb-0 border-b border-border-light300 last:border-0 border-solid'>
                                    <span className='text-[15px] font-medium text-black700'>{detail.label}</span>
                                    {detail.isPositive !== undefined ? (
                                        detail.isPositive ? (
                                            <span className='text-[13px] font-semibold px-3 py-1 rounded-full bg-[#E5F0DF] text-[#296D2C] leading-tight'>{detail.value}</span>
                                        ) : (
                                            <span className='text-[13px] font-semibold px-3 py-1 rounded-full bg-[#FEE2E2] text-[#991B1B] leading-tight'>{detail.value}</span>
                                        )
                                    ) : (
                                        <span className='text-[15px] font-medium text-black100 text-right'>{detail.value}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className='bg-border-light300 my-2'></div>
                        <div>
                            {additionalDetailsList.map((detail, index) => (
                                <div key={index} className='flex justify-between items-center py-2.5 last:pb-0 border-b border-border-light300 last:border-0 border-solid'>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-[15px] font-medium text-black700'>{detail.label}</span>
                                        {/* {detail.isNew && (
                                            <span className='text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#FCF2E1] text-[#D88A2E] leading-tight'>New</span>
                                        )} */}
                                    </div>
                                    {detail.isPositive !== undefined ? (
                                        detail.isPositive ? (
                                            <span className='text-[13px] font-semibold px-3 py-1 rounded-full bg-[#E5F0DF] text-[#296D2C] leading-tight'>{detail.value}</span>
                                        ) : (
                                            <span className='text-[13px] font-semibold px-3 py-1 rounded-full bg-[#FEE2E2] text-[#991B1B] leading-tight'>{detail.value}</span>
                                        )
                                    ) : (
                                        <span className='text-[15px] font-medium text-black100 text-right'>{detail.value}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {learnSection && <div className='border   border-border-light300 border-solid bg-[#f0f1ec4d] rounded-xl p-4 mt-6'>
                    <div className='flex items-center gap-2 pb-3'>
                        <img src={RoundIcon} alt="RoundIcon" className='block' />
                        <span className='block text-base font-medium text-black'>
                            What You'll Learn
                        </span>
                    </div>
                    <div className='w-full h-[1px] bg-[linear-gradient(170deg,rgba(168,221,21,0.80)_0%,rgba(251,251,250,0.80)_60%)]'></div>

                    <div className='pt-2 grid grid-cols-[1fr_1px_1fr] gap-6'>
                        <div>
                            {learnSectionLeft.map((detail:any, index:any) => (
                                <div key={index} className='flex items-start gap-3 py-2.5 last:pb-0 border-b border-border-light300 last:border-0 border-solid'>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className='block mt-0.5 flex-shrink-0'>
                                        <circle cx="10" cy="10" r="10" fill="#E5F0DF" />
                                        <path d="M6 10L9 13L14 7" stroke="#296D2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className='text-[15px] font-medium text-black700 flex-1'>{detail.value}</span>
                                </div>
                            ))}
                        </div>
                        <div className='bg-border-light300 my-2'></div>
                        <div>
                            {learnSectionRight.map((detail:any, index:any) => (
                                <div key={index} className='flex items-start gap-3 py-2.5 last:pb-0 border-b border-border-light300 last:border-0 border-solid'>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className='block mt-0.5 flex-shrink-0'>
                                        <circle cx="10" cy="10" r="10" fill="#E5F0DF" />
                                        <path d="M6 10L9 13L14 7" stroke="#296D2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className='text-[15px] font-medium text-black700 flex-1'>{detail.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>}


                {broker.courseModules && broker.courseModules.length > 0 && (
                    <CourseModulesSection courseModules={broker.courseModules} />
                )}

            </div>
        </div>
    )
}

