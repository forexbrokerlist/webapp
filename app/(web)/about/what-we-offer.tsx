"use client"
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LiveIcon = '/assets/images/live.svg';
const ComparisonsIcon = '/assets/images/Comparisons.svg';
const AccuracyIcon = '/assets/images/Accuracy.svg';
const CommunityIcon = '/assets/images/Community.svg';
const AccessibilityIcon = '/assets/images/Accessibility.svg';
const SearchIcon = '/assets/images/Signals.svg';

const offerData = [
    {
        icon: LiveIcon,
        title: "Live Forex Market Updates",
        description: "Real-time data, trading signals, analysis, and expert insights",
        color: "#4C73FF",
    },
    {
        icon: ComparisonsIcon,
        title: "Side-by-Side Comparisons",
        description: "Compare spreads, regulations, platforms, and more",
        color: "#FEBB36",
    },
    {
        icon: AccuracyIcon,
        title: "Detailed & Pricing Reviews",
        description: "Connecting traders with trusted and regulated brokers",
        color: "#08A975",
    },
    {
        icon: CommunityIcon,
        title: "Forex Education & Training",
        description: "Resources to help traders grow their knowledge",
        color: "#EC6868",
    },
    {
        icon: AccessibilityIcon,
        title: "Algorithmic Trading Revealed",
        description: "Discover trading bots and light strategies",
        color: "#A8DD15",
    },
    {
        icon: SearchIcon,
        title: "Signals Bulletin",
        description: "Get daily opportunities resulting from effective trading logic",
        color: "#9333EA",
    }
];

export default function WhatWeOffer() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(0);

    return (
        <section className=' relative'>
            <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4'>
                <div className='grid grid-cols-[1fr_1.2fr] max-tab:grid-cols-1  gap-20 items-start'>

                    {/* Left Sticky Content */}
                    <div className=''>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className='text-[42px] max-mobile:text-3xl leading-normal text-black100 font-bold mb-4'
                        >
                            What We Offer
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className='text-lg text-black700 font-medium leading-relaxed max-w-[540px] mb-12'
                        >
                            Forex Brokers Listing is more than just a directory. Our platform brings together everything a trader needs in one place.
                        </motion.p>

                        {/* Interactive Visualizer based on hover */}
                        <div className=' laptop:flex w-full h-64 rounded-3xl bg-[#FAFAFA] border border-border-light300 items-center justify-center relative overflow-hidden'>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={hoveredIndex ?? 'default'}
                                    initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                                    transition={{ duration: 0.4 }}
                                    className='absolute inset-0 flex flex-col items-center justify-center gap-4'
                                >
                                    {hoveredIndex !== null ? (
                                        <>
                                            <div
                                                className='absolute inset-0 opacity-10'
                                                style={{ background: `radial-gradient(circle, ${offerData[hoveredIndex].color} 0%, transparent 70%)` }}
                                            />
                                            <div className='w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center relative z-10'>
                                                <img src={offerData[hoveredIndex].icon} className='w-10 h-10' alt="icon" />
                                            </div>
                                            <p className='text-xl font-bold text-black100 relative z-10'>
                                                {offerData[hoveredIndex].title}
                                            </p>
                                        </>
                                    ) : (
                                        <div className='text-center opacity-40'>
                                            <p className='text-lg font-medium text-black700'>Hover an item to explore</p>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right Interactive List */}
                    <div className='flex flex-col'>
                        {offerData.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                onMouseEnter={() => setHoveredIndex(index)}
                                className='group relative border-b  border-border-light300 py-6 max-mobile:py-4 laptop:py-6 cursor-pointer overflow-hidden flex items-start gap-6 max-mobile:gap-4 transition-colors'
                            >
                                {/* Active background slide effect */}
                                <div className={`absolute inset-0 bg-[#F5FDE8] transition-transform duration-500 ease-out -z-10 ${hoveredIndex === index ? 'translate-y-0' : 'translate-y-full'}`} />

                                {/* Number */}
                                <span className={`text-2xl max-mobile:text-lg font-semibold block pt-1 transition-colors min-w-[40px] ${hoveredIndex === index ? 'text-primary' : 'text-black300'}`}>
                                    0{index + 1}
                                </span>

                                <div className='flex-1'>
                                    <div className='flex items-center justify-between mb-0'>
                                        <h3 className={`text-2xl max-mobile:text-lg font-semibold transition-colors ${hoveredIndex === index ? 'text-black' : 'text-black100'}`}>
                                            {item.title}
                                        </h3>

                                        {/* Animated arrow icon */}
                                        <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 overflow-hidden ${hoveredIndex === index ? 'bg-primary border-primary' : 'border-black/10'}`}>
                                            <motion.svg
                                                width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                className={`transition-colors ${hoveredIndex === index ? 'text-white' : 'text-black'}`}
                                            >
                                                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </motion.svg>
                                        </div>
                                    </div>

                                    <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${hoveredIndex === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                                        <p className='overflow-hidden text-lg max-mobile:text-sm text-black700 font-medium leading-relaxed max-w-[85%]'>
                                            <span className='block pt-4 max-mobile:pt-1'>{item.description}</span>
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    )
}
