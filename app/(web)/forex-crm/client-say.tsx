'use client'
import { Star } from 'lucide-react'
import React from 'react'
import { motion, Variants } from 'framer-motion'

const testimonials = [
    {
        name: "Ravi K.",
        location: "Dubai, UAE",
        text: "The IB module and MT4/MT5 integration worked perfectly from day one. KYC automation saved our compliance team a lot of manual work. Best Forex CRM we've used so far."
    },
    {
        name: "Michael T.",
        location: "London, UK",
        text: "Onboarding was done in under 48 hours and PSP integration worked out of the box. The 24/7 support team is genuinely responsive. Great all-in-one back office CRM for brokers."
    },
    {
        name: "Sara P.",
        location: "Singapore",
        text: "Role-based permissions and multi-desk management work really well for our team. Lead management helped boost our conversion noticeably. Pricing could be more transparent though."
    }
];

export default function ClientSay() {
    const headerVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20,
                duration: 0.6
            }
        }
    };

    const cardHover: Variants = {
        hover: {
            y: -12,
            boxShadow: "0 40px 80px -20px rgba(0, 0, 0, 0.12)",
            borderColor: "rgba(168, 221, 21, 0.3)",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 25
            }
        }
    };

    const starVariants: Variants = {
        hidden: { opacity: 0, scale: 0 },
        visible: (i: number) => ({
            opacity: 1,
            scale: 1,
            transition: {
                delay: 0.3 + (i * 0.1),
                type: "spring",
                stiffness: 200,
                damping: 12
            }
        })
    };

    return (
        <div className='pb-100 max-mobile:pb-16 relative overflow-hidden'>
            {/* Decorative Background Elements */}
            <motion.div
                animate={{
                    y: [0, -20, 0],
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0]
                }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className='absolute -top-20 -right-20 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -z-10'
            />
            <motion.div
                animate={{
                    y: [0, 20, 0],
                    scale: [1, 1.05, 1]
                }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className='absolute bottom-0 -left-20 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[100px] -z-10'
            />

            <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4'>
                <div className='pb-[60px] max-mobile:pb-10 text-center'>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={headerVariants}
                        className='flex justify-center pb-3'
                    >
                        <button className='bg-white border-none rounded-full py-2 px-4 text-base font-medium text-black700 shadow-sm'>
                            Testimonials
                        </button>
                    </motion.div>
                    <motion.h2
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={headerVariants}
                        className='text-[48px] max-mobile:text-3xl leading-tight text-black100 font-bold mb-4'
                    >
                        What Our <span className='text-primary'>Clients Say</span>
                    </motion.h2>
                    <motion.p
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={headerVariants}
                        className='text-lg max-mobile:text-base text-black700 font-medium max-w-[650px] mx-auto'
                    >
                        Join hundreds of forex brokers, prop firms, and trading businesses using Forex CRM to scale faster and operate smarter.
                    </motion.p>
                </div>

                <div className='grid grid-cols-3 gap-5 max-mobile:grid-cols-1'>
                    {testimonials.map((item, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            initial="hidden"
                            whileInView="visible"
                            whileHover="hover"
                            viewport={{ once: true, margin: "-50px" }}
                            className='h-full'
                        >
                            <motion.div
                                variants={cardHover}
                                className='p-8  max-mobile:p-4 max-mobile:rounded-lg rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white/60 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col h-full cursor-pointer transition-colors hover:bg-white hover:border-primary/20'
                            >
                                <div className='flex items-center pb-5 gap-1'>
                                    {[...Array(5)].map((_, starIndex) => (
                                        <motion.div
                                            key={starIndex}
                                            variants={starVariants}
                                            custom={starIndex}
                                        >
                                            <Star className='text-[#FFB800] fill-[#FFB800] w-5 h-5' />
                                        </motion.div>
                                    ))}
                                </div>
                                <div className='pb-5 border-b border-solid border-border-light300 grow'>
                                    <p className='text-lg max-mobile:text-base font-medium text-black700 leading-relaxed'>
                                        "{item.text}"
                                    </p>
                                </div>
                                <div className='pt-5 grid grid-cols-[55px_1fr] gap-4 items-center'>
                                    <div className='w-[55px] h-[55px] rounded-full bg-primary flex items-center justify-center text-xl font-bold text-black100 shadow-sm'>
                                        {item.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className='text-xl text-black100 font-semibold'>
                                            {item.name}
                                        </h3>
                                        <span className='block text-black700 font-normal'>
                                            {item.location}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

