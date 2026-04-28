"use client"
import { MoveRight } from 'lucide-react'
import React from 'react'
import { Button } from '~/components/common/button';
import { motion } from 'framer-motion';

const SerchIcon = '/assets/images/search-white.svg';
const AccuracyIcon = '/assets/images/Accuracy.svg';
const CommunityIcon = '/assets/images/Community.svg';
const AccessibilityIcon = '/assets/images/Accessibility.svg';

const missionData = [
    {
        id: 1,
        title: "Transparency",
        desc: "Clearly distinguishing between sponsored listings and organic results",
        icon: SerchIcon,
        glowColor: "rgba(76,115,255,0.5)"
    },
    {
        id: 2,
        title: "Accuracy",
        desc: "Regularly updating broker data including spreads, regulations, platforms, and minimum deposits",
        icon: AccuracyIcon,
        glowColor: "rgba(254,187,54,0.5)"
    },
    {
        id: 3,
        title: "Community",
        desc: "Built by traders, for traders. Real reviews from real people who trade real money.",
        icon: CommunityIcon,
        glowColor: "rgba(8,169,117,0.5)"
    },
    {
        id: 4,
        title: "Accessibility",
        desc: "Making professional-grade broker research available to everyone, for free",
        icon: AccessibilityIcon,
        glowColor: "rgba(236,104,104,0.5)"
    }
];

export default function OurMission() {
    return (
        <section className='py-100 overflow-hidden max-mobile:py-16'>
            <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4'>
                <div className='pb-[60px] max-mobile:pb-10 text-center'>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className='text-[42px]  max-mobile:text-3xl max-mobile:leading-10 leading-normal text-black100 font-bold mb-4'
                    >
                        Our Mission
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className='text-lg max-mobile:text-base text-black700 font-medium max-w-[888px] mx-auto whitespace-pre-line'
                    >
                        Our mission is simple: to empower traders with clarity. We believe that every trader whether a beginner or a seasoned professional deserves access to accurate, unbiased, and comprehensive data about the brokers they choose to trust with their capital.
                    </motion.p>
                </div>

                <div className='grid grid-cols-4 max-tab:grid-cols-2 gap-5 max-mobile:grid-cols-1 max-mobile:gap-4'>
                    {missionData.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -8 }}
                            className='bg-white border border-solid border-border-light300 max-mobile:p-5 rounded-xl p-8 relative overflow-hidden group transition-all duration-300 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:border-primary/20'
                        >
                            {/* Animated Glow Background */}
                            <div
                                className='absolute -top-6 -right-6 w-24 h-24 blur-[40px] transition-all duration-500 group-hover:scale-150 group-hover:opacity-60 rounded-full -z-0'
                                style={{ backgroundColor: item.glowColor }}
                            />

                            <div className='relative z-10 justify-between h-full flex flex-col'>
                                <div className='flex-1'>
                                    <div className='mb-5 flex justify-between items-start'>
                                        <h3 className='text-2xl text-black font-bold group-hover:text-primary transition-colors'>
                                            {item.title}
                                        </h3>
                                        <motion.img
                                            whileHover={{ rotate: 15, scale: 1.1 }}
                                            className='block'
                                            src={item.icon}
                                            alt={item.title}
                                        />
                                    </div>

                                    <p className='text-base font-medium text-black700 mb-5 leading-relaxed'>
                                        {item.desc}
                                    </p>
                                </div>

                                <div>
                                    <Button variant='primary' className='group/btn'>
                                        View Item
                                        <div className='flex items-center gap-2 py-0 transition-transform duration-300 group-hover/btn:translate-x-1'>
                                            <MoveRight className='w-4 h-4' />
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
