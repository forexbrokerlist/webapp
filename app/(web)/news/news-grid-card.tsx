'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'

interface NewsGridCardProps {
    category: string;
    time: string;
    title: string;
    description?: string;
    image: string;
    isLarge?: boolean;
    categoryColor?: string;
}

export default function NewsGridCard({
    category,
    time,
    title,
    description,
    image,
    isLarge = false,
    categoryColor = 'bg-[#A8DD15]'
}: NewsGridCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`relative overflow-hidden rounded-2xl group cursor-pointer ${isLarge ? 'h-[480px]' : 'h-[340px]'}`}
        >
            {/* Background Image */}
            <img
                src={image}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Content Container */}
            <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-4">
                    {/* Category Badge */}
                    <span className={`px-3 py-1 ${categoryColor} text-black font-semibold text-sm rounded-full`}>
                        {category}
                    </span>

                    {/* Time Badge */}
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md text-white text-sm font-medium rounded-full border border-white/10">
                        <Clock size={14} className="text-white" />
                        <span>{time}</span>
                    </div>
                </div>

                {/* Title */}
                <h3 className={`${isLarge ? 'text-2xl leading-[40px]' : 'text-xl leading-snug'} font-semibold text-white mb-2 group-hover:text-primary transition-colors`}>
                    {title}
                </h3>

                {/* Description - only for large cards */}
                {description && (
                    <p className="text-white/80 text-base font-medium line-clamp-2 max-w-[90%]">
                        {description}
                    </p>
                )}
            </div>
        </motion.div>
    )
}
