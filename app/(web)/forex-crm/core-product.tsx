import React from 'react'
const CrmPrimary = '/assets/images/crm-fill.svg';
const CrmOutline = '/assets/images/crm-outline.svg';
export default function CoreProduct() {
    return (
        <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4'>
            <div className="bg-[url('/assets/images/light-banner.png')] bg-no-repeat p-[80px] bg-cover border border-solid border-primary rounded-3xl">
                <div className='pb-[60px]'>
                    <div className='flex justify-center pb-3'>
                        <button className='bg-white border-none rounded-full py-2 px-4 text-base font-medium text-black700'>
                            Core Products
                        </button>
                    </div>
                    <h2 className='text-[42px] max-mobile:text-3xl leading-normal text-black100 font-bold text-center'>
                        Products Tailored For Forex Success
                    </h2>
                    <p className='text-lg max-mobile:text-base text-black700 font-medium max-w-[590px] whitespace-pre-line mx-auto text-center'>
                        Explore our comprehensive suite of forex products designed to elevate your trading experience.
                    </p>
                </div>
                <div className='grid grid-cols-4 gap-5'>
                    <div className='rounded-xl p-5 border border-[rgba(26,26,26,0.10)] bg-[#F4F4F4] shadow-[0_0_20.8px_0_rgba(0,0,0,0.04)]'>
                        <img src={CrmPrimary} alt="CrmPrimary" className='block' />
                        <h3 className='mt-7 mb-3 text-xl font-semibold text-black100'>
                            Forex Broker CRM
                        </h3>
                        <p className='text-lg font-normal text-black100'>
                            Complete CRM solution tailored for forex brokers to manage
                            clients efficiently.
                        </p>
                    </div>
                    <div className='rounded-xl p-5 border border-[rgba(255,255,255,0.10)] bg-primary shadow-[0_0_20.8px_0_rgba(0,0,0,0.04)]'>
                        <img src={CrmOutline} alt="CrmOutline" className='block' />
                        <h3 className='mt-7 mb-3 text-xl font-semibold text-black100'>
                            Forex Prop Firm CRM
                        </h3>
                        <p className='text-lg font-normal text-black100'>
                            Powerful CRM designed for proprietary trading firms and funded trader programs.
                        </p>
                    </div>
                    <div className='rounded-xl p-5 border border-[rgba(26,26,26,0.10)] bg-[#F4F4F4] shadow-[0_0_20.8px_0_rgba(0,0,0,0.04)]'>
                        <img src={CrmPrimary} alt="CrmPrimary" className='block' />
                        <h3 className='mt-7 mb-3 text-xl font-semibold text-black100'>
                            Copy trading
                        </h3>
                        <p className='text-lg font-normal text-black100'>
                            Enable Clients to copy expert traders strategies and grow their portfolios.
                        </p>
                    </div>
                    <div className='rounded-xl p-5 border border-[rgba(255,255,255,0.10)] bg-primary shadow-[0_0_20.8px_0_rgba(0,0,0,0.04)]'>
                        <img src={CrmOutline} alt="CrmOutline" className='block' />
                        <h3 className='mt-7 mb-3 text-xl font-semibold text-black100'>
                            MAM/PAMM Social Trading
                        </h3>
                        <p className='text-lg font-normal text-black100'>
                            Multi account management and social trading solutions for fund managers.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
