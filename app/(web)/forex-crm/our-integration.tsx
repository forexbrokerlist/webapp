'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BrokreIcon = '/assets/images/brokree1.svg';

interface IntegrationPartner {
    broker_name: string | null;
    logoUrl: string | null;
}

interface OurIntegrationProps {
    tradingPlatforms: IntegrationPartner[];
    bridgeProviders: IntegrationPartner[];
    liquidityProviders: IntegrationPartner[];
    pspPartners: IntegrationPartner[];
    algoProviders: IntegrationPartner[];
}

export default function OurIntegration({
    tradingPlatforms,
    bridgeProviders,
    liquidityProviders,
    pspPartners,
    algoProviders
}: OurIntegrationProps) {
    const integrationTabs = [
        {
            id: 'platform',
            title: "Trading Platform",
            partners: tradingPlatforms
        },
        {
            id: 'bridge',
            title: "Bridge & Plugin",
            partners: bridgeProviders
        },
        {
            id: 'psp',
            title: "PSP",
            partners: pspPartners
        },
        {
            id: 'liquidity',
            title: "Liquidity Provider",
            partners: liquidityProviders
        },
        {
            id: 'algo',
            title: "Algo Bot",
            partners: algoProviders
        }
    ];

    const [activeTab, setActiveTab] = useState(integrationTabs[0].id);

    return (
        <div className='py-100 max-mobile:py-16'>
            <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4'>
                <div className='pb-[40px]'>
                    <div className='flex justify-center pb-3'>
                        <button className='bg-white border-none rounded-full py-2 px-4 text-base font-medium text-black700'>
                            Integrations
                        </button>
                    </div>
                    <h2 className='text-[42px] max-mobile:text-3xl leading-normal text-black100 font-bold text-center'>
                        Our Integration
                    </h2>
                    <p className='text-lg max-mobile:text-base text-black700 font-medium max-w-[590px] whitespace-pre-line mx-auto text-center'>
                        Explore our comprehensive suite of forex products designed to elevate your trading experience.
                    </p>
                </div>

                <div style={{ scrollbarWidth: "none" }} className='flex gap-3 max-mobile:pb-10 max-mobile:justify-start pb-[50px] justify-center items-center overflow-auto relative'>
                    {integrationTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative py-3 px-6 min-w-[190px] max-mobile:min-w-[190px] whitespace-nowrap rounded-lg text-base font-medium cursor-pointer transition-colors duration-300 z-10 ${activeTab === tab.id ? 'text-black100' : 'text-black700 bg-white border border-solid border-border-light300'
                                }`}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="active-tab-bg"
                                    className="absolute inset-0 bg-primary rounded-lg -z-10"
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                            )}
                            {tab.title}
                        </button>
                    ))}
                </div>

                <div className='max-w-[1280px] mx-auto w-full '>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className='flex items-center max-mobile:grid max-mobile:grid-cols-2 flex-wrap gap-3 justify-center'
                        >
                            {integrationTabs.find(t => t.id === activeTab)?.partners.map((partner, index) => (
                                <motion.div
                                    key={`${activeTab}-${index}`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className='max-w-[300px] w-[300px] max-mobile:w-full max-mobile:p-3 max-mobile:max-w-full max-mobile:min-w-full max-mobile:h-full h-[120px] flex items-center justify-center rounded-lg min-w-[300px] bg-white border border-solid border-primary  hover:shadow-md transition-shadow'
                                >
                                    <img
                                        src={partner.logoUrl || BrokreIcon}
                                        alt={partner.broker_name || "Integration Logo"}
                                        className='max-w-[180px] max-mobile:max-w-[90%] max-mobile:max-h-auto max-h-[60px] block object-contain  transition-all duration-300'
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
