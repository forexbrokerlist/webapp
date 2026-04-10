"use client"
import { Calendar, MoveRight } from 'lucide-react'
import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '~/components/common/button';
const BlogCardImage = '/assets/images/blog-card.png';

export default function BlogSection() {
    return (
        <div>
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
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                            }}
                        >
                            Blog
                        </motion.h2>
                        <motion.p
                            className='text-lg max-mobile:text-base text-black700 font-medium max-w-[650px]'
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                            }}
                        >
                            A collection of useful articles for developers and software enthusiasts. Learn about the latest trends and technologies in the community.
                        </motion.p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
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
                <motion.div
                    className='grid grid-cols-3 max-tab:grid-cols-2 gap-6 max-mobile:gap-4 max-mobile:grid-cols-1'
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.15
                            }
                        }
                    }}
                >
                    {
                        [...Array(3)].map((_, index) => (
                            <motion.div
                                key={index}
                                variants={{
                                    hidden: { opacity: 0, y: 40 },
                                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } }
                                }}
                                whileHover={{ y: -10, scale: 1.02 }}
                                className='p-3.5 border border-[rgba(0,0,0,0.1)] bg-white shadow-[0_0_22.7px_0_rgba(0,0,0,0.09)] rounded-2xl cursor-pointer'
                            >
                                <div className='overflow-hidden rounded-xl'>
                                    <motion.img
                                        src={BlogCardImage}
                                        alt="BlogCardImage"
                                        className='block w-full'
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                                <div className='pt-5 max-mobile:pt-3'>
                                    <div className='flex items-center justify-between pb-3'>
                                        <button className='text-base max-mobile:text-sm font-semibold text-black800 py-1.5 px-3 bg-[#F0F1EC] rounded-md transition-colors hover:bg-primary'>
                                            Business Growth
                                        </button>
                                        <div className='flex items-center gap-2'>
                                            <Calendar className='text-black700' size={18} />
                                            <p className='text-base max-mobile:text-sm font-medium text-black700'>
                                                Oct 30,2025
                                            </p>
                                        </div>
                                    </div>
                                    <h2 className='text-xl max-mobile:text-lg text-black200 font-semibold mb-1 transition-colors hover:text-primary'>
                                        How to choose the best forex broker in 2026
                                    </h2>
                                    <p className='text-base font-medium text-black700 line-clamp-2'>
                                        Choosing the right forex broker is one of the most important decisions a trader can make. With hundreds of brokers available online, each offering
                                        different spreads, platforms, and leverage options, finding the right one can be challenging.
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    }
                </motion.div>
            </div>
        </div>
    )
}
