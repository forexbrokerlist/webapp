import React from 'react'

import TableOfContents from '~/components/common/table-of-contents'

import { Button } from '~/components/common/button';

import { MoveRight } from 'lucide-react';

import SuggestedBroker from '../broker-details/suggested-broker';

import TradingDetails from '../forex-crm-details/key-details';

import CourseModulesSection from '../forex-crm-details/course-modules-section';

import TopicsSkillsSection from './topics-skills-section';

// import TradingSpecifications from './trading-specifications';

// import PlatformFeatures from './platform-features';



import BrokerReview from '../broker-details/broker-review';

import UserReview from '../broker-details/user-review';

import CompareBrokers from '../forex-crm-details/compare-crm';

import FaqSection from '../broker-details/faq-section';

import Link from 'next/link';



import TradingSpecifications from '../broker-details/trading-specifications';



const ForexImage = '/assets/images/FBL Logo.png';





export default function ForexCrmDetailsView({ broker, randomBrokers = [], trustedBrokers = [] }: { broker: any, randomBrokers?: any[], trustedBrokers?: any[] }) {

    // Build table of contents items dynamically based on content availability
    const tableOfContentsItems = [];

    // Always include these sections as they are core course information
    tableOfContentsItems.push("Trading Course Details");
    tableOfContentsItems.push("Course Modules");
    tableOfContentsItems.push("Trading Specifications");
    tableOfContentsItems.push("Topics & Skills");
    tableOfContentsItems.push("Trading Course Review");

    // Add User Review only if there are reviews
    if (broker?.reviews && broker.reviews.length > 0) {
        tableOfContentsItems.push("User Review");
    }

    // Add Compare Trading Courses (always show for now, but could be made conditional)
    tableOfContentsItems.push("Compare Trading Courses");

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

                        <TradingDetails broker={broker} sectionTitle={"Trading Course Details"} brokerDetails={[

                            { label: "Provider Type", value: broker.provider_type && broker.provider_type.length > 0 ? broker.provider_type.join(",") : "-" },

                            { label: "Skill Levels", value: broker.skill_level && broker.skill_level.length > 0 ? String(broker.skill_level).replace(/,/g, ', ') : "-" },

                            { label: "Format", value: broker.learning_format.length > 0 ? String(broker.learning_format).replace(/,/g, ' + ') : "-" },

                            { label: "Certificate", value: broker.certificate_available ? "Yes" : "No", isPositive: broker.certificate_available },

                            { label: "Free Trial", value: broker.free_trial_available ? "Yes" : "No", isPositive: broker.free_trial_available },



                        ]} additionalDetails={[

                            { label: "Pricing Model", value: broker.pricingModel && broker.pricingModel.length > 0 ? broker.pricingModel.join("/") : "-" },

                            { label: "HQ", value: broker.headquarters || "-" },

                            { label: "Founded", value: broker.year_established || "-" },

                            { label: "Community Access", value: broker.community_access ? "Yes" : "No", isPositive: broker.community_access },





                            { label: "Mentor / 1-on-1", value: broker.mentorship_available ? "Available" : "Not Available" },



                        ]} learnSection={true}
                            sectionId='trading-course-details'
                        />



                        <TradingSpecifications broker={broker} showTradingHours={false} showAccountFunding={false} showTradingSpreads={false} showStarRatings={false} showFeatures={true} platformSectionId="platform-&-features" showSkills={true} />



                        <BrokerReview

                            broker={broker}

                            reviewTitle={`${broker?.broker_name || '-'} Review ${new Date().getFullYear()} — Best Forex Education Platform For Beginners`}

                            sectionId="trading-course-review"

                        />

                        <UserReview broker={broker} />

                        <CompareBrokers broker={broker} trustedBrokers={trustedBrokers} />

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

                        <SuggestedBroker brokers={randomBrokers} suggestionTitle='Suggested Trading Courses' />

                    </div>

                </div>

            </div>

        </div>

    )

}

