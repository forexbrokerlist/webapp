'use client'
import React from 'react'
import { Button } from '~/components/common/button';
import { motion, Variants } from 'framer-motion';

const TextImage = '/assets/images/text-img.png';

export default function ForexBusiness() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, x: -30 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const imageVariants: Variants = {
        hidden: { opacity: 0, x: 50, scale: 0.95 },
        visible: { 
            opacity: 1, 
            x: 0,
            scale: 1,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    return (
        <div className='pb-100 overflow-hidden'>
            <div className="max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <div className='grid items-center grid-cols-[1fr_730px] max-tab:grid-cols-1 max-laptop:grid-cols-2 gap-10'>
                        <motion.div variants={containerVariants}>
                            <motion.div variants={itemVariants} className='pb-3'>
                                <button className='bg-white border-none rounded-full py-2 px-4 text-base font-medium text-black700 shadow-sm'>
                                    About Forex CRM
                                </button>
                            </motion.div>
                            <motion.h2 variants={itemVariants} className='text-[42px] max-mobile:text-3xl leading-normal text-black100 max-w-[596px] font-bold'>
                                Building Your Forex Business from the Ground Up
                            </motion.h2>
                            <motion.p variants={itemVariants} className='text-lg max-mobile:text-base mb-4 text-black700 font-medium max-w-[694px] whitespace-pre-line'>
                                Forex CRM is a global forex technology provider, offering everything you need to establish and grow a successful forex brokerage. From company formation to licensing, and beyond, we are your trusted partner in creating world-class forex brokerage solutions. With extensive experience in forex technology, Forex CRM provides seamless access to retail forex trading markets and
                                cutting-edge tools.
                            </motion.p>
                            <motion.p variants={itemVariants} className='text-lg max-mobile:text-base mb-4 text-black700 font-medium max-w-[694px] whitespace-pre-line'>
                                At Forex CRM, we deliver comprehensive forex technology solutions including company formation, broker licensing, web development, trader’s room setup, MT4/ MT5 White Label, and CRM
                                integration to help your brokerage thrive in the competitive market.
                            </motion.p>
                            <motion.div variants={itemVariants}>
                                <Button size="md" variant="primary" className="px-5 gap-2.5 group relative z-[9]">
                                    Contact Us
                                    <div className="w-7 h-7 rounded-full flex items-center group-hover:bg-white transition-all duration-300 justify-center bg-primary">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M12.0254 4.94141L17.0837 9.99974L12.0254 15.0581" stroke="#1A1A1A" strokeWidth="1.25" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M2.91699 10H16.942" stroke="#1A1A1A" strokeWidth="1.25" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </Button>
                            </motion.div>
                        </motion.div>
                        <motion.div variants={imageVariants}>
                            <img src={TextImage} className='block w-full' alt="TextImage" />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

