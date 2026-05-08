'use client'
import React from 'react'
import { motion, Variants } from 'framer-motion';

const EarthBanner = '/assets/images/earth.svg';
const ChooseIcon = '/assets/images/choose.svg';
const BrokerageIcon = '/assets/images/brokerage.svg';
const AIIcon = '/assets/images/AI.svg';
const ScalableIcon = '/assets/images/scalable.svg';
const TraderIcon = '/assets/images/Trader.svg';
const RealTimeIcon = '/assets/images/RealTime.svg';

const whyChooseData = {
    left: [
        {
            title: "Why Choose Forex Broker",
            description: "Forex Broker List helps forex brokers launch and scale businesses with technology and automation.",
            icon: ChooseIcon
        },
        {
            title: "Complete Brokerage Solution",
            description: "Launch your forex business with licensing, CRM, trading platforms, and liquidity in one seamless solution.",
            icon: BrokerageIcon
        },
        {
            title: "AI-Powered Automation",
            description: "Automate trading operations and workflows with systems for improved efficiency and decision-making.",
            icon: AIIcon
        }
    ],
    right: [
        {
            title: "Customizable & Scalable Infrastructure",
            description: "Customize features easily and scale your brokerage without rebuilding the system.",
            icon: ScalableIcon
        },
        {
            title: "Advanced CRM & Trader's Room",
            description: "Manage clients, transactions, and reports with a powerful Forex CRM for brokers.",
            icon: TraderIcon
        },
        {
            title: "Real-Time Insights",
            description: "We provide real-time analytics and insights to support faster and better business decision-making.",
            icon: RealTimeIcon
        }
    ]
};

export default function WhyChoose() {
    const cardVariants: Variants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: [0.215, 0.61, 0.355, 1]
            }
        }
    };

    const floatingVariants: Variants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 1, ease: "easeOut" }
        },
        animate: {
            y: [0, -15, 0],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const cardHover: Variants = {
        hover: {
            y: -5,
            boxShadow: "0 20px 40px -15px rgba(168, 221, 21, 0.25)",
            borderColor: "rgba(168, 221, 21, 1)",
            transition: { duration: 0.3 }
        }
    };

    return (
        <div className='pb-100 max-mobile:pb-16 overflow-hidden'>
            <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4'>
                <motion.div
                    className='pb-[60px]'
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className='flex justify-center pb-3'>
                        <button className='bg-white border-none rounded-full py-2 px-4 text-base font-medium text-black700 shadow-sm'>
                            Why Forex Broker List
                        </button>
                    </div>
                    <h2 className='text-[42px] max-mobile:text-3xl leading-normal text-black100 font-bold text-center'>
                        Why Choose Forex Broker List
                    </h2>
                    <p className='text-lg max-mobile:text-base text-black700 font-medium max-w-[590px] whitespace-pre-line mx-auto text-center'>
                        Forex Broker List empowers forex brokers and traders with an all-in-one ecosystem combining advanced technology, automation, and expert support
                        to launch, manage, and scale brokerage businesses without complexity.
                    </p>
                </motion.div>

                <div className='grid grid-cols-3 max-tab:grid-cols-1 items-center gap-10'>
                    {/* Left Column */}
                    <div className='grid grid-cols-1 gap-8  max-mobile:gap-4'>
                        {whyChooseData.left.map((item, i) => (
                            <motion.div
                                key={`left-${i}`}
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                whileHover="hover"
                                viewport={{ once: true, margin: "-50px" }}
                                custom={i}
                                className='border-[rgba(168,221,21,0.50)] grid grid-cols-[40px_1fr] gap-5 p-5 border rounded-lg border-solid bg-white cursor-pointer transition-colors'
                                style={{ transformOrigin: 'center' }}
                            >
                                <motion.div variants={cardHover} className="contents">
                                    <img src={item.icon} alt={item.title} className='block' />
                                    <div>
                                        <h3 className='text-xl max-mobile:text-lg font-semibold mb-2.5 text-black100'>
                                            {item.title}
                                        </h3>
                                        <p className='text-lg max-mobile:text-base text-black700 font-medium'>
                                            {item.description}
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Center Image */}
                    <motion.div
                        className='flex justify-center'
                        initial="hidden"
                        whileInView="visible"
                        animate="animate"
                        viewport={{ once: true }}
                        variants={floatingVariants}
                    >
                        <img className='block w-full max-w-[500px] mx-auto' src={EarthBanner} alt="EarthBanner" />
                    </motion.div>

                    {/* Right Column */}
                    <div className='grid grid-cols-1 gap-8'>
                        {whyChooseData.right.map((item, i) => (
                            <motion.div
                                key={`right-${i}`}
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                whileHover="hover"
                                viewport={{ once: true, margin: "-50px" }}
                                className='border-[rgba(168,221,21,0.50)] grid grid-cols-[1fr_40px] gap-5 p-5 border rounded-lg border-solid bg-white cursor-pointer transition-colors'
                                style={{ transformOrigin: 'center' }}
                            >
                                <motion.div variants={cardHover} className="contents">
                                    <div>
                                        <h3 className='text-xl max-mobile:text-lg font-semibold mb-2.5 text-black100'>
                                            {item.title}
                                        </h3>
                                        <p className='text-lg max-mobile:text-base text-black700 font-medium'>
                                            {item.description}
                                        </p>
                                    </div>
                                    <img src={item.icon} alt={item.title} className='block' />
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

