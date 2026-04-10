"use client"

import { MoveRight } from "lucide-react";
import { Button } from "~/components/common/button";
import { motion } from "framer-motion";

const Fynxt = '/assets/images/fynxt.svg'

const CARD_STYLES = [
    {
        bg: "bg-[#4C73FF]",
        border: "border-[rgba(76,115,255,0.5)]",
        shadow: "shadow-[0_12px_24px_0_rgba(76,115,255,0.25)]",
    },
    {
        bg: "bg-[#08A975]",
        border: "border-[rgba(18, 18, 18, 0.08)]",
        shadow: "shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]",

    },
    {
        bg: "bg-[#FEBB36]",
        border: "border-[rgba(18, 18, 18, 0.08)]",
        shadow: "shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]",

    },
    {
        bg: "bg-[#EC6868]",
        border: "border-[rgba(18, 18, 18, 0.08)]",
        shadow: "shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]",


    }
];

export default function CrmBackOffice() {
    return (
        <div className='pb-100 max-mobile:pb-16'>
            <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4'>
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
                    className='pb-12 max-mobile:pb-8'
                >
                    <motion.h2
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                        }}
                        className='text-[42px] max-mobile:text-3xl max-mobile:leading-10 leading-normal text-black100 font-bold font-monda'
                    >
                        CRM and Back Office Software
                    </motion.h2>
                    <motion.p
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                        }}
                        className='text-lg max-mobile:text-base text-black700 font-medium max-w-[650px]'
                    >
                        Our platform is supported by incredible partners and sponsors who make it possible for our team to maintain this directory.
                    </motion.p>
                </motion.div>

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
                    {CARD_STYLES.map((card, index) => (
                        <motion.div
                            key={index}
                            variants={{
                                hidden: { opacity: 0, y: 40 },
                                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } }
                            }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className={`p-5 rounded-[24px] max-laptop:rounded-xl max-laptop:p-4 border ${card.border} ${card.bg} ${card.shadow}`}
                        >
                            <div className='flex items-center gap-5 pb-12 max-laptop:pb-6'>
                                <div className='w-[70px] max-laptop:w-14 max-laptop:h-14 h-[70px] shrink-0 drop-shadow-[0_0_11.575px_rgba(0,0,0,0.05)] rounded-full flex items-center justify-center bg-white'>
                                    <img src={Fynxt} alt="Fynxt" />
                                </div>
                                <div>
                                    <h3 className={`text-2xl max-laptop:text-xl font-bold font-monda text-white`}>
                                        FYNXT
                                    </h3>
                                    <p className={`text-sm font-medium text-white800`}>
                                        Global Exchange & Liquidity Provider
                                    </p>
                                </div>
                            </div>
                            <Button variant='primary' size='md' className={` border-none py-2.5 bg-white text-black100  flex justify-between items-center group`}>
                                Explore Broker
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 bg-black100 `}>
                                    <MoveRight className="text-white" />
                                </div>
                            </Button>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}
