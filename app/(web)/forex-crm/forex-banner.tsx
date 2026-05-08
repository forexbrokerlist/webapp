'use client'
import React from 'react'
import { Button } from '~/components/common/button';
const CrmImage = '/assets/images/crm.png';
export default function ForexBanner() {
    return (
        <section className="relative  pt-[180px] pb-100">
            <div className="max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4">
                <div className='grid grid-cols-[1fr_678px] gap-10'>
                    <div>
                        <button className='bg-white border-none rounded-full py-2 px-4 text-base font-medium text-black700'>
                            Forex CRM
                        </button>
                        <h1 className='text-black100 text-[70px] mt-3 mb-4 leading-[70px] font-bold'>
                            The Ultimate
                            <span className='block text-primary'>
                                Forex CRM
                            </span>
                        </h1>
                        <p className='text-lg font-medium text-black700 max-w-[637px] mb-6'>
                            Discover our scalable, fully customizable forex CRM. Save time and money while focusing on client
                            retention and attracting new clients.
                        </p>
                        <div className='flex items-center gap-3'>
                            <Button size="md" variant="primary" className="px-5 gap-2.5 group relative z-[9]">
                                Request For Demo
                                <div className="w-7 h-7 rounded-full flex items-center group-hover:bg-white transition-all duration-300 justify-center bg-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M12.0254 4.94141L17.0837 9.99974L12.0254 15.0581" stroke="#1A1A1A" strokeWidth="1.25" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M2.91699 10H16.942" stroke="#1A1A1A" strokeWidth="1.25" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </Button>
                            <Button size="md" variant="primary" className="px-5 bg-white text-black100 gap-2.5 group relative z-[9]">
                                Contact Us
                                <div className="w-7 h-7 rounded-full flex items-center group-hover:bg-white transition-all duration-300 justify-center bg-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M12.0254 4.94141L17.0837 9.99974L12.0254 15.0581" stroke="#1A1A1A" strokeWidth="1.25" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M2.91699 10H16.942" stroke="#1A1A1A" strokeWidth="1.25" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </Button>
                        </div>
                        <div className='flex pt-8'>
                            <div className='px-4 pl-0 border-r border-border-light300'>
                                <p className='text-3xl text-center font-semibold text-black100'>
                                    250+
                                </p>
                                <span className='text-base font-medium text-black700 text-center block'>satisfied clients worldwide</span>
                            </div>
                            <div className='px-4 border-r border-border-light300'>
                                <p className='text-3xl text-center font-semibold text-black100'>
                                    370+
                                </p>
                                <span className='text-base font-medium text-black700 text-center block'>current integrations</span>
                            </div>
                            <div className='px-4 border-r border-border-light300'>
                                <p className='text-3xl text-center font-semibold text-black100'>
                                    340+
                                </p>
                                <span className='text-base font-medium text-black700 text-center block'>payment providers</span>
                            </div>
                            <div className='px-4 pr-0'>
                                <p className='text-3xl text-center font-semibold text-black100'>
                                    15+
                                </p>
                                <span className='text-base font-medium text-black700 text-center block'>years of CRM expertise</span>
                            </div>
                        </div>
                    </div>
                    <div className='relative'>
                        <img className='block w-full' src={CrmImage} alt="CrmImage" />
                    </div>
                </div>
            </div>
        </section>
    )
}
