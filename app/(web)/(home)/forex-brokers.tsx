"use client"
import { MoveRight } from 'lucide-react'
import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '~/components/common/button';
const ForexBropkerImage = '/assets/images/forex-broker.svg';

const BROKERS_LIST = [
    {
        name: "Newera365",
        description: "Modern forex and crypto broker built for the 24/7 digital trading era. Offers competitive spreads, fast execution, and a user-friendly platform for retail and professional traders."
    },
    {
        name: "ExoraPrime",
        description: "Advanced forex broker offering institutional-grade execution with tight spreads and multi-asset trading across forex, commodities, and indices."
    },
    {
        name: "SecureFX",
        description: "Regulated forex broker focused on security, transparency, and reliable trade execution for traders seeking a safe and trusted environment."
    },
    {
        name: "SeaGlobalFX",
        description: "Global forex broker offering diverse trading instruments, competitive conditions, and dedicated support for traders across all experience levels."
    }
];

export default function ForexBrokers() {
    return (
        <div className='pt-100 overflow-hidden max-mobile:pt-16'>
            <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4'>
                <div className='flex items-center max-mobile:block justify-between pb-12 max-mobile:pb-8'>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
                        }}
                    >
                        <motion.h2
                            className='text-[42px] max-mobile:text-3xl max-mobile:leading-10 leading-normal text-black100 font-bold font-monda'
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                            }}
                        >
                            Premium Forex Brokers
                        </motion.h2>
                        <motion.p
                            className='text-lg max-mobile:text-base text-black700 font-medium max-w-[705px]'
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                            }}
                        >
                            Explore our featured premium forex brokers independently verified for regulation,
                            competitive spreads, and platform quality. Trusted by traders worldwide.

                        </motion.p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        className='max-mobile:pt-4'
                        transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
                    >
                        <Button variant='primary' size='md' className='flex items-center gap-2'>
                            View More
                            <div>
                                <MoveRight />
                            </div>
                        </Button>
                    </motion.div>
                </div>
                <div className='grid grid-cols-[535px_1fr] max-tab:grid-cols-1 max-tab:gap-10 gap-20'>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
                        }}
                    >
                        {BROKERS_LIST.map((broker, index) => (
                            <motion.div
                                key={index}
                                className='py-6 first:pt-0 max-mobile:py-4 last:pb-0'
                                variants={{
                                    hidden: { opacity: 0, x: -30 },
                                    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                                }}
                            >
                                <h3 className='text-black mb-1 text-xl font-semibold'>
                                    {broker.name}
                                </h3>
                                <p className='text-base text-black700 font-medium whitespace-pre-line'>
                                    {broker.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                    <motion.div
                        className='flex items-center'
                        initial={{ opacity: 0, scale: 0.95, x: 30 }}
                        whileInView={{ opacity: 1, scale: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.2 }}
                    >
                        <motion.img
                            src={ForexBropkerImage}
                            alt="ForexBropkerImage"
                            className='block max-w-[850px] ml-auto max-laptop:max-w-full '
                            animate={{ y: [0, -15, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        />
                    </motion.div>
                </div>
            </div>

        </div>
    )
}
