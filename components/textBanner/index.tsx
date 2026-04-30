"use client"
import React from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface CommonBannerProps {
    highlightedText?: string | null;
    title: string;
    description: string;
    image: string;
}

export default function TextBanner({ highlightedText, title, description, image }: CommonBannerProps) {
    return (
        <div className="pt-100">
            {/* Note: Removed overflow-hidden here so the border-radius sides don't get clipped! */}
            <div className='max-w-[1640px] px-5 max-laptop:px-16 mx-auto relative max-tab:px-5 max-mobile:px-4 py-8 max-mobile:py-0 max-mobile:mb-0 mb-10'>

                {/* Main banner container */}
                <div className="relative w-full max-mobile:pb-10 isolate max-tab:bg-white max-tab:rounded-lg">

                    <div className="absolute max-tab:hidden inset-y-0 left-[2%] right-[2%] md:left-[1.5%] md:right-[1.5%] bg-white transform -skew-x-[7.5deg] border border-solid border-border-light500 rounded-[16px] z-[-1] overflow-hidden  pointer-events-none">

                    </div>

                    <div className='grid max-tab:pt-16 max-mobile:px-4 max-mobile:pt-10 max-tab:pb-0 max-tab:px-10  gap-10 py-20 px-[90px]'>
                        <div className="relative z-10 w-full ">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className='text-[50px] max-mobile:text-3xl text-center max-mobile:leading-[40px] mb-3 text-black100 font-bold leading-[60px] mx-auto max-w-[739px]'>
                                {title}
                                <span className='text-[#A8DD15]'> {highlightedText} </span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="text-black700 text-center mx-auto max-mobile:text-base text-lg font-normal max-w-[700px] line-clamp-3">
                                {description}
                            </motion.p>
                        </div>


                    </div>

                </div>
            </div>
        </div>
    )
}

