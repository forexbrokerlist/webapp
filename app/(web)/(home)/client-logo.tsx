"use client"

import React from 'react'
import { motion } from 'framer-motion'

interface Logo {
    src: string;
    alt: string;
}

interface ClientLogoProps {
    logos: Logo[];
}

const LogoSet = ({ logos }: { logos: Logo[] }) => (
    <div className="flex items-center gap-[60px] pr-[60px] shrink-0">
        {logos.map((logo, idx) => (
            <img key={idx} className="block max-w-[140px] max-mobile:max-w-[100px] shrink-0 object-contain h-[40px]" src={logo.src} alt={logo.alt} />
        ))}
    </div>
);

export default function ClientLogo({ logos }: ClientLogoProps) {
    const duplicatedLogos = [...logos, ...logos, ...logos, ...logos];

    return (
        <div className="bg-black100 py-[30px] max-mobile:py-5 max-tab:py-6 overflow-hidden">
            {/* The mask-image creates the left and right fade out effect */}
            <div
                className="w-full"
                style={{
                    maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
                }}
            >
                <motion.div
                    className="flex w-max"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ ease: "linear", duration: 120, repeat: Infinity }}
                >
                    <LogoSet logos={duplicatedLogos} />
                    <LogoSet logos={duplicatedLogos} />
                </motion.div>
            </div>
        </div>
    )
}
