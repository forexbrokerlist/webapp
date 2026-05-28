"use client"
import React from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { cx } from '~/lib/utils';

interface CommonBannerProps {
    highlightedText?: string | null;
    title: string;
    description: string;
    image: string;
    className?: string;
    titleClassName?: string;
    titleClasses?: string;
    highlightedTextClassName?: string;
    highlightedTextClasses?: string;
}

export default function CommonBanner({ 
    highlightedText, 
    title, 
    description, 
    image, 
    className,
    titleClassName,
    titleClasses,
    highlightedTextClassName,
    highlightedTextClasses
}: CommonBannerProps) {
    const finalTitleClassName = titleClassName || titleClasses;
    const finalHighlightedTextClassName = highlightedTextClassName || highlightedTextClasses;
    
    // Check if the passed title classes specify a font size class
    const hasTextSize = finalTitleClassName && /\btext-(?:[a-z0-9\-]+|\[[^\]]+\])\b/.test(finalTitleClassName);

    return (
        <div className="pt-[100px]">
            {/* Note: Removed overflow-hidden here so the border-radius sides don't get clipped! */}
            <div className={cx('max-w-[1640px] px-5 max-laptop:px-16 mx-auto relative max-tab:px-5 max-mobile:px-4 py-8 max-mobile:py-0 max-mobile:mb-0 mb-10', className)}>

                {/* Main banner container */}
                <div className="relative w-full  isolate max-tab:bg-white max-tab:rounded-lg">

                    <div className="absolute max-tab:hidden inset-y-0 left-[2%] right-[2%] md:left-[1.5%] md:right-[1.5%] bg-white transform -skew-x-[7.5deg] border border-solid border-border-light500 rounded-[16px] z-[-1] overflow-hidden  pointer-events-none">

                    </div>

                    <div className='grid max-tab:pt-16 max-mobile:px-4 max-mobile:pt-10 max-tab:pb-0 max-tab:px-10 max-tab:grid-cols-1 max-mobile:gap-7 grid-cols-[1fr_408px] items-center gap-10 py-5 px-[90px]'>
                        <div className="relative z-10 w-full ">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className={cx(
                                    !hasTextSize && 'text-[50px] max-mobile:text-3xl max-mobile:leading-[40px] leading-[60px]',
                                    'mb-3 text-black100 font-bold max-w-[739px]',
                                    finalTitleClassName
                                )}>
                                <span className={cx('text-[#A8DD15]', finalHighlightedTextClassName)}> {highlightedText} </span>
                                {title}
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="text-black700 max-mobile:text-base text-lg font-normal max-w-[700px] line-clamp-3">
                                {description}
                            </motion.p>
                        </div>

                        {/* Right Graphics */}
                        <div className="relative z-10 w-full ">

                            {/* <img src={image} alt={image} /> */}
                            <motion.img
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                src={image}
                                alt={image}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

