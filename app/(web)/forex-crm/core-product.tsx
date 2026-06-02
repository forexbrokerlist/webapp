'use client'
import React from 'react'
import { motion, Variants } from 'framer-motion';

const CrmPrimary = '/assets/images/crm-fill.svg';
const CrmOutline = '/assets/images/crm-outline.svg';

export default function CoreProduct() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    const cardHoverVariants: Variants = {
        hover: {
            y: -10,
            scale: 1.02,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            transition: { duration: 0.3, ease: "easeInOut" }
        }
    };

    const productCards = [
        {
            title: "Forex Broker CRM",
            description: "Complete CRM solution tailored for forex brokers to manage clients efficiently.",
            icon: CrmPrimary,
            bgColor: "bg-[#F4F4F4]",
            borderColor: "border-[rgba(26,26,26,0.10)]"
        },
        {
            title: "Forex Prop Firm CRM",
            description: "Powerful CRM designed for proprietary trading firms and funded trader programs.",
            icon: CrmOutline,
            bgColor: "bg-primary",
            borderColor: "border-[rgba(255,255,255,0.10)]"
        },
        {
            title: "Copy Trading",
            description: "Enable Clients to copy expert traders strategies and grow their portfolios.",
            icon: CrmPrimary,
            bgColor: "bg-[#F4F4F4]",
            borderColor: "border-[rgba(26,26,26,0.10)]"
        },
        {
            title: "MAM/PAMM Social Trading",
            description: "Multi account management and social trading solutions for fund managers.",
            icon: CrmOutline,
            bgColor: "bg-primary",
            borderColor: "border-[rgba(255,255,255,0.10)]"
        }
    ];

    return (
        <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-0 '>
            <div className="bg-[url('/assets/images/light-banner.png')] max-mobile:px-4 max-tab:rounded-none bg-no-repeat p-[80px] max-laptop:py-16 max-laptop:px-8 bg-cover border border-solid border-primary rounded-3xl overflow-hidden">
                <motion.div
                    className='pb-[60px] max-mobile:pb-10'
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                >
                    <motion.div variants={itemVariants} className='flex justify-center pb-3'>
                        <button className='bg-white border-none rounded-full py-2 px-4 text-base font-medium text-black700 shadow-sm'>
                            Core Products
                        </button>
                    </motion.div>
                    <motion.h2 variants={itemVariants} className='text-[42px] max-mobile:text-3xl leading-normal text-black100 font-bold text-center'>
                        Products Tailored For Forex Success
                    </motion.h2>
                    <motion.p variants={itemVariants} className='text-lg max-mobile:text-base text-black700 font-medium max-w-[590px] whitespace-pre-line mx-auto text-center'>
                        Explore our comprehensive suite of forex products designed to elevate your trading experience.
                    </motion.p>
                </motion.div>

                <motion.div
                    className='grid grid-cols-4 max-tab:grid-cols-2 max-mobile:grid-cols-1 gap-5'
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                >
                    {productCards.map((card, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover="hover"
                            animate="initial"
                        >
                            <motion.div
                                variants={cardHoverVariants}
                                className={`h-full rounded-xl p-5 border shadow-[0_0_20.8px_0_rgba(0,0,0,0.04)] cursor-pointer ${card.bgColor} ${card.borderColor}`}
                            >
                                <motion.img
                                    src={card.icon}
                                    alt={card.title}
                                    className='block'
                                    whileHover={{ rotate: 5, scale: 1.1 }}
                                />
                                <h3 className='mt-7 mb-3 text-xl font-semibold text-black100'>
                                    {card.title}
                                </h3>
                                <p className='text-lg max-mobile:text-base font-normal text-black100'>
                                    {card.description}
                                </p>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}

