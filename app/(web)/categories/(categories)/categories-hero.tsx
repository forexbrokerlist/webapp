'use client'

import React from 'react'
import { motion, Variants } from 'framer-motion'

const BullImage = '/assets/images/bull.png'

export default function CategoriesHero() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
            },
        },
    }

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.7,
                ease: [0.25, 0.1, 0.25, 1],
            },
        },
    }

    const imageVariants: Variants = {
        hidden: { opacity: 0, x: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.4,
            },
        },
    }

    return (
        <div className='pt-[120px] bg-[#EAEEE6] overflow-hidden'>
            <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4'>
                <motion.div
                    className='grid grid-cols-[1fr_437px] items-center gap-10 max-tab:grid-cols-1 max-tab:gap-8 '
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true }}
                    variants={containerVariants}
                >
                    <div>
                        <motion.h2
                            className='text-[42px] leading-normal text-black100 font-bold max-mobile:text-[32px]'
                            variants={itemVariants}
                        >
                            Browse Categories
                        </motion.h2>
                        <motion.p
                            className='text-lg text-black700 max-w-[709px] mt-4 max-mobile:text-base'
                            variants={itemVariants}
                        >
                            Explore our comprehensive directory of forex brokers and trading services across
                            multiple categories.
                        </motion.p>
                    </div>
                    <motion.div
                        className='flex justify-end max-tab:justify-center'
                        variants={imageVariants}
                    >
                        <img
                            src={BullImage}
                            alt='Premium Trading Bull'
                            className='block w-full h-auto max-w-[437px] object-contain drop-shadow-2xl'
                        />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}

