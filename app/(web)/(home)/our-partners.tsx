'use client';
import React from 'react'
import { motion } from 'framer-motion';
import { MoveRight } from 'lucide-react';
import { Button } from '~/components/common/button';
const UniPayment = '/assets/images/uni-payment.svg';
const Lmax = '/assets/images/lmax.svg';
const Trader = '/assets/images/cTrader.svg';
export default function OurPartners() {
    return (
        <div className='pt-100 overflow-hidden max-mobile:pt-16'>
            <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4'>
                <motion.div
                    className='pb-12 max-mobile:pb-8'
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <h2 className='text-[42px] max-mobile:text-3xl max-mobile:leading-10 text-center leading-normal text-black100 font-bold font-monda'>
                        Our Partners
                    </h2>
                    <p className='text-lg max-mobile:text-base
                     text-black700 text-center mx-auto font-medium max-w-[650px]'>
                        We are supported bt innovative partners and sponsors who make it possible for our team to maintain this directory.
                    </p>
                </motion.div>
                <div className='grid grid-cols-2 gap-5 max-tab:grid-cols-1'>
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className='rounded-[20px] max-mobile:rounded-xl max-mobile:p-4 border border-[rgba(26,26,26,0.08)] bg-white p-6'
                        >
                            <div className='flex items-center justify-between pb-6 max-mobile:block'>
                                <div>
                                    <h3 className='text-3xl max-mobile:text-2xl max-mobile:leading-8 text-black100 font-bold  mb-2'>
                                        Liquidity Partners
                                    </h3>
                                    <p className='text-base font-medium text-black700  max-w-[480px] '>
                                        Providing deep liquidity and institutional-grade execution for brokers and financial institutions.
                                    </p>
                                </div>
                                <div className='max-mobile:pt-4'>
                                    <Button variant='primary' size='md' className='flex items-center gap-2'>
                                        View More
                                        <div>
                                            <MoveRight />
                                        </div>
                                    </Button>
                                </div>
                            </div>
                            <motion.div
                                className='grid grid-cols-2 gap-3 max-mobile:grid-cols-1'
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.1 }}
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: { staggerChildren: 0.15, delayChildren: 0.2 }
                                    }
                                }}
                            >
                                {
                                    [...Array(2)].map((_, index) => {
                                        return (
                                            <motion.div
                                                key={index}
                                                variants={{
                                                    hidden: { opacity: 0, y: 20 },
                                                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                                                }}
                                                whileHover={{ y: -8 }}
                                                className='rounded-xl bg-[#F4F4F4] p-2'
                                            >
                                                <div className='p-2.5 rounded-xl border border-[rgba(26,26,26,0.14)] bg-white'>
                                                    <div className='grid grid-cols-[80px_1fr] items-center gap-3 pb-4 border-b border-solid border-border-gray800'>
                                                        <div className='h-[54px] w-full bg-[#F4F4F4] rounded-lg flex items-center justify-center'>
                                                            <img src={Lmax} alt="Lmax" className='block max-w-[54px]' />
                                                        </div>
                                                        <div>
                                                            <h3 className='text-base text-black font-semibold'>
                                                                Lmax Group
                                                            </h3>
                                                            <p className='text-xs text-black700 font-medium'>
                                                                Global Exchange & Liquidity Provider
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className='pt-4'>
                                                        <p className="text-xs text-black700">
                                                            Provides institutional grade liquidity and direct market access for brokers and financial institutions.
                                                        </p>
                                                    </div>
                                                    <div className='pt-3'>
                                                        <Button size="md" variant="primary" className="px-5 gap-2.5 py-1.5 w-full justify-center text-xs group">
                                                            Learn More
                                                            <div className="w-4 h-4 rounded-full flex items-center group-hover:bg-white transition-all duration-300 justify-center bg-primary">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                                                                    <path d="M6.12793 2.51855L8.70573 5.09636L6.12793 7.67416" stroke="#1A1A1A" strokeWidth="0.637019" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                                                    <path d="M1.48633 5.0957H8.63368" stroke="#1A1A1A" strokeWidth="0.637019" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            </div>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )
                                    })
                                }
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                            className='rounded-[20px] mt-5 border border-[rgba(26,26,26,0.08)] bg-white '
                        >
                            <div className='flex items-center justify-between p-6'>
                                <div>
                                    <h3 className='text-3xl text-black100 font-bold  mb-2'>
                                        Trading Platform Partners
                                    </h3>
                                    <p className='text-base font-medium text-black700  max-w-[480px] '>
                                        Connect with trusted trading platforms and automate your strategies with powerful tools
                                    </p>
                                </div>
                                <div>
                                    <Button variant='primary' size='md' className='flex items-center gap-2'>
                                        View More
                                        <div>
                                            <MoveRight />
                                        </div>
                                    </Button>
                                </div>
                            </div>
                            <motion.div
                                className='px-[50px] max-laptop:px-5'
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.1 }}
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: { staggerChildren: 0.05, delayChildren: 0.3 }
                                    }
                                }}
                            >
                                <div className="grid grid-cols-5 gap-4">
                                    {
                                        [...Array(10)].map((_, index) => {
                                            return (
                                                <motion.div
                                                    key={index}
                                                    variants={{
                                                        hidden: { opacity: 0, scale: 0.8 },
                                                        visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
                                                    }}
                                                    whileHover={{ y: -5, scale: 1.05 }}
                                                    className="px-5 py-4 rounded-[12px] border border-[rgba(26,26,26,0.16)] bg-[rgba(255,255,255,0.1)] backdrop-blur-[87.7px] shadow-sm"
                                                >
                                                    <div className='flex justify-center'>
                                                        <img className='block max-w-[50px] max-laptop:max-w-[40px]' src={Trader} alt="Trader" />
                                                    </div>
                                                    <p className='mt-3 text-base max-laptop:mt-2 text-black700 text-center font-medium'>
                                                        cTrader
                                                    </p>
                                                </motion.div>
                                            )
                                        })
                                    }
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1], delay: 0.3 }}
                        className='rounded-[20px] border max-mobile:rounded-xl max-mobile:p-4 border-[rgba(26,26,26,0.08)] bg-white overflow-hidden flex flex-col'
                    >
                        <div className='p-10 pb-6 max-mobile:p-4'>
                            <h3 className='text-3xl max-mobile:text-2xl max-mobile:leading-8 text-black100 font-bold text-center mb-1'>
                                PSP Partners
                            </h3>
                            <p className='text-base font-medium text-black700 text-center max-w-[511px] mx-auto'>
                                Our platform is supported by incredible partners and sponsors who make it possible for our team to
                                maintain this directory.
                            </p>
                        </div>
                        <motion.div
                            className='flex-1 flex flex-col'
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.6 }}
                        >
                            <div className='flex w-full overflow-hidden pb-4'>
                                <motion.div
                                    className='flex w-max items-center'
                                    animate={{ x: ['0%', '-50%'] }}
                                    transition={{ repeat: Infinity, ease: 'linear', duration: 15 }}
                                >
                                    <div className='flex gap-3 pr-3'>
                                        {
                                            [...Array(5)].map((_, index) => {
                                                return (
                                                    <div key={`first-${index}`} className='rounded-[13px] bg-[rgba(26,26,26,0.03)] p-2 max-w-[300px] max-mobile:max-w-[200px] max-mobile:w-[200px] max-mobile:min-w-[200px] w-[300px] min-w-[300px] backdrop-blur-[239.8px]'>
                                                        <div className='rounded-[11.413px] border-[0.951px] border-[rgba(26,26,26,0.08)] h-[90px] max-mobile:h-[60px] flex items-center justify-center bg-white'>
                                                            <img src={UniPayment} alt="UniPayment" className='block max-w-[160px] max-mobile:max-w-[100px]' />
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </motion.div>
                            </div>
                            <div className='flex w-full overflow-hidden pb-4'>
                                <motion.div
                                    className='flex w-max items-center'
                                    animate={{ x: ['-50%', '0%'] }}
                                    transition={{ repeat: Infinity, ease: 'linear', duration: 20 }}
                                >
                                    <div className='flex gap-3 pr-3'>
                                        {
                                            [...Array(5)].map((_, index) => {
                                                return (
                                                    <div key={`second-${index}`} className='rounded-[13px] bg-[rgba(26,26,26,0.03)] p-2 max-w-[300px] max-mobile:max-w-[200px] max-mobile:w-[200px] max-mobile:min-w-[200px] w-[300px] min-w-[300px] backdrop-blur-[239.8px]'>
                                                        <div className='rounded-[11.413px] border-[0.951px] border-[rgba(26,26,26,0.08)] h-[90px] max-mobile:h-[60px] flex items-center justify-center bg-white'>
                                                            <img src={UniPayment} alt="UniPayment" className='block max-w-[160px] max-mobile:max-w-[100px]' />
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>

                                </motion.div>
                            </div>
                            <div className='flex w-full max-mobile:hidden overflow-hidden pb-4'>
                                <motion.div
                                    className='flex w-max items-center'
                                    animate={{ x: ['0%', '-50%'] }}
                                    transition={{ repeat: Infinity, ease: 'linear', duration: 25 }}
                                >
                                    <div className='flex gap-3 pr-3'>
                                        {
                                            [...Array(5)].map((_, index) => {
                                                return (
                                                    <div key={`third-${index}`} className='rounded-[13px] bg-[rgba(26,26,26,0.03)] p-2 max-w-[300px] w-[300px] min-w-[300px] backdrop-blur-[239.8px]'>
                                                        <div className='rounded-[11.413px] border-[0.951px] border-[rgba(26,26,26,0.08)] h-[90px] flex items-center justify-center bg-white'>
                                                            <img src={UniPayment} alt="UniPayment" className='block max-w-[160px]' />
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </motion.div>
                            </div>
                            <div className='flex w-full max-mobile:hidden overflow-hidden pb-4'>
                                <motion.div
                                    className='flex w-max items-center'
                                    animate={{ x: ['-50%', '0%'] }}
                                    transition={{ repeat: Infinity, ease: 'linear', duration: 20 }}
                                >
                                    <div className='flex gap-3 pr-3'>
                                        {
                                            [...Array(5)].map((_, index) => {
                                                return (
                                                    <div key={`fourth-${index}`} className='rounded-[13px] bg-[rgba(26,26,26,0.03)] p-2 max-w-[300px] w-[300px] min-w-[300px] backdrop-blur-[239.8px]'>
                                                        <div className='rounded-[11.413px] border-[0.951px] border-[rgba(26,26,26,0.08)] h-[90px] flex items-center justify-center bg-white'>
                                                            <img src={UniPayment} alt="UniPayment" className='block max-w-[160px]' />
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>

                                </motion.div>
                            </div>
                        </motion.div>
                        <div className='flex justify-center pt-5 max-mobile:pb-4 pb-10 mt-auto'>
                            <Button variant='primary' size='md' className='flex items-center gap-2'>
                                View More
                                <div>
                                    <MoveRight />
                                </div>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
