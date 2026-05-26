'use client'
import React from 'react'
import { motion, Variants } from 'framer-motion'
import { Button } from '~/components/common/button'
const ExpoImage = '/assets/images/expo.png'

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
}

const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, x: 30 },
    visible: {
        opacity: 1,
        scale: 1,
        x: 0,
        transition: { duration: 0.8, ease: "easeOut" },
    },
}

const statsContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
        },
    },
}

const statItemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 15 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

export default function ExpoBanner() {
    return (
        <div className='relative max-mobile:pb-16 pt-[100px] max-tab:pt-[120px] pb-100 overflow-hidden'>
            <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4'>
                <div className='grid items-center grid-cols-[650px_1fr] max-tab:grid-cols-1 gap-10'>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        <motion.div variants={itemVariants} className='w-fit py-1.5 px-2 bg-white pr-4 rounded-full flex items-center gap-1'>
                            <div className='py-[3px] px-2.5 max-mobile:text-sm bg-black100 text-white text-sm font-normal rounded-full'>
                                Latest
                            </div>
                            <span className='text-base max-mobile:text-sm font-medium text-black700'>
                                23 Jun-24 Jun
                            </span>
                        </motion.div>
                        <motion.h1 variants={itemVariants} className='text-black100 text-[70px] mt-3 mb-4 leading-[70px] font-bold max-mobile:text-[45px] max-mobile:leading-[50px]'>
                            Forex Broker List <span className='block text-primary'> Expo 2026 </span>
                        </motion.h1>
                        <motion.p variants={itemVariants} className='text-lg font-medium text-black700 max-w-[637px] mb-6'>
                            The world's premier fintech exhibition connecting brokers, traders, and innovators
                            across 20+ cities.
                        </motion.p>
                        <motion.div variants={itemVariants}>
                            <Button size="md" variant="primary" className="px-5 max-mobile:w-full gap-2.5 group relative z-[9]">
                                Exhibit With Us
                                <div className="w-7 h-7 rounded-full flex items-center group-hover:bg-white transition-all duration-300 justify-center bg-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M12.0254 4.94141L17.0837 9.99974L12.0254 15.0581" stroke="#1A1A1A" strokeWidth="1.25" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M2.91699 10H16.942" stroke="#1A1A1A" strokeWidth="1.25" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </Button>
                        </motion.div>
                        <motion.div 
                            variants={statsContainerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className='flex pt-8 max-tab:pt-10 max-mobile:grid max-mobile:grid-cols-2 max-mobile:gap-y-6'>
                            <motion.div variants={statItemVariants} className='px-4 pl-0 border-r border-border-light300 max-mobile:border-r-0'>
                                <p className='text-2xl text-center font-semibold text-black100'>
                                    11/36
                                </p>
                                <span className='text-sm font-medium text-black700 text-center block'>
                                    Covered Countries/Cities
                                </span>
                            </motion.div>
                            <motion.div variants={statItemVariants} className='px-4  border-r border-border-light300 max-mobile:border-r-0'>
                                <p className='text-2xl text-center font-semibold text-black100'>
                                    98k+
                                </p>
                                <span className='text-sm font-medium text-black700 text-center block'>
                                    Total Attendees
                                </span>
                            </motion.div>
                            <motion.div variants={statItemVariants} className='px-4  border-r border-border-light300 max-mobile:border-r-0'>
                                <p className='text-2xl text-center font-semibold text-black100'>
                                    86+
                                </p>
                                <span className='text-sm font-medium text-black700 text-center block'>
                                    Number of Events
                                </span>
                            </motion.div>
                            <motion.div variants={statItemVariants} className='px-4 pr-0   max-mobile:border-r-0'>
                                <p className='text-2xl text-center font-semibold text-black100'>
                                    900+
                                </p>
                                <span className='text-sm font-medium text-black700 text-center block'>
                                    Exhibitors
                                </span>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                    <motion.div
                        variants={imageVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        <motion.img 
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                            src={ExpoImage} alt="ExpoImage" className='block w-full' 
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
