"use client"
import { MoveRight } from 'lucide-react'
import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '~/components/common/button';
import Link from 'next/link';

const ForexBropkerImage = '/assets/images/forex-broker.svg';

const BROKERS_LIST = [
    {
        name: "OLYMP TRADE",
        description: "Trade 190+ assets including forex, stocks & crypto. User-friendly platform with zero spreads, leverage up to 1:500, and 24/7 multilingual support."
    },
    {
        name: "OCTAFX ",
        description: "Commission-free forex broker serving 1.5M+ traders in 100+ countries. Offers MT4, MT5 & OctaTrader with spreads from 0.6 pips and fast order execution."
    },
    {
        name: " iFOREX",
        description: " Established since 1996 with 750+ instruments. Offers 1-on-1 personal coaching, proprietary FXNet platform, and trading signals for all experience levels."
    },
    {
        name: "XM GROUP",
        description: "Multi-regulated global broker with 1,400+ instruments, spreads from 0.8 pips, zero deposit fees, free webinars, and Trading Central market research tools."
    }
];

const BROKERS_MARQUEE = [
    { name: "Exness", logo: "/assets/images/fynxt.svg" },
    { name: "IC Markets", logo: "/assets/images/lmax.svg" },
    { name: "Blueberry Markets", logo: "/assets/images/veo.svg" },
    { name: "Pepperstone", logo: "/assets/images/wan.svg" },
    { name: "Olymp Trade", logo: "/assets/images/lunar.svg" },
    { name: "XM", logo: "/assets/images/sol.svg" },
    { name: "OctaFX", logo: "/assets/images/elevenlabs.svg" },
    { name: "HYCM", logo: "/assets/images/kling.svg" },
];

const BrokerCard = ({ name, logo }: { name: string, logo: string }) => (
    <div className='w-[240px] group shrink-0 border border-[#E4E4E4] bg-white shadow-[0_4px_20px_0_rgba(0,0,0,0.05)] rounded-xl overflow-hidden mx-3'>
        <div className='bg-[#1A1A1A] group-hover:bg-primary py-2 transition-all duration-300 px-4 flex items-center justify-center h-[36px]'>
            <span className='text-white group-hover:text-black100 transition-all duration-300 text-sm font-bold tracking-widest uppercase opacity-90 truncate font-monda'>{name}</span>
        </div>
        <div className='h-[90px] flex items-center justify-center p-6 bg-white'>
            <img
                src={logo}
                alt={name}
                className='max-h-[50px] max-w-[140px] object-contain  transition-all duration-300'
            />
        </div>
    </div>
)


export default function ForexBrokers({ brokers }: any) {
    return (
        <div className='pt-100 overflow-hidden max-mobile:pt-16'>
            <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-0'>
                <div className='flex items-center max-mobile:block justify-between pb-12 max-mobile:pb-8 max-mobile:px-4'>
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
                        <Link href="brokers">
                            <Button variant='primary' size='md' className='flex items-center gap-2'>
                                View More
                                <div>
                                    <MoveRight />
                                </div>
                            </Button>
                        </Link>
                    </motion.div>
                </div>
                <div className='grid grid-cols-7 max-mobile:px-4 max-tab:grid-cols-3 max-mobile:flex max-mobile:overflow-auto gap-3' style={{ scrollbarWidth: 'none' }}>
                    {(brokers && brokers.length > 0 ? brokers : BROKERS_LIST).map((broker: any, index: number) => (
                        <motion.div
                            key={index}
                            className='border max-mobile:w-[280px] max-mobile:min-w-[280px] max-mobile:max-w-[280px] border-[#E4E4E4] bg-white shadow-[0_0_32.4px_0_rgba(26,26,26,0.05)] rounded-xl p-5'
                            variants={{
                                hidden: { opacity: 0, x: -30 },
                                visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                            }}
                        >
                            <h3 className='text-black mb-1 text-lg font-semibold'>
                                {broker.name}
                            </h3>
                            <p className='text-sm text-black700 font-medium whitespace-pre-line'>
                                {broker.description}
                            </p>
                        </motion.div>
                    ))}
                </div>


            </div>
            <div className='relative max-mobile:mt-10 w-full mt-[70px] overflow-hidden'>
                <div
                    className='w-full'
                    style={{
                        maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                        WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
                    }}
                >
                    <motion.div
                        className='flex w-max py-4 max-mobile:py-0'
                        animate={{ x: [0, "-50%"] }}
                        transition={{
                            duration: 30,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        {[...BROKERS_MARQUEE, ...BROKERS_MARQUEE].map((broker, index) => (
                            <BrokerCard key={index} name={broker.name} logo={broker.logo} />
                        ))}
                    </motion.div>
                </div>
            </div>

        </div>
    )
}
