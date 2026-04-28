"use client"
import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, TrendingUp, Search, Users, ShieldCheck, Newspaper, Globe, Landmark } from 'lucide-react'

const trustPoints = [
    {
        id: 1,
        value: "4000+",
        title: "broker listed and growing",
        desc: "Access to the most comprehensive broker directory",
        icon: Globe,
        color: "#4C73FF", // Blue
    },
    {
        id: 2,
        value: "100+",
        title: "expert reviews and comparisons",
        desc: "In-depth analysis to help you make informed decisions",
        icon: Search,
        color: "#FEBB36", // Gold
    },
    {
        id: 3,
        value: "Transparent",
        title: "partnerships",
        desc: "Sponsored listings are always clearly labeled",
        icon: ShieldCheck,
        color: "#08A975", // Green
    },
    {
        id: 4,
        value: "Real reviews",
        title: "from real traders",
        desc: "Authentic feedback from the trading community",
        icon: Users,
        color: "#EC6868", // Red
    },
    {
        id: 5,
        value: "Supported for",
        title: "leading industry partners",
        desc: "Across leading platforms, liquidity providers, and CRMs",
        icon: Landmark,
        color: "#9333EA", // Purple
    },
    {
        id: 6,
        value: "5,000+",
        title: "newsletter subscribers",
        desc: "Join thousands of traders staying updated from the community",
        icon: Newspaper,
        color: "#FB923C", // Orange
    }
];

export default function TradersSection() {
    return (
        <section className='py-100 max-mobile:py-16 relative overflow-hidden'>
            <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4'>
                <div className='text-center pb-16 max-mobile:pb-10'>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className='text-[42px] max-mobile:text-3xl font-bold text-black100 leading-tight mb-4'
                    >
                        Why Traders Trust Us
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className='text-lg max-mobile:text-base text-black700 font-medium max-w-[630px] mx-auto'
                    >
                        Forex Brokers Listing is more than just a directory. Our platform brings together everything a trader needs in one place.
                    </motion.p>
                </div>

                <div className='grid grid-cols-3 max-tab:grid-cols-2 max-mobile:grid-cols-1 gap-6'>
                    {trustPoints.map((point, index) => (
                        <motion.div
                            key={point.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className='bg-white border border-border-light300 rounded-xl max-laptop:p-5 p-8 flex justify-between gap-6 group relative overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:border-primary/20'
                        >
                            {/* Screenshot Style: Vibrant Blur Accent */}
                            <div
                                className='absolute -top-10 -right-10 w-16 h-16 blur-[100px] opacity-50 group-hover:opacity-10 transition-opacity rounded-full'
                                style={{ backgroundColor: point.color }}
                            />

                            <div className='flex-1 relative z-10'>
                                <h3 className='text-2xl max-laptop:text-xl font-bold text-black100 mb-2 leading-tight'>
                                    {point.value} {point.title}
                                </h3>
                                <p className='text-lg max-laptop:text-base font-medium text-black700 leading-relaxed'>
                                    {point.desc}
                                </p>
                            </div>

                            {/* Screenshot Style: Icon Container on Right */}
                            <div className='relative z-10'>
                                <div
                                    className='w-14 h-14 rounded-full flex items-center justify-center bg-white shadow-md border border-border-light300 group-hover:scale-110 transition-transform relative z-10'
                                >
                                    <img src="/assets/images/check-fill.svg" alt="CheckIcon" className='w-6 h-6' />
                                </div>
                                {/* Glow behind the icon circle */}
                                <div
                                    className='absolute inset-0 blur-2xl opacity-40'
                                    style={{ backgroundColor: point.color }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
