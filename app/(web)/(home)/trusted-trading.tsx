"use client"

import { MoveRight } from 'lucide-react'
import React from 'react'
import { Button } from '~/components/common/button'
import SponserIcon from '~/components/common/icons/sponser-icon';
import VerifyIcon from '~/components/common/icons/verify-icon';
import { motion } from 'framer-motion';

const LunarIcon = '/assets/images/lunar.svg';
const MapImage = '/assets/images/map.png';
const ForexImage = '/assets/images/forex.svg';

export default function TrustedTrading() {
    return (
        <section className='py-100 max-mobile:py-16'>
            <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4'>
                <div className='flex items-center max-mobile:block justify-between pb-12 max-mobile:pb-8 max-tab:gap-10'>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className='text-[42px] max-mobile:text-3xl leading-normal text-black100 font-bold font-monda'>
                            Trusted Trading Platforms
                        </h2>
                        <p className='text-lg max-mobile:text-base text-black700 font-medium max-w-[650px]'>
                            Explore top-rated brokers and algorithmic tools designed for smarter
                            and faster trading.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className='max-mobile:pt-5'
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Button variant='primary' size='md' className='flex items-center gap-2'>
                            View More
                            <div>
                                <MoveRight />
                            </div>
                        </Button>
                    </motion.div>
                </div>
                <div className='grid grid-cols-3 gap-6 max-tab:grid-cols-1 max-tab:gap-5'>
                    <div className=''>
                        {
                            [...Array(3)].map((_, index) => {
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.1 }}
                                        whileHover={{ y: -8, scale: 1.02 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20, delay: index * 0.15 }}
                                        className='rounded-[16px] mb-6 last:mb-0 border-[0.5px] border-[#A8DD15] p-5 max-laptop:p-4 bg-white shadow-[0_2px_20px_0_rgba(0,0,0,0.05)]'
                                    >
                                        <div className='flex items-center justify-between pb-4 max-mobile:grid max-mobile:grid-cols-1 max-mobile:gap-3'>
                                            <div className='flex items-center gap-3'>
                                                <div className='w-16 h-16 rounded-xl flex items-center justify-center bg-white shadow-[inset_0_0_15px_0_rgba(168,221,21,0.2)]'>
                                                    <img className='max-w-[38px] block' src={LunarIcon} alt="LunarIcon" />
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <h3 className='text-[22px] font-semibold font-monda text-black'>
                                                        Lunarwolf
                                                    </h3>
                                                    <VerifyIcon />
                                                </div>
                                            </div>
                                            <div>
                                                <button className='flex text-xs font-medium text-black100 items-center uppercase border-[0.8px] border-primary bg-white shadow-[0_0_10px_0_rgba(168,221,21,0.3)] gap-1.5 py-1.5 px-4 rounded-full'>
                                                    <SponserIcon />
                                                    Sponsored
                                                </button>
                                            </div>
                                        </div>
                                        <p className='text-sm text-black800 font-medium mb-5'>
                                            AI-driven predictive market models and high-frequency automated
                                            trading scripts.
                                        </p>
                                        <div className='flex items-center gap-2.5'>
                                            <p className='text-sm uppercase text-black100 font-medium'>
                                                MIN DEPOSIT:
                                            </p>
                                            <div className='w-fit text-sm font-medium text-black100 bg-[#F2F4F7] py-1.5 px-2.5 rounded-sm'>
                                                Varies
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })
                        }
                    </div>
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.1 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                            className='rounded-[16px] mb-6 border-[0.5px] border-[#A8DD15] bg-white shadow-[0_2px_20px_0_rgba(0,0,0,0.05)] overflow-hidden'
                        >
                            <div className='p-5 pb-0 relative z-10'>
                                <div className='flex items-center justify-between pb-4 max-mobile:grid max-mobile:grid-cols-1 max-mobile:gap-3'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-16 h-16 rounded-xl flex items-center justify-center bg-white shadow-[inset_0_0_15px_0_rgba(168,221,21,0.2)]'>
                                            <img className='max-w-[38px] block' src={LunarIcon} alt="LunarIcon" />
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <h3 className='text-[22px] font-semibold font-monda text-black'>
                                                Lunarwolf
                                            </h3>
                                            <VerifyIcon />
                                        </div>
                                    </div>
                                    <div>
                                        <button className='flex text-xs font-medium text-black100 items-center uppercase border-[0.8px] border-primary bg-white shadow-[0_0_10px_0_rgba(168,221,21,0.3)] gap-1.5 py-1.5 px-4 rounded-full'>
                                            <SponserIcon />
                                            Sponsored
                                        </button>
                                    </div>
                                </div>
                                <p className='text-sm text-black800 font-medium mb-5'>
                                    AI-driven predictive market models and high-frequency automated
                                    trading scripts.
                                </p>
                                <div className='flex items-center gap-2.5'>
                                    <p className='text-sm uppercase text-black100 font-medium'>
                                        MIN DEPOSIT:
                                    </p>
                                    <div className='w-fit text-sm font-medium text-black100 bg-[#F2F4F7] py-1.5 px-2.5 rounded-sm'>
                                        Varies
                                    </div>
                                </div>
                            </div>
                            <img src={MapImage} alt="MapImage" className='block w-full mt-[-44px] object-center h-[185px] object-cover relative z-0' />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.1 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.25 }}
                            className='rounded-[16px] border-[0.5px] border-[rgba(26,26,26,0.2)] bg-black100 p-5'
                        >
                            <div className='flex items-center justify-between pb-4 max-mobile:grid max-mobile:grid-cols-1 max-mobile:gap-3'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-16 h-16 rounded-xl flex items-center justify-center bg-[rgba(255,255,255,0.14)] '>
                                        <img className='max-w-[38px] block' src={LunarIcon} alt="LunarIcon" />
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <h3 className='text-[22px] font-semibold font-monda text-white'>
                                            Your brand here
                                        </h3>
                                        <VerifyIcon />
                                    </div>
                                </div>
                                <div>
                                    <button className='text-sm border-none bg-white rounded-full text-black100 font-medium px-4 py-1.5'>
                                        Add New
                                    </button>
                                </div>
                            </div>
                            <p className='text-sm text-white700 font-medium mb-5'>
                                AI-driven predictive market models and high-frequency automated
                                trading scripts.
                            </p>
                            <img src={ForexImage} alt="ForexImage" className='block w-full' />
                            <div>
                                <Button size='md' variant='primary' className='bg-white text-sm py-2 w-full font-medium text-black100'>
                                    Advertise on Forex Brokers Listing
                                    <div className='flex items-center'>
                                        <MoveRight />
                                    </div>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                    <div>
                        {
                            [...Array(3)].map((_, index) => {
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.1 }}
                                        whileHover={{ y: -8, scale: 1.02 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20, delay: index * 0.15 + 0.15 }}
                                        className='rounded-[16px] mb-6 max-laptop:p-4 last:mb-0 border-[0.5px] border-[#A8DD15] p-5 bg-white shadow-[0_2px_20px_0_rgba(0,0,0,0.05)]'
                                    >
                                        <div className='flex items-center justify-between pb-4 max-mobile:grid max-mobile:grid-cols-1 max-mobile:gap-3'>
                                            <div className='flex items-center gap-3'>
                                                <div className='w-16 h-16 rounded-xl flex items-center justify-center bg-white shadow-[inset_0_0_15px_0_rgba(168,221,21,0.2)]'>
                                                    <img className='max-w-[38px] block' src={LunarIcon} alt="LunarIcon" />
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <h3 className='text-[22px] font-semibold font-monda text-black'>
                                                        Lunarwolf
                                                    </h3>
                                                    <VerifyIcon />
                                                </div>
                                            </div>
                                            <div>
                                                <button className='flex text-xs font-medium text-black100 items-center uppercase border-[0.8px] border-primary bg-white shadow-[0_0_10px_0_rgba(168,221,21,0.3)] gap-1.5 py-1.5 px-4 rounded-full'>
                                                    <SponserIcon />
                                                    Sponsored
                                                </button>
                                            </div>
                                        </div>
                                        <p className='text-sm text-black800 font-medium mb-5'>
                                            AI-driven predictive market models and high-frequency automated
                                            trading scripts.
                                        </p>
                                        <div className='flex items-center gap-2.5'>
                                            <p className='text-sm uppercase text-black100 font-medium'>
                                                MIN DEPOSIT:
                                            </p>
                                            <div className='w-fit text-sm font-medium text-black100 bg-[#F2F4F7] py-1.5 px-2.5 rounded-sm'>
                                                Varies
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}
