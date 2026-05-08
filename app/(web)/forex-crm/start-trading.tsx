import React from 'react'
import { Button } from '~/components/common/button'
import Link from 'next/link'

export default function StartTrading() {
    return (
        <div className='pb-100 max-mobile:pb-16'>
            <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-0'>
                <div className="bg-[url('/assets/images/black-primary.png')] bg-no-repeat p-[80px] max-mobile:py-16 max-mobile:px-4 bg-cover max-mobile:rounded-none  rounded-3xl">
                    <div className='max-w-[678px] mx-auto'>
                        <h2 className='text-[42px] max-mobile:text-3xl leading-normal text-white font-bold max-w-[472px] mx-auto text-center'>
                            Start Trading Smarter With Forex CRM
                        </h2>
                        <p className='text-lg max-mobile:text-base max-mobile:mt-3 text-white opacity-70  font-medium max-w-[590px] whitespace-pre-line mx-auto text-center'>
                            Ready to elevate your forex trading or brokerage operations? whether you’re looking to automate your trades, secure a broker license, or streamline client management, Forex CRM has the tools and expertise to help
                            you succeed. don’t wait unlock your trading potential today.
                        </p>
                        <div className='flex items-center gap-3 justify-center pt-6'>
                            <Link href="#crm-enquiry-section">
                                <Button size="md" variant="primary" className="px-5 gap-2.5 text-black100 bg-white group relative z-[9]">
                                    Request For Demo
                                    <div className="w-7 h-7 rounded-full flex items-center group-hover:bg-white transition-all duration-300 justify-center bg-primary">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M12.0254 4.94141L17.0837 9.99974L12.0254 15.0581" stroke="#1A1A1A" strokeWidth="1.25" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M2.91699 10H16.942" stroke="#1A1A1A" strokeWidth="1.25" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
