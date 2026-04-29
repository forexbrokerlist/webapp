import React from 'react'
import TableOfContents from '~/components/common/table-of-contents'
import { Button } from '~/components/common/button';
import { MoveRight } from 'lucide-react';
import SuggestedBroker from '../broker-details/suggested-broker';
import TradingDetails from '../broker-details/trading-details';
// import TradingSpecifications from './trading-specifications';
// import PlatformFeatures from './platform-features';

import BrokerReview from '../broker-details/broker-review';
import UserReview from '../broker-details/user-review';

import FaqSection from '../broker-details/faq-section';
import Link from 'next/link';

import TradingSpecifications from '../broker-details/trading-specifications';

const ForexImage = '/assets/images/FBL Logo.png';


export default function ForexBridgeProviderDetailsView({ broker, randomBrokers = [], trustedBrokers = [] }: { broker: any, randomBrokers?: any[], trustedBrokers?: any[] }) {
    return (
        <div>
            <div className='max-w-[1640px] px-5 max-laptop:px-16 mx-auto relative max-tab:px-5 max-mobile:px-4 '>
                <div className='grid grid-cols-[216px_1fr_380px] gap-5'>
                    <div>
                        <TableOfContents
                            broker={broker}
                            items={[
                                "Tool Details",
                                "Trading Specifications",
                                "Best Suited For",
                                "Tool Review",
                                "User Review",
                                // "Compare CRM",
                                "FAQ"
                            ]}
                        />
                    </div>
                    <div className='grid grid-cols-1 gap-5'>
                        <TradingDetails broker={broker}  tradingDetailsLabel="Tool Details" tradingDetailsId="tool-details" leftHeader='Provider Details' rightHeader='Technical Specs'   leftSideDetails={ [
        { label: "Company Type", value: broker.bestFor && broker.bestFor.length>0&&broker.bestFor.join("/") || "-" },
       
       { label: "Headquarters", value: broker.headquarters || "-" },
        { label: "Established", value: broker.year_established || "-" },
        { label: "Solution Type", value: broker.solution_type || "-" },
        { label: "Execution Type", value: broker.execution_types || "-" },
        { label: "Target Clients", value: broker.target_clients&&broker.target_clients.length>0&&broker.target_clients.join("+") || "-" },
        { label: "Pricing Model", value: broker.pricingModel&&broker.pricingModel.length>0&&broker.pricingModel || "-" },
        { label: "Demo/Trial", value: (broker.demoAccount || broker.free_trial_available) ? "Available" : "Not Available", isNew: true, isPositive: !!(broker.demoAccount || broker.free_trial_available) },
       
    ]} rightSideDetails={[ 
        { label: "Compatible Platforms", value: broker.trading_platforms || "-" },
        { label: "Latency", value: broker.latency || "-" },
        { label: "Liquidity Sources", value: broker.liquiditySources&&broker.liquiditySources.length>0&&broker.liquiditySources.join(", ") || "-" },
        { label: "Assets Classes", value: broker.asset_classes&&broker.asset_classes.length>0&&broker.asset_classes.join(", ") || "-" },
        { label: "White Label", value: broker.white_label?"Yes":"No",isPositive:broker.white_label },
        { label: "API access", value: broker.api_access?"Yes--Fixed API":"No",isPositive:broker.api_access },
        { label: "Support", value: broker.support_hours || "-" },
        {label:"Setup Time",value:broker.setup_time||"-"}

        
        
    ]}/>
                        <TradingSpecifications bridgeTitle={"Best Suited For"} broker={broker} showBestSuitedFor={true} showTradingHours={false} showAccountFunding={false} showTradingSpreads={false} showStarRatings={false} showFeatures={false} platformSectionId="platform-&-features" />

                        <BrokerReview
                            broker={broker}
                            reviewTitle={`${broker?.broker_name || '-'} Review ${new Date().getFullYear()} — Liquidity Bridge & Execution Engine for Forex Brokers `}
                            sectionId="tool-review"
                        />
                        <UserReview />
                      
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
                        <SuggestedBroker brokers={randomBrokers} suggestionTitle='Suggested CRMS' />
                    </div>
                </div>
            </div>
        </div>
    )
}
