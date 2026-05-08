'use client';

import { ChevronDown } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const services = [
    {
        title: "Forex Broker Setup",
        description: "End-to-end forex broker setup service to launch your brokerage swiftly.",
        image: '/assets/images/ForexBrokerSetup.png'
    },
    {
        title: "MT4/MT5 Setup & Training",
        description: "Professional platform configuration and comprehensive training for your team to master trading tools.",
        image: '/assets/images/CRMMT4.png'
    },
    {
        title: "RMS",
        description: "Advanced Risk Management Systems to monitor exposure and protect your brokerage from market volatility.",
        image: '/assets/images/CrmRms.png'
    },
    {
        title: "Liquidity Provider's Setup",
        description: "Direct connection to top-tier liquidity providers ensuring tight spreads and deep market depth.",
        image: '/assets/images/CrmLiquidity.png'
    },
    {
        title: "AI/ML Services",
        description: "Cutting-edge artificial intelligence and machine learning solutions for predictive market analysis.",
        image: '/assets/images/CrmAI.png'
    }
];

export default function OurService() {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % services.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className='pt-[60px] pb-100 max-mobile:py-16'>
            <div className="max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4">
                <motion.div
                    className='pb-[60px] max-mobile:pb-10'
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, staggerChildren: 0.2 }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className='flex justify-center pb-3'
                    >
                        <button className='bg-white border-none rounded-full py-2 px-4 text-base font-medium text-black700 shadow-sm'>
                            Our Services
                        </button>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className='text-[42px] max-mobile:text-3xl leading-normal text-black100 font-bold text-center'
                    >
                        Services Tailored For Forex Success
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className='text-lg max-mobile:text-base text-black700 font-medium max-w-[590px] whitespace-pre-line mx-auto text-center'
                    >
                        Unlock comprehensive solutions to enhance your forex brokerage with cutting edge
                        technology and expert support.
                    </motion.p>
                </motion.div>
                <div className='grid grid-cols-[570px_1fr]  max-tab:grid-cols-1 max-laptop:grid-cols-2 gap-10 '>
                    <div className='flex flex-col gap-4 max-mobile:min-h-[520px]'>
                        {services.map((service, index) => (
                            <div
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                className={`p-6 max-laptop:p-5 rounded-xl border bg-[#F4F4F4] border-solid border-border-light300 transition-all duration-300 cursor-pointer ${activeIndex === index
                                    ? ' border-primary shadow-[0_0_20.8px_0_rgba(0,0,0,0.04)]'
                                    : ' '
                                    }`}
                            >
                                <div className='flex items-center justify-between'>
                                    <h3 className={`text-xl max-laptop:text-lg font-semibold ${activeIndex === index ? 'text-black100' : 'text-black100'}`}>
                                        {service.title}
                                    </h3>
                                    <motion.div
                                        animate={{ rotate: activeIndex === index ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ChevronDown className={activeIndex === index ? 'text-black100' : 'text-black700'} />
                                    </motion.div>
                                </div>
                                <AnimatePresence initial={false}>
                                    {activeIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            className="overflow-hidden"
                                        >
                                            <p className="text-lg text-black700 font-normal mt-2">
                                                {service.description}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                    <div className="bg-[#F4F4F4] shadow-[0_0_20px_0_rgba(0,0,0,0.04)] rounded-xl flex items-center justify-center p-10 max-mobile:p-4 min-h-[530px] max-h-[530px] max-mobile:max-h-[280px] max-mobile:min-h-[280px]  overflow-hidden relative ">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={activeIndex}
                                src={services[activeIndex].image}
                                alt={services[activeIndex].title}
                                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="block max-w-[747px] max-laptop:max-w-[90%] max-mobile:max-w-[95%] h-auto object-contain"
                            />
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

