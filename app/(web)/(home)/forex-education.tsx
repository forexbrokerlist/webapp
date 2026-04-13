"use client"
import { MoveRight, ChevronLeft, ChevronRight, Star, Users } from 'lucide-react'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '~/components/common/button'
import { ButtonGroup } from '~/components/common/button-group'
import { Link } from '~/components/common/link'
const GolldenBullsImage = '/assets/images/gollden.png';

interface Partner {
    id: string;
    name: string;
    title: string;
    subtitle: string | null;
    description: string | null;
    logoUrl: string;
    highlightedPoint: string | null;
    bannerUrl: string | null;
    websiteUrl: string | null;
    socialProof: string | null;
}

export default function ForexEducation({ partners = [] }: { partners?: Partner[] }) {
    console.log("partners", partners)
    const SLIDES = partners.map(p => ({
        id: p.id,
        title: p.name,
        sub: p.title || 'Advanced Trading Academy',
        tag: p.subtitle || 'Prop Level Training',
        rev: p.socialProof || '12k+ Students',
        stud: p.highlightedPoint,
        img: p.bannerUrl || GolldenBullsImage,
        logo: p.logoUrl,
        link: p.websiteUrl || `/forex-education-and-training/${p.id}`
    }));

    const [activeIndex, setActiveIndex] = useState(0);

    if (SLIDES.length === 0) {
        return null;
    }

    const next = () => setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    const prev = () => setActiveIndex((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));

    return (
        <section className='bg-black100 py-[50px] max-mobile:py-16 overflow-hidden'>
            <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4'>
                <div className='flex items-center max-tab:block justify-between max-laptop:gap-10 gap-[160px]'>
                    <motion.div
                        className='max-w-[733px] max-tab:max-w-full max-laptop:max-w-[550px] shrink-0'
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
                        }}
                    >
                        <motion.h2
                            className='text-[42px] max-mobile:text-3xl max-mobile:leading-10 leading-normal text-white font-bold font-monda mb-2'
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                            }}
                        >
                            Learn Forex Trading - Top Education Platforms & Courses
                        </motion.h2>
                        <motion.p
                            className='text-lg max-mobile:text-base text-white700 font-medium'
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                            }}
                        >
                            The forex market rewards those who invest in their knowledge first. Our directory features hand-picked forex education platforms and trading academies trusted by thousands of active traders worldwide.
                        </motion.p>
                        <motion.p
                            className='text-lg text-white700 font-medium mt-2'
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                            }}
                        >
                            Compare course formats, student reviews, pricing, and specializations, whether you prefer self-paced online learning, live mentorship, or structured trading programs. Start with confidence, backed by verified reviews and transparent listings.

                        </motion.p>
                        <motion.div
                            className='pt-12'
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                            }}
                        >
                            <Button variant='primary' size='md' className='border-none py-2.5 px-6 rounded-full bg-white text-black100' onClick={() => window.location.href = '/forex-education-and-training'}>
                                Start Learning
                                <div>
                                    <MoveRight className='text-black100' />
                                </div>
                            </Button>
                        </motion.div>
                    </motion.div>
                    <motion.div
                        className='w-full relative h-[550px] max-mobile:h-[450px] max-tab:max-w-full flex items-center justify-center overflow-hidden max-w-[calc(100%-650px)] max-laptop:max-w-[calc(100%-550px)]'
                        initial={{ opacity: 0, scale: 0.95, x: 40 }}
                        whileInView={{ opacity: 1, scale: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.2 }}
                    >
                        <div className='relative w-full h-full flex items-center justify-center'>
                            {SLIDES.map((slide, idx) => {
                                let diff = idx - activeIndex;
                                if (diff > 2) diff -= 5;
                                if (diff < -2) diff += 5;

                                const isCenter = diff === 0;
                                const xOffset = diff * 240;
                                const scale = 1 - Math.abs(diff) * 0.15;
                                const opacity = isCenter ? 1 : Math.max(1 - Math.abs(diff) * 0.4, 0);
                                const zIndex = 10 - Math.abs(diff);

                                return (
                                    <motion.div
                                        key={slide.id}
                                        initial={false}
                                        animate={{
                                            x: `calc(-50% + ${xOffset}px)`,
                                            scale: scale,
                                            opacity: opacity,
                                            zIndex: zIndex
                                        }}
                                        transition={{ type: "spring", stiffness: 260, damping: 22 }}
                                        className="absolute left-[50%] top-[30px] w-[380px] max-mobile:w-[280px] rounded-[16px] max-mobile:rounded-lg bg-[#515151] shadow-[0_0_78px_0_rgba(26,26,26,0.5),inset_0_0_8.3px_0_rgba(0,0,0,0.25)] max-mobile:p-2 p-3 flex flex-col"
                                    >
                                        <div className='mb-2'>
                                            <img className='block rounded-t-2xl w-full h-[200px] object-cover' src={slide.img} alt={slide.title} />
                                        </div>

                                        <div className=' relative z-20 rounded-[14.774px] bg-[#1A1A1A] shadow-[0_0_27.887px_0_rgba(0,0,0,0.1)] p-4'>
                                            {slide.logo && (
                                                <div className="absolute -top-[42px] right-4 w-[84px] h-[84px] rounded-full bg-white shadow-[0_0_30px_rgba(255,215,0,0.25)] z-30 flex items-center justify-center p-1.5 border-[3px] border-[rgba(255,255,255,0.1)]">
                                                    <img src={slide.logo} className="w-full h-full object-contain rounded-full" alt={`${slide.title} Logo`} />
                                                </div>
                                            )}
                                            <div className='inline-flex max-mobile:text-xs items-center px-2 py-1  text-xs font-semibold text-white700 bg-[rgba(255,255,255,0.1)] rounded-full w-fit mb-1 border border-[rgba(255,255,255,0.05)]'>
                                                {slide.tag}
                                            </div>
                                            <h3 className='text-[22px] max-mobile:text-base max-mobile:mb-0 font-semibold font-monda text-white mb-1 tracking-[-0.222px]'>{slide.title}</h3>
                                            <p className='text-xs max-mobile:text-xs text-white700 font-medium mb-4 flex-1'>
                                                {slide.sub}
                                            </p>

                                            <div className='flex gap-3 mb-4'>
                                                <div className='flex-1 rounded-full max-mobile:px-1 max-mobile:justify-center  border-[0.923px] border-[rgba(255,255,255,0.12)] border-solid py-1.5 px-3 flex items-center  gap-2'>
                                                    <Star className='w-[14px] max-mobile:hidden h-[14px] text-yellow-500 fill-current' />
                                                    <span className=' text-xs font-medium tracking-wide text-white700'>{slide.rev}</span>
                                                </div>
                                                <div className='flex-1 rounded-full max-mobile:px-1 max-mobile:justify-center  border-[0.923px] border-[rgba(255,255,255,0.12)] border-solid py-1.5 px-3 flex items-center  gap-2'>
                                                    <Users className='w-[14px] max-mobile:hidden h-[14px] text-gray-400 fill-current' />
                                                    <span className='text-white700 text-xs font-medium tracking-wide'>{slide.stud}</span>
                                                </div>
                                            </div>

                                            <Button variant='primary' size='md' className={` border-none w-full justify-center text-sm py-2 bg-white text-black100  flex  items-center group`} onClick={() => window.location.href = slide.link}>
                                                Start Learning
                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 bg-black100 `}>
                                                    <MoveRight className="text-white w-4 h-4" />
                                                </div>
                                            </Button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Navigation Arrows */}
                        <div className='absolute left-0 z-30 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#3F3F3F] border border-[rgba(255,255,255,0.2)] flex items-center justify-center cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors' onClick={prev}>
                            <ChevronLeft className='text-white w-5 h-5' />
                        </div>
                        <div className='absolute right-0 z-30 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#3F3F3F] border border-[rgba(255,255,255,0.2)] flex items-center justify-center cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors' onClick={next}>
                            <ChevronRight className='text-white w-5 h-5' />
                        </div>

                        {/* Pagination Dots */}
                        <div className='absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30'>
                            {SLIDES.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveIndex(i)}
                                    className={`h-[6px] rounded-full transition-all duration-300 ${i === activeIndex ? 'w-5 bg-white' : 'w-[6px] bg-[rgba(255,255,255,0.3)] hover:bg-[rgba(255,255,255,0.5)]'}`}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
