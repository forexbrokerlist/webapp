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
import CompareBrokers from '../forex-crm-details/compare-crm';

const ForexImage = '/assets/images/FBL Logo.png';


export default function ForexPSPDetailsView({ broker, randomBrokers = [], trustedBrokers = [] }: { broker: any, randomBrokers?: any[], trustedBrokers?: any[] }) {
    return (
        <div>
            <div className='max-w-[1640px] px-5 max-laptop:px-16 mx-auto relative max-tab:px-5 max-mobile:px-4 '>
                <div className='grid grid-cols-[216px_1fr_380px] gap-5'>
                    <div>
                        <TableOfContents
                            broker={broker}
                            items={[
                                "Provider Details",
                                "Trading Specifications",
                               
                                "Provider Review",
                                "User Review",
                                "Compare PSP Partners",
                                "FAQ"
                            ]}
                        />
                    </div>
                    <div className='grid grid-cols-1 gap-5'>
                        <TradingDetails 
                            broker={broker}  
                            tradingDetailsLabel="Provider Details" 
                            tradingDetailsId="provider-details" 
                            leftHeader='Company Details' 
                            rightHeader='Technical Specs'   
                            leftSideDetails={[
                                { label: "Company Type", value: broker.company_type || "-" },
                                { label: "Target Clients", value: broker.target_clients?.map((t: string) => t === "Forex brokers" ? "Brokers" : t).join(", ") || "-" },
                              
                                { label: "Settlement Time", value: broker.settlement_time || "-" },
                                { label: "Auto Fiat Conversion", value: broker.auto_fiat_conversion ? "Yes" : "No", isPositive: broker.auto_fiat_conversion },

                                { label: "KYB Required", value: broker.kyb_required ? "Yes" : "No", isPositive: broker.kyb_required },
                                
                                { label: "White Label", value: broker.white_label ? "Yes" : "No", isPositive: broker.white_label },
                            ]} 
                            rightSideDetails={[ 
                                { label: "Supported Coins", value: broker.supported_cryptos || "-" },

                                { label: "Fiat Currencies", value: broker.fiat_currencies || "-" },
                                { label: "Integration", value: broker.integration_type&&broker.integration_type.length>0&&broker.integration_type.join(", ") || "-" },
                              
                                { label: "Checkout Page", value: broker.checkout_page ? "Yes" : "No", isPositive: broker.checkout_page },
                                { label: "Mass Payout", value: broker.mass_payout ? "Yes" : "No", isPositive: broker.mass_payout },
                              
                            ]}
                        />
                        <TradingSpecifications bridgeTitle={"Best Suited For"} broker={broker} showBestSuitedFor={true} showTradingHours={false} showAccountFunding={false} showTradingSpreads={false} showStarRatings={false} showFeatures={false} platformSectionId="platform-&-features" />

                        <BrokerReview
                            broker={(() => {
                                const firstLine = broker.review_article?.split('\n')[0]?.replace(/^#+\s*/, '').trim();
                                if (firstLine && firstLine.toLowerCase().includes('review') && firstLine.toLowerCase().includes(broker.broker_name?.toLowerCase() || '')) {
                                    const lines = broker.review_article.split('\n');
                                    lines.shift();
                                    return { ...broker, review_article: lines.join('\n').trim() };
                                }
                                return broker;
                            })()}
                            reviewTitle={(() => {
                                const firstLine = broker.review_article?.split('\n')[0]?.replace(/^#+\s*/, '').trim();
                                const defaultTitle = `${broker?.broker_name || '-'} Review ${new Date().getFullYear()} — Payment Service Provider for Forex Brokers `;
                                if (firstLine && firstLine.toLowerCase().includes('review') && firstLine.toLowerCase().includes(broker.broker_name?.toLowerCase() || '')) {
                                    return firstLine;
                                }
                                return defaultTitle;
                            })()}
                            sectionId="provider-review"
                        />
                        <UserReview broker={broker} />
                        <CompareBrokers broker={broker} trustedBrokers={trustedBrokers} />
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
                        <SuggestedBroker brokers={randomBrokers} suggestionTitle='Suggested PSP Partners'  />
                    </div>
                </div>
            </div>
        </div>
    )
}
