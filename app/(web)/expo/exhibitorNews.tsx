"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

type ExpoNews = {
    id: string;
    title: string | null;
    imgurl: string | null;
    summary: string | null;
    content: string | null;
};

export default function ExhibitorNews({ news }: { news: ExpoNews[] }) {
    const newsItems = news.map((item) => ({
        id: item.id,
        title: item.title || "Untitled",
        desc: item.summary || "",
        image: item.imgurl || "/assets/images/expo-card.png",
    }));

    const [activeIndex, setActiveIndex] = useState(0);
    const router = useRouter();

    return (
        <div className='py-100'>
            <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4 py-[50px]'>
                <div className='pb-[60px]'>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className='text-[42px] max-mobile:text-3xl max-mobile:leading-10 text-center leading-normal text-black100 font-bold'
                    >
                        Exhibitor News
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                        className='text-lg max-mobile:text-base text-black700 text-center mx-auto font-medium max-w-[650px]'
                    >
                        Our mission is simple: to empower traders with clarity. We believe that every trader whether a beginner or a
                        seasoned professional deserves
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

                <div className='bg-white border border-border-light300 p-5 max-mobile:p-3 rounded-xl'>
                    <div className='grid grid-cols-2 max-laptop:grid-cols-1 gap-5'>
                        {/* Left Side Image */}
                        <motion.div
                            onClick={() => router.push(`/exhibitor/${newsItems[activeIndex].id}`)}
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className='w-full h-full min-h-[400px] overflow-hidden rounded-2xl relative group cursor-pointer'
                            whileHover="hover"
                        >
                            <AnimatePresence>
                                <motion.img
                                    key={activeIndex}
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1 }}
                                    variants={{
                                        hover: { scale: 1.08, filter: "brightness(0.75)" }
                                    }}
                                    transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                                    src={newsItems[activeIndex].image}
                                    alt="Expo News Image"
                                    className='absolute inset-0 w-full h-full object-cover block transition-all'
                                />
                            </AnimatePresence>

                            {/* Animated Overlay content */}
                            <motion.div
                                variants={{
                                    hover: { opacity: 1, y: 0, scale: 1 }
                                }}
                                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className='absolute inset-0 flex items-center justify-center pointer-events-none'
                            >
                                <div className='bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-3 rounded-full font-semibold text-lg flex items-center gap-2 shadow-2xl'>
                                    <span>Read Full Story</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Right Side List */}
                        <div className='flex flex-col gap-3 justify-center'>
                            {newsItems.map((item, index) => (
                                <motion.div
                                    key={index}
                                    onClick={() => router.push(`/exhibitor/${item.id}`)}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
                                    whileHover={{ scale: 1.02 }}
                                    className={`p-6 max-mobile:p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${activeIndex === index ? 'border-primary bg-white' : 'border-transparent bg-transparent hover:border-primary hover:bg-white'
                                        }`}
                                    style={{
                                        boxShadow: activeIndex === index ? '0px 4px 20px rgba(0,0,0,0.03)' : 'none'
                                    }}
                                >

                                    <h3 className='text-xl max-mobile:text-lg font-bold text-black100 mb-2 line-clamp-1'>
                                        {item.title}
                                    </h3>
                                    <p className='text-base text-black700 line-clamp-2 leading-relaxed'>
                                        {item.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
