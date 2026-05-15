'use client'

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import React from 'react'
import { Button } from '~/components/common/button';
import { Input } from '~/components/common/input';

const NewsBanner = '/assets/images/news-banner.png';

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function NewsHero() {
    return (
        <div className='relative max-mobile:pb-16 pt-[140px] max-tab:pt-[120px] pb-100 overflow-hidden'>
            <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4'>
                <div className='grid grid-cols-[1fr_695px] gap-10 items-center max-laptop:grid-cols-1'>
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                    >
                        <motion.button
                            variants={fadeInUp}
                            className='py-1.5 border-none flex items-center gap-2 pr-4 px-3 bg-white rounded-full shadow-sm'
                        >
                            <span className='bg-primary text-black100 border-none rounded-full px-2 py-1 text-sm font-semibold'>
                                News
                            </span>
                            <span className='block text-base font-medium text-black700'>
                                Market Updates
                            </span>
                        </motion.button>

                        <motion.h1
                            variants={fadeInUp}
                            className='text-black100 text-[70px] max-w-[735px] leading-[70px] my-4 font-bold max-mobile:text-[45px] max-mobile:leading-[50px] tracking-tight'
                        >
                            Real-Time Updates From <span className='text-primary'> Global Markets </span>
                        </motion.h1>

                        <motion.p
                            variants={fadeInUp}
                            className='text-lg font-medium text-black700 max-w-[729px] mb-8 leading-relaxed'
                        >
                            Discover trusted data, track market movements, and explore opportunities across
                            the global trading ecosystem.
                        </motion.p>

                        <motion.div
                            variants={fadeInUp}
                            className='flex items-center gap-3 max-mobile:flex-col max-mobile:items-stretch'
                        >
                            <div className='relative flex-1 max-w-[350px] max-mobile:max-w-full group'>
                                <Input
                                    className='h-[54px] border-border-light300 rounded-xl w-full pl-4 pr-10 bg-white transition-all duration-300 group-focus-within:border-primary group-focus-within:ring-2 group-focus-within:ring-primary/10'
                                    placeholder='Search news, brokers, markets...'
                                />
                            </div>
                            <Button variant='primary' className='rounded-xl h-[54px] px-8 text-base font-semibold transition-transform duration-300 active:scale-95'>
                                <Search size={20} className="mr-2" />
                                Search
                            </Button>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.2,
                            ease: [0.22, 1, 0.36, 1]
                        }}
                        className='relative'
                    >
                        <motion.div
                            animate={{
                                y: [0, -15, 0],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <img
                                src={NewsBanner}
                                alt="News Market Visualization"
                                className='block w-full h-auto object-contain drop-shadow-2xl'
                            />
                        </motion.div>

                        {/* Decorative background element */}
                        <div className='absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-radial-gradient from-primary/5 to-transparent blur-3xl opacity-50 rounded-full' />
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

