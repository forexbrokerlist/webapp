import React from 'react'
import TableOfContents from '~/components/common/table-of-contents'
import TradingDetails from '../broker-details/trading-details';
import TradingSpecifications from '../broker-details/trading-specifications';
import BrokerReview from '../broker-details/broker-review';
import UserReview from '../broker-details/user-review';
import FaqSection from '../broker-details/faq-section';
import SuggestedBroker from '../broker-details/suggested-broker';
import { Button } from '~/components/common/button';
import Link from 'next/link';
import { MoveRight } from 'lucide-react';
import CompareBrokers from '../forex-crm-details/compare-crm';

const ForexImage = '/assets/images/FBL Logo.png';

export default function ForexTradingPlatformsView({ broker, randomBrokers = [], trustedBrokers = [] }: { broker: any, randomBrokers?: any[], trustedBrokers?: any[] }) {
    const leftSideDetails = [
        { label: "Headquarters", value: broker.headquarters || "-" },
        { label: "Established", value: broker.year_established||"-"},
        { label: "Company", value: broker.company_name || "-" },
        { label: "Platform Type", value:broker.platform_type&&broker.platform_type.length>0&&broker.platform_type.join("/") || "-"  },
        { label: "Best For", value: broker.bestFor && broker.bestFor.length > 0 ? broker.bestFor.map((val: any) => val === "RetailBrokers" ? "Brokers" : val).join(" / ") : "-" },
                { value: broker.clients_count || '-', label: `Clients ${new Date().getFullYear()}` },
      
    ];

    const rightSideDetails = [
        { label: "Trading Platform", value: broker.trading_platforms|| "-" },
        { label: "Charting Tools", value: broker.charting_tools&&broker.charting_tools.length>0&&broker.charting_tools.join("/") || "-"   },
        { label: "Deployment", value: broker.deployment_type&&broker.deployment_type.length>0&&broker.deployment_type.join(",") || "-"  },
        { label: "Prop Firm Tools", value: broker.prop_firm_support&&broker.prop_firm_support.length>0&&broker.prop_firm_support.join(",")  ||'-' },
        { label: "MT5 Backend", value: broker.mt5_backend ? "Yes" : "No",isPositive:broker.mt5_backend },
        {label:"CRM Integrations",value: broker.crm_integrations|| "-" },
        {label:"Liquidity Connect",value: broker.liquidity_connect|| "-" },
        {label:"KYC & Compliance",value: broker.kyc_compliance|| "-" }
    ];

    return (
        <div>
            <div className='max-w-[1640px] px-5 max-laptop:px-16 mx-auto relative max-tab:px-5 max-mobile:px-4 '>
                <div className='grid grid-cols-[216px_1fr_380px] gap-5'>
                    <div>
                        <TableOfContents
                            broker={broker}
                            items={[
                                "Platform Details",
                                "Trading Specifications",
                                "Platform Review",
                                "User Review",
                                "Compare Trading Platforms",
                                "FAQ"
                            ]}
                        />
                    </div>
                    <div className='grid grid-cols-1 gap-5'>
                        <TradingDetails 
                            broker={broker} 
                            leftHeader="Provider Details"
                            rightHeader="Platform & Technical Specs"
                            leftSideDetails={leftSideDetails}
                            rightSideDetails={rightSideDetails}
                            tradingDetailsLabel="PLATFORM DETAILS"
                            tradingDetailsId="platform-details"
                        />
                        
                        <TradingSpecifications 
                            bridgeTitle="Best Suited For"
                            broker={broker} 
                            showTradingHours={false} 
                            showAccountFunding={true}
                            accountFundingHeading='Pricing & Deployment' 
                            accountFundingDetails={[
                                { label: "White Label Price", value: broker.white_label_price || "-" },
                                { label: "Server License", value: broker.server_license || "-" },

                                { label: "Hosting Included", value: broker.hosting_included?"Yes" : "No" ,isPositive:broker.hosting_included },
                                { label: "Setup Time", value: broker.setup_time || "-" },
                                { label: "Yearly Commitment", value: broker.yearly_commitment ? "Required" : "Not Required", isPositive: broker.yearly_commitment },
                                { label: "Demo Available", value: broker.demo_account ? "Yes" : "No", isPositive: broker.demo_account },
                            ]}
                            tradingSpreadsHeading='Technical Specifications'
                            tradingSpreadsDetails={[
                                { label: "MT5 Backend", value: broker.mt5_backend ? "Yes" : "No", isPositive: broker.mt5_backend },
                                { label: "Charting Tools", value: broker.charting_tools?.join(" / ") || "-" },
                                { label: "Yearly Commitment", value: broker.yearly_commitment ? "Yes" : "No", isPositive: !broker.yearly_commitment },
                            ]}
                            showTradingSpreads={false} 
                            showStarRatings={false} 
                            showFeatures={true} 
                            showBestSuitedFor={true}
                            platformSectionId="trading-specifications" 
                        />

                        <BrokerReview
                            broker={broker}
                            reviewTitle={`${broker?.broker_name || '-'} Review ${new Date().getFullYear()} — Trading Platform for Forex Brokers`}
                            sectionId="platform-review"
                        />
                        <UserReview />
                        <CompareBrokers broker={broker} trustedBrokers={trustedBrokers} sectionId="compare-trading-platforms" />
                        <FaqSection broker={broker} />
                    </div>
                    <div>
                        <div className='p-5 sticky top-[100px] z-[99] mb-5 rounded-xl border-[0.5px] border-[#A8DD15] bg-[#FFFFFE] shadow-[0_2px_20px_0_rgba(0,0,0,0.05)]'>
                            <div className='flex items-center gap-3 pb-2'>
                                <div className='w-14 flex items-center justify-center h-14 rounded-md  bg-[rgba(255,255,255,0.14)] shadow-[inset_0_0_15px_0_rgba(168,221,21,0.20)]'>
                                    <img src={"/assets/images/ForexLogo.png"} className='max-w-12 h-auto block object-contain' />
                                </div>
                                <p className='text-lg font-semibold text-black100'>
                                    Your brand here
                                </p>
                                <button className='px-3 py-1 text-sm rounded-full font-semibold text-black100 bg-primary'>
                                    Add New
                                </button>
                            </div>
                            <p className='text-sm text-black100 font-medium'>
                                Reach our audience of professional directory owners and
                                boost your sales.
                            </p>
                            <div className='py-4'>
                                <img className='block w-full' src={ForexImage} alt="ForexImage" />
                            </div>
                            <Button variant='primary' className='justify-center flex items-center text-sm w-full bg-black100'>
                                <Link href="/advertise">
                                    Advertise on Forex Brokers Listing
                                    <div className='flex items-center'>
                                        <MoveRight className=' w-4 h-4' />
                                    </div>
                                </Link>
                            </Button>
                        </div>
                        <SuggestedBroker brokers={randomBrokers} suggestionTitle='Suggested Platforms' />
                    </div>
                </div>
            </div>
        </div>
    )
}
