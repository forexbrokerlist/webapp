"use client"

import { MoveRight } from 'lucide-react'
import React from 'react'
import { Button } from '~/components/common/button'
import SponserIcon from '~/components/common/icons/sponser-icon';
import VerifyIcon from '~/components/common/icons/verify-icon';
import { motion } from 'framer-motion';
import { Favicon } from '~/components/web/ui/favicon';
import Link from 'next/link';
import { platform } from 'os';

const MapImage = '/assets/images/map.png';

const ForexImage = '/assets/images/FBL Logo.png';

interface Platform {
    id: number;
    name: string;
    description: string;
    minDeposit: string;
    logo: string;
    isSponsor: boolean;
    rating: string;
    slug:string ;
}

interface TrustedTradingProps {
    platforms: Platform[];
}

const PlatformCard = ({ platform, index, delay = 0, className = "" }: { platform: Platform, index: number, delay?: number, className?: string }) => (
    <motion.div
        key={platform.id}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: index * 0.15 + delay }}
        className={`rounded-[16px] mb-6 last:mb-0 border-[0.5px] border-[#A8DD15] p-5 max-laptop:p-4 bg-white shadow-[0_2px_20px_0_rgba(0,0,0,0.05)] ${className}`}
    >
        <Link href={`broker/${platform.slug}`}>
        <div className='flex items-center justify-between pb-4 max-mobile:grid max-mobile:grid-cols-1 max-mobile:gap-3'>
            <div className='flex items-center gap-3'>
                <div className='w-16 h-16 rounded-xl flex items-center justify-center bg-white shadow-[inset_0_0_15px_0_rgba(168,221,21,0.2)] overflow-hidden'>
                    <Favicon src={platform.logo} title={platform.name} size={38} contained className="size-full" />
                </div>
                <div className='flex items-center gap-2'>
                    <h3 className='text-[22px] font-semibold font-monda text-black'>
                        {platform.name}
                    </h3>
                    <VerifyIcon />
                </div>
            </div>
           
        </div>
        <p className='text-sm text-black800 font-medium mb-5 line-clamp-2'>
            {platform.description}
        </p>
        <div className='flex items-center gap-2.5'>
            <p className='text-sm uppercase text-black100 font-medium'>
                MIN DEPOSIT:
            </p>
            <div className='w-fit text-sm font-medium text-black100 bg-[#F2F4F7] py-1.5 px-2.5 rounded-sm'>
                {platform.minDeposit}
            </div>
        </div>
        </Link>
    </motion.div>
);

export default function TrustedTrading({ platforms }: TrustedTradingProps) {
    const leftCol = platforms.slice(1, 4);
    const featured = platforms[0];
    const rightCol = platforms.slice(4, 7);

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
                           Top-Rated Forex Brokers & Trading Platforms

                        </h2>
                        <p className='text-lg max-mobile:text-base text-black700 font-medium max-w-[885px]'>
                          Browse verified forex brokers and trading platforms, compare spreads, regulation, and features to find 
the right fit for your trading goals.
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
                           <Link href="/categories/trusted-trading-platforms">
                            View More
                            <div>
                                <MoveRight />
                            </div>
                            </Link>
                        </Button>
                    </motion.div>
                </div>
                <div className='grid grid-cols-3 gap-6 max-tab:grid-cols-1 max-tab:gap-5'>
                    <div className=''>
                        {leftCol.map((platform, index) => (
                            <PlatformCard key={platform.id} platform={platform} index={index} />
                        ))}
                    </div>
                    <div>
                        {featured && (
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.1 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                                className='rounded-[16px] mb-6 border-[0.5px] border-[#A8DD15] bg-white shadow-[0_2px_20px_0_rgba(0,0,0,0.05)] overflow-hidden'
                            >
                                <Link href={`/broker/${featured.slug}`}>
                                <div className='p-5 pb-0 relative z-10'>
                                    <div className='flex items-center justify-between pb-4 max-mobile:grid max-mobile:grid-cols-1 max-mobile:gap-3'>
                                        <div className='flex items-center gap-3'>
                                            <div className='w-16 h-16 rounded-xl flex items-center justify-center bg-white shadow-[inset_0_0_15px_0_rgba(168,221,21,0.2)] overflow-hidden'>
                                                <Favicon src={featured.logo} title={featured.name} size={48} contained className="size-full" />
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <h3 className='text-[22px] font-semibold font-monda text-black'>
                                                    {featured.name}
                                                </h3>
                                                <VerifyIcon />
                                            </div>
                                        </div>
                                        {/* {featured.isSponsor && (
                                            <div>
                                                <button className='flex text-xs font-medium text-black100 items-center uppercase border-[0.8px] border-primary bg-white shadow-[0_0_10px_0_rgba(168,221,21,0.3)] gap-1.5 py-1.5 px-4 rounded-full'>
                                                    <SponserIcon />
                                                    Sponsored
                                                </button>
                                            </div>
                                        )} */}
                                    </div>
                                    <p className='text-sm text-black800 font-medium mb-5 line-clamp-2'>
                                        {featured.description}
                                    </p>
                                    <div className='flex items-center gap-2.5'>
                                        <p className='text-sm uppercase text-black100 font-medium'>
                                            MIN DEPOSIT:
                                        </p>
                                        <div className='w-fit text-sm font-medium text-black100 bg-[#F2F4F7] py-1.5 px-2.5 rounded-sm'>
                                            {featured.minDeposit}
                                        </div>
                                    </div>
                                </div>
                                <img src={MapImage} alt="MapImage" className='block w-full mt-[-44px] object-center h-[185px] object-cover relative z-0' />
                            </Link>
                            </motion.div>
                        )}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.1 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.25 }}
                            className='rounded-[16px] border-[0.5px] border-[rgba(26,26,26,0.2)] bg-white p-5'
                        >
                            <div className='flex items-center justify-between pb-4 max-mobile:grid max-mobile:grid-cols-1 max-mobile:gap-3'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-16 h-16 rounded-xl flex items-center justify-center bg-[rgba(255,255,255,0.14)] '>
                                        <img className='max-w-[64px] block' src={'/assets/images/ForexLogo.png'} alt="LunarIcon" />
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <h3 className='text-[22px] font-semibold font-monda text-black100'>
                                            Your brand here
                                        </h3>
                                        {/* <VerifyIcon /> */}
                                    </div>
                                </div>
                                <div>
                                    <button className='text-sm border-none bg-primary rounded-full text-black100 font-medium px-4 py-1.5'>
                                        Add New
                                    </button>
                                </div>
                            </div>
                            <p className='text-sm text-black100 font-medium mb-5'>
                               Reach our audience of professional directory owners and boost your sales.
                            </p>
                            <img src={ForexImage} alt="ForexImage" className='block w-full' />
                            <div>
                                <Button size='md' variant='primary' className='bg-black100 text-sm py-2 w-full font-medium text-primary'>
                                  <Link href="/advertise">
                                    Advertise on Forex Brokers Listing
                                    <div className='flex items-center'>
                                        <MoveRight />
                                    </div>
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                    <div>
                        {rightCol.map((platform, index) => (
                            <PlatformCard key={platform.id} platform={platform} index={index} delay={0.15} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
