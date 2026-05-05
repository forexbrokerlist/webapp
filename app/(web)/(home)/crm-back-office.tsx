"use client"

import { MoveRight } from "lucide-react";
import { Button } from "~/components/common/button";
import { motion } from "framer-motion";
import { Favicon } from '~/components/web/ui/favicon';
import Link from "next/link";
const BlueVec = '/assets/images/blue-vec.svg';



interface Solution {
    id: string;
    name: string;
    title: string;
    logoUrl: string;
    // socialProof: string | null;
    slug: string;
}

interface CrmBackOfficeProps {
    solutions: Solution[];
    title: string;
    description: string;
    category?: any;
}

const CARD_STYLES = [
    {
        bg: "bg-[#4C73FF]",
        border: "border-[rgba(76,115,255,0.5)]",
        shadow: "shadow-[0_12px_24px_0_rgba(76,115,255,0.25)]",
    },
    {
        bg: "bg-[#08A975]",
        border: "border-[#08A975]",
        shadow: "shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]",
    },
    {
        bg: "bg-[#FEBB36]",
        border: "border-[#FEBB36]",
        shadow: "shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]",
    },
    {
        bg: "bg-[#EC6868]",
        border: "border-[#EC6868]",
        shadow: "shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]",
    }
];
const backgroundImages = [
    {
        id: 1,
        url: "/assets/images/blue-vec.svg"

    },
    {
        id: 2,
        url: "/assets/images/GreenVec.png"
    },
    {
        id: 3,
        url: "/assets/images/YellowVec.png"
    },
    {
        id: 4,
        url: "/assets/images/PinkVec.png"
    }
]
export default function CrmBackOffice({ solutions, title, description, category }: CrmBackOfficeProps) {
    return (
        <div className='pb-100 max-mobile:pb-16'>
            <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4'>
                <div className='flex items-center max-mobile:block justify-between pb-12 max-mobile:pb-8'>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.2
                                }
                            }
                        }}

                    >
                        <motion.h2
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                            }}
                            className='text-[42px] max-mobile:text-3xl max-mobile:leading-10 leading-normal text-black100 font-bold font-monda'
                        >
                            {title}
                        </motion.h2>
                        <motion.p
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                            }}
                            className='text-lg max-mobile:text-base text-black700 font-medium max-w-[650px] whitespace-pre-line'
                        >
                            {description}
                        </motion.p>
                    </motion.div>
                    <div>
                        <Button variant='primary' size='md' className='flex items-center gap-2' asChild>
                            <Link href={`/categories/${category?.slug}`}>
                                Explore Software
                                <div>
                                    <MoveRight />
                                </div>
                            </Link>
                        </Button>
                    </div>
                </div>

                <motion.div
                    className='grid grid-cols-4 max-tab:grid-cols-2 gap-5 max-mobile:grid-cols-1 max-mobile:gap-4'
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
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
                    {solutions.map((solution, index) => {
                        const style = CARD_STYLES[index % CARD_STYLES.length];
                        return (
                            <motion.div
                                key={solution.id}
                                variants={{
                                    hidden: { opacity: 0, y: 40 },
                                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } }
                                }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className={`p-5 relative overflow-hidden rounded-[24px] max-laptop:rounded-xl max-laptop:p-4 border ${style.border} ${style.bg} ${style.shadow}`}
                            >
                                <div className="relative z-10">
                                    <div className='flex items-center gap-5 pb-12 max-laptop:pb-6'>
                                        <div className='w-[70px] max-laptop:w-14 max-laptop:h-14 h-[70px] shrink-0 drop-shadow-[0_0_11.575px_rgba(0,0,0,0.05)] rounded-full flex items-center justify-center bg-white overflow-hidden'>
                                            <Favicon src={solution.logoUrl} title={solution.name} size={30} contained className="max-w-12" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`text-2xl max-laptop:text-xl font-bold font-monda text-white truncate`}>
                                                {solution.name}
                                            </h3>
                                            <p className={`text-sm font-medium text-white800 line-clamp-2`}>
                                                {solution.title}
                                            </p>
                                        </div>
                                    </div>

                                    <Button variant='primary' size='md' className={` border-none py-2.5 bg-white text-black100  flex justify-between items-center group `} asChild>
                                        <Link href={`/${category?.slug || 'forex-crm-providers'}/${solution.slug}`}>
                                            Explore Software
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 bg-black100 `}>
                                                <MoveRight className="text-white w-4 h-4" />
                                            </div>
                                        </Link>
                                    </Button>
                                </div>

                                <div className="absolute bottom-[-20px] right-0">
                                    <img src={backgroundImages[index % backgroundImages.length].url} alt={`bg-vec-${index}`} className="block max-w-[100px]" />
                                </div>
                            </motion.div>
                        )
                    })}
                </motion.div>
            </div>
        </div>
    )
}
