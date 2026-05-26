"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ExpoCardImage = '/assets/images/expo-card.png';

const tabs = [2025, 2024, 2023, 2022, 2021, 2020];

export default function Recap() {
    const [activeTab, setActiveTab] = useState(2025);

    return (
        <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4 '>
            <div className='pb-[60px]'>
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className='text-[42px] max-mobile:text-3xl max-mobile:leading-10 text-center leading-normal text-black100 font-bold'
                >
                    Recap
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    className='text-lg max-mobile:text-base text-black700 text-center mx-auto font-medium max-w-[650px]'
                >
                    Our mission is simple: to empower traders with clarity. We believe that every trader whether a beginner or a seasoned professional deserves
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                    className='flex pt-2 items-center justify-center gap-0.5 cursor-pointer hover:opacity-80 transition-opacity'
                >
                    <span className='block text-lg font-medium text-black100'>
                        View more
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M7.5026 4.16634L12.8613 8.96853C13.4942 9.53566 13.4942 10.4637 12.8613 11.0308L7.50261 15.833" stroke="#1A1A1A" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className='flex flex-wrap items-center gap-3 justify-center'
            >
                {tabs.map((tab) => (
                    <motion.button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative flex py-2.5 px-6 items-center cursor-pointer gap-2.5 text-lg font-medium border-none rounded-xl transition-colors duration-300 ${activeTab === tab ? 'text-black100' : 'text-black100 bg-white hover:bg-gray-50'
                            }`}
                        style={{
                            boxShadow: activeTab !== tab ? '0px 2px 8px rgba(0,0,0,0.04)' : 'none'
                        }}
                    >
                        {activeTab === tab && (
                            <motion.div
                                layoutId="active-tab"
                                className="absolute inset-0 bg-primary rounded-xl"
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <g clipPath={`url(#clip0_5806_548_${tab})`}>
                                    <path d="M13.2998 9.60907L9.14688 6.5902C9.07227 6.53581 8.98407 6.50312 8.89203 6.49574C8.79999 6.48836 8.70771 6.50659 8.62539 6.54841C8.54307 6.59022 8.47392 6.65399 8.42559 6.73267C8.37727 6.81134 8.35165 6.90185 8.35156 6.99418V13.0299C8.35128 13.1224 8.3767 13.2131 8.42497 13.292C8.47324 13.3709 8.54248 13.4348 8.62496 13.4766C8.70743 13.5184 8.79991 13.5365 8.89207 13.5289C8.98422 13.5212 9.07244 13.4881 9.14688 13.4332L13.2998 10.417C13.364 10.371 13.4163 10.3104 13.4523 10.2401C13.4884 10.1699 13.5072 10.092 13.5072 10.0131C13.5072 9.93408 13.4884 9.85625 13.4523 9.786C13.4163 9.71575 13.364 9.6551 13.2998 9.60907Z" fill="#1A1A1A" />
                                    <path d="M10.0003 0.00146484C4.47639 0.00146484 0 4.47785 0 10.0018C0 15.5237 4.47639 19.9988 10.0003 19.9988C15.5229 19.9988 20 15.5231 20 10.0018C20.0007 4.47785 15.5229 0.00146484 10.0003 0.00146484ZM10.0003 18.3303C5.40015 18.3303 1.67049 14.6026 1.67049 10.0018C1.67049 5.40295 5.40015 1.67063 10.0003 1.67063C14.5998 1.67063 18.3288 5.40228 18.3288 10.0018C18.3295 14.6026 14.5998 18.3303 10.0003 18.3303Z" fill="#1A1A1A" />
                                </g>
                                <defs>
                                    <clipPath id={`clip0_5806_548_${tab}`}>
                                        <rect width="20" height="20" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                            {tab}
                        </span>
                    </motion.button>
                ))}
            </motion.div>

            <motion.div
                layout
                className='pt-[40px] grid grid-cols-2 max-laptop:grid-cols-1 gap-5'
            >
                {
                    [...Array(6)].map((_, index) => {
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                                whileHover={{ y: -5, boxShadow: "0px 10px 30px rgba(0,0,0,0.08)" }}
                                className='bg-white p-5 rounded-xl border border-[rgba(26,26,26,0.14)] export-card-grid gap-5 overflow-hidden transition-all duration-300 cursor-pointer'
                            >
                                <div className='bg-[#F4F4F4] rounded-md p-6 flex flex-col justify-center'>
                                    <div className='flex pb-4 items-center justify-between'>
                                        <button className='border-none text-sm font-medium text-black100 py-1.5 bg-[rgba(26,26,26,0.10)] px-4 rounded-md'>
                                            Nov 11,2026
                                        </button>
                                        <button className='border-none text-sm font-medium text-black100 py-1.5 bg-primary px-4 rounded-md'>
                                            Recap
                                        </button>
                                    </div>
                                    <h2 className='text-[22px] mb-3 font-bold text-black100 leading-snug'>
                                        United Arab Emirates · Dubai
                                    </h2>
                                    <p className='text-base text-black700 line-clamp-3 leading-relaxed'>
                                        Wiki Finance Dubai 2026, will be held on 4 Dec 2026 and there will be 1 day exhibition Wiki Finance Dubai 2026, will be held on
                                        4 Dec 2026 and there will be 1 day exhibition
                                    </p>
                                </div>
                                <div className='h-full w-full overflow-hidden rounded-md'>
                                    <motion.img
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.4 }}
                                        src={ExpoCardImage}
                                        alt="ExpoCardImage"
                                        className="h-full object-cover rounded-md w-full block"
                                    />
                                </div>
                            </motion.div>
                        )
                    })
                }
            </motion.div>
        </div>
    )
}
