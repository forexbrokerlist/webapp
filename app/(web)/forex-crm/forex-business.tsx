import React from 'react'
import { Button } from '~/components/common/button';
const TextImage = '/assets/images/text-img.png';
export default function ForexBusiness() {
    return (
        <div className='pb-100'>
            <div className="max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4">
                <div>
                    <div className='grid items-center grid-cols-[1fr_730px] gap-10'>
                        <div>
                            <div className=' pb-3'>
                                <button className='bg-white border-none rounded-full py-2 px-4 text-base font-medium text-black700'>
                                    About Forex CRM
                                </button>
                            </div>
                            <h2 className='text-[42px] max-mobile:text-3xl leading-normal text-black100 max-w-[596px] font-bold'>
                                Building Your Forex Business from the Ground Up
                            </h2>
                            <p className='text-lg max-mobile:text-base mb-4 text-black700 font-medium max-w-[694px] whitespace-pre-line'>
                                Forex CRM is a global forex technology provider, offering everything you need to establish and grow a successful forex brokerage. From company formation to licensing, and beyond, we are your trusted partner in creating world-class forex brokerage solutions. With extensive experience in forex technology, Forex CRM provides seamless access to retail forex trading markets and
                                cutting-edge tools.
                            </p>
                            <p className='text-lg max-mobile:text-base mb-4 text-black700 font-medium max-w-[694px] whitespace-pre-line'>
                                At Forex CRM, we deliver comprehensive forex technology solutions including company formation, broker licensing, web development, trader’s room setup, MT4/ MT5 White Label, and CRM
                                integration to help your brokerage thrive in the competitive market.
                            </p>
                            <Button size="md" variant="primary" className="px-5 gap-2.5 group relative z-[9]">
                                Contact Us
                                <div className="w-7 h-7 rounded-full flex items-center group-hover:bg-white transition-all duration-300 justify-center bg-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M12.0254 4.94141L17.0837 9.99974L12.0254 15.0581" stroke="#1A1A1A" strokeWidth="1.25" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M2.91699 10H16.942" stroke="#1A1A1A" strokeWidth="1.25" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </Button>
                        </div>
                        <div>
                            <img src={TextImage} className='block w-full' alt="TextImage" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
