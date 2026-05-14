import React from 'react'
import { Clock } from 'lucide-react'

interface NewsUpdateCardProps {
    category: string;
    time: string;
    title: string;
    description: string;
}

export default function NewsUpdateCard({ category, time, title, description }: NewsUpdateCardProps) {
    return (
        <div className="rounded-lg bg-[rgba(18,18,18,0.02)] p-4">
            <div className="flex items-center gap-2 mb-2">
                {/* Category Badge */}
                <span className="px-2 py-0.5 bg-[rgba(168,221,21,0.20)] text-black100 text-sm font-semibold rounded-full border border-[#A8DD15]">
                    {category}
                </span>

                {/* Time Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1 bg-[rgba(26,26,26,0.06)] text-black100 text-sm font-medium border border-[rgba(26,26,26,0.08)] rounded-full">
                    <Clock size={14} className="text-black700" />
                    <span>{time}</span>
                </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-black100 mb-1 leading-snug hover:text-primary cursor-pointer transition-colors">
                {title}
            </h3>

            {/* Description */}
            <p className="text-base leading-relaxed font-medium text-black700 line-clamp-2">
                {description}
            </p>
        </div>
    )
}
