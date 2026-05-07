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

export default function ForexAlgoProviderDetailView({ broker, randomBrokers = [], trustedBrokers = [] }: { broker: any, randomBrokers?: any[], trustedBrokers?: any[] }) {
    const leftSideDetails = [
        { label: "Bot Type", value: broker.bot_type || "-" },
        { label: "Strategy Type", value: broker.strategy_type && broker.strategy_type.length > 0 && broker.strategy_type || "-" },
        { label: "Automation", value: broker.automation_level || "-" },
        { label: "Founded", value: broker.year_established || "-" },
        { label: "Win Rate", value: broker.win_rate || "-" },
        { value: broker.verified_performance || '-', label: `Verified By` },
        { label: "Trades/Day", value: broker.trades_per_day || "-" },
        { label: "Best For", value: broker.bestFor?.join(" + ") || "-" },

    ];

    const rightSideDetails = [
        { label: "Compatible Platforms", value: broker.trading_platforms || "-" },
        { label: "Supported Pairs", value: broker.supported_pairs && broker.supported_pairs.length > 0 && broker.supported_pairs.join(",") || "-" },
        { label: "Risk Levels", value: broker.risk_levels && broker.risk_levels.length > 0 && broker.risk_levels.join(",") || "-" },
        { label: "NFA/FIFO", value: broker.nfa_fifo ? "Compatible" : "Not Compatible", isPositive: broker.nfa_fifo },
        { label: "ECN compatible", value: broker.ecn_compatible ? "Yes" : "No", isPositive: broker.ecn_compatible },
        { label: "VPS Required", value: broker.vps_required ? "Recommended" : "Not Recommended", isPositive: broker.vps_required },
        { label: "Mobile Support", value: broker.mobile_support ? "Yes" : "No -- PC/VPS Only", isPositive: broker.mobile_support },
        { label: "Min Deposit", value: broker.minimum_deposit || "-" }
    ];

    // Build table of contents items dynamically based on content availability
    const tableOfContentsItems = [];

    // Always include these sections as they are core algo provider information
    tableOfContentsItems.push("Bot Details");
    tableOfContentsItems.push("Trading Specifications");
    tableOfContentsItems.push("Platform Review");

    // Add User Review only if there are reviews
    if (broker?.reviews && broker.reviews.length > 0) {
        tableOfContentsItems.push("User Review");
    }

    // Always include Compare Bot Providers
    tableOfContentsItems.push("Compare Bot Providers");

    // Add FAQ only if there are FAQs
    if (broker?.faqs && broker.faqs.length > 0) {
        tableOfContentsItems.push("FAQ");
    }

    return (
        <div>
            <div className='max-w-[1640px] px-5 max-laptop:px-16 mx-auto relative max-tab:px-5 max-mobile:px-4 '>
                <div className='grid grid-cols-[216px_1fr_380px] max-laptop:grid-cols-[200px_1fr_300px] max-tab:grid-cols-1 gap-5'>
                    <div className='max-tab:hidden'>
                        <TableOfContents
                            broker={broker}
                            items={tableOfContentsItems}
                        />
                    </div>
                    <div className='grid grid-cols-1 gap-5'>
                        <TradingDetails
                            broker={broker}
                            leftHeader="Provider Details"
                            rightHeader="Technical Specs"
                            leftSideDetails={leftSideDetails}
                            rightSideDetails={rightSideDetails}
                            tradingDetailsLabel="BOT DETAILS"
                            tradingDetailsId="bot-details"
                        />

                        <TradingSpecifications
                            bridgeTitle="Best Suited For"
                            broker={broker}
                            showTradingHours={false}
                            showAccountFunding={false}
                            accountFundingHeading='Pricing & Deployment'
                            accountFundingDetails={[
                                { label: "White Label Price", value: broker.white_label_price || "-" },
                                { label: "Server License", value: broker.server_license || "-" },

                                { label: "Hosting Included", value: broker.hosting_included ? "Yes" : "No", isPositive: broker.hosting_included },
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
                            showFeatures={false}
                            showBestSuitedFor={false}
                            showPricingSection={true}
                            platformSectionId="trading-specifications"
                        />

                        <BrokerReview
                            broker={broker}
                            reviewTitle={`${broker?.broker_name || '-'} Review ${new Date().getFullYear()} — Trading Platform for Forex Brokers`}
                            sectionId="platform-review"
                        />
                        <UserReview broker={broker} />
                        <CompareBrokers broker={broker} trustedBrokers={trustedBrokers} sectionId="compare-bot-providers" />
                        <FaqSection broker={broker} />
                    </div>
                    <div>
                        <div className='p-5 sticky top-[100px] max-tab:relative max-tab:top-0 z-[99] mb-5 rounded-xl border-[0.5px] border-[#A8DD15] bg-[#FFFFFE] shadow-[0_2px_20px_0_rgba(0,0,0,0.05)]'>
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
