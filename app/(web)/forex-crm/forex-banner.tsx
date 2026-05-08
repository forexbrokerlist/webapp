'use client'
import React from 'react'
import { Button } from '~/components/common/button';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';

const CrmImage = '/assets/images/crm.png';

export default function ForexBanner() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    const imageVariants: Variants = {
        hidden: { opacity: 0, x: 50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        },
        floating: {
            y: [0, -15, 0],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <section className="relative max-mobile:pb-16 pt-[180px] max-tab:pt-[120px] pb-100 overflow-hidden">
            <div className="max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4">
                <motion.div
                    className='grid grid-cols-[1fr_678px] max-tab:grid-cols-1 gap-10'
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <div>
                        <motion.button
                            variants={itemVariants}
                            className='bg-white border-none rounded-full py-2 px-4 text-base font-medium text-black700 shadow-sm'
                        >
                            Forex CRM
                        </motion.button>

                        <motion.h1
                            variants={itemVariants}
                            className='text-black100 text-[70px] mt-3 mb-4 leading-[70px] font-bold max-mobile:text-[45px] max-mobile:leading-[50px]'
                        >
                            The Ultimate
                            <span className='block text-primary'>
                                Forex CRM
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className='text-lg font-medium text-black700 max-w-[637px] mb-6'
                        >
                            Discover our scalable, fully customizable forex CRM. Save time and money while focusing on client
                            retention and attracting new clients.
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className='flex items-center gap-3 max-mobile:flex-col max-mobile:items-start'
                        >
                            <Link href="#crm-enquiry-section" className="max-mobile:w-full">
                                <Button size="md" variant="primary" className="px-5 max-mobile:w-full gap-2.5 group relative z-[9]">
                                    Request For Demo
                                    <div className="w-7 h-7 rounded-full flex items-center group-hover:bg-white transition-all duration-300 justify-center bg-primary">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M12.0254 4.94141L17.0837 9.99974L12.0254 15.0581" stroke="#1A1A1A" strokeWidth="1.25" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M2.91699 10H16.942" stroke="#1A1A1A" strokeWidth="1.25" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </Button>
                            </Link>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className='flex pt-8 max-tab:pt-10 max-mobile:grid max-mobile:grid-cols-2 max-mobile:gap-y-6'
                        >
                            <div className='px-4 pl-0 border-r border-border-light300 max-mobile:border-r-0'>
                                <p className='text-3xl text-center font-semibold text-black100'>
                                    250+
                                </p>
                                <span className='text-base font-medium text-black700 text-center block'>satisfied clients worldwide</span>
                            </div>
                            <div className='px-4 border-r border-border-light300 max-mobile:border-r-0'>
                                <p className='text-3xl text-center font-semibold text-black100'>
                                    370+
                                </p>
                                <span className='text-base font-medium text-black700 text-center block'>current integrations</span>
                            </div>
                            <div className='px-4 border-r border-border-light300 max-mobile:border-r-0'>
                                <p className='text-3xl text-center font-semibold text-black100'>
                                    340+
                                </p>
                                <span className='text-base font-medium text-black700 text-center block'>payment providers</span>
                            </div>
                            <div className='px-4 pr-0'>
                                <p className='text-3xl text-center font-semibold text-black100'>
                                    15+
                                </p>
                                <span className='text-base font-medium text-black700 text-center block'>years of CRM expertise</span>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        className='relative max-tab:flex max-tab:justify-center'
                        variants={imageVariants}
                        animate={["visible", "floating"]}
                    >
                        <img
                            className='block w-full max-tab:max-w-[80%] max-mobile:max-w-[95%]'
                            src={CrmImage}
                            alt="CrmImage"
                        />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
