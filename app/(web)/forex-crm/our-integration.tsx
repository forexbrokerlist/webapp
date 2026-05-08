'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BrokreIcon = '/assets/images/brokree1.svg';

const integrationTabs = [
    {
        id: 'platform',
        title: "Trading Platform",
        logos: [
            '/assets/images/brokree1.svg',
            '/assets/images/brokree1.svg',
            '/assets/images/brokree1.svg',
            '/assets/images/brokree1.svg',
            '/assets/images/brokree1.svg',
            '/assets/images/brokree1.svg',
            '/assets/images/brokree1.svg',
            '/assets/images/brokree1.svg',
            '/assets/images/brokree1.svg',
        ]
    },
    {
        id: 'bridge',
        title: "Bridge & Plugin",
        logos: [
            '/assets/images/brokree1.svg',
            '/assets/images/brokree1.svg',
            '/assets/images/brokree1.svg',
            '/assets/images/brokree1.svg',
            '/assets/images/brokree1.svg',
        ]
    },
    {
        id: 'psp',
        title: "PSP",
        logos: [
            '/assets/images/brokree1.svg',
            '/assets/images/brokree1.svg',
            '/assets/images/brokree1.svg',
            '/assets/images/brokree1.svg',
            '/assets/images/brokree1.svg',
        ]
    },
    {
        id: 'liquidity',
        title: "Liquidity Provider",
        logos: [
            '/assets/images/brokree1.svg',
            '/assets/images/brokree1.svg',
            '/assets/images/brokree1.svg',
            '/assets/images/brokree1.svg',
            '/assets/images/brokree1.svg',
        ]
    }
];

export default function OurIntegration() {
    const [activeTab, setActiveTab] = useState(integrationTabs[0].id);

    return (
        <div className='py-100'>
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

                <div className='flex gap-3 pb-[50px] justify-center items-center flex-wrap relative'>
                    {integrationTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative py-3 px-6 min-w-[190px] rounded-lg text-base font-medium cursor-pointer transition-colors duration-300 z-10 ${activeTab === tab.id ? 'text-black100' : 'text-black700 bg-white border border-solid border-border-light300'
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

                <div className='max-w-[1280px] mx-auto w-full min-h-[400px]'>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className='flex items-center flex-wrap gap-3 justify-center'
                        >
                            {integrationTabs.find(t => t.id === activeTab)?.logos.map((logo, index) => (
                                <motion.div
                                    key={`${activeTab}-${index}`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className='max-w-[300px] w-[300px] h-[120px] flex items-center justify-center rounded-lg min-w-[300px] bg-white border border-solid border-primary  hover:shadow-md transition-shadow'
                                >
                                    <img src={logo} alt="Integration Logo" className='max-w-[180px] max-h-[60px] block object-contain grayscale hover:grayscale-0 transition-all duration-300' />
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

