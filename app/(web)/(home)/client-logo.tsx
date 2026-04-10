"use client"

import React from 'react'
import { motion } from 'framer-motion'

const Elevenlabs = '/assets/images/elevenlabs.svg';
const Veo = '/assets/images/veo.svg';
const Kling = '/assets/images/kling.svg';
const Wan = '/assets/images/wan.svg';

const LOGOS = [
    { src: Elevenlabs, alt: "Elevenlabs" },
    { src: Veo, alt: "Veo" },
    { src: Kling, alt: "Kling" },
    { src: Wan, alt: "Wan" },
    { src: Elevenlabs, alt: "Elevenlabs" },
    { src: Veo, alt: "Veo" },
    { src: Kling, alt: "Kling" },
    { src: Wan, alt: "Wan" },
    { src: Elevenlabs, alt: "Elevenlabs" },
    { src: Veo, alt: "Veo" },
    { src: Kling, alt: "Kling" },
    { src: Wan, alt: "Wan" },
];

const LogoSet = () => (
    <div className="flex items-center gap-[60px] pr-[60px] shrink-0">
        {LOGOS.map((logo, idx) => (
            <img key={idx} className="block max-w-[140px] max-mobile:max-w-[100px] shrink-0" src={logo.src} alt={logo.alt} />
        ))}
    </div>
);

export default function ClientLogo() {
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
                    transition={{ ease: "linear", duration: 30, repeat: Infinity }}
                >
                    <LogoSet />
                    <LogoSet />
                </motion.div>
            </div>
        </div>
    )
}
