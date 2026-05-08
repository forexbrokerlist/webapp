import React from 'react'

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
            icon:RealTimeIcon
        }
    ]
};

export default function WhyChoose() {
    return (
        <div className='pb-100'>
            <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4'>
                <div className='pb-[60px]'>
                    <div className='flex justify-center pb-3'>
                        <button className='bg-white border-none rounded-full py-2 px-4 text-base font-medium text-black700'>
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
                </div>
                <div className='grid grid-cols-3 items-center gap-10 max-laptop:grid-cols-1'>
                    <div className='grid grid-cols-1 gap-8'>
                        {whyChooseData.left.map((item, i) => (
                            <div key={i} className='border-[rgba(168,221,21,0.50)] grid grid-cols-[40px_1fr] gap-5 p-5 border rounded-lg border-solid bg-white hover:shadow-md transition-shadow'>
                                <img src={item.icon} alt={item.title} className='block' />
                                <div>
                                    <h3 className='text-xl font-semibold mb-2.5 text-black100'>
                                        {item.title}
                                    </h3>
                                    <p className='text-lg text-black700 font-medium'>
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='max-laptop:order-first'>
                        <img className='block w-full max-w-[500px] mx-auto' src={EarthBanner} alt="EarthBanner" />
                    </div>
                    <div className='grid grid-cols-1 gap-8'>
                        {whyChooseData.right.map((item, i) => (
                            <div key={i} className='border-[rgba(168,221,21,0.50)] grid grid-cols-[1fr_40px] gap-5 p-5 border rounded-lg border-solid bg-white hover:shadow-md transition-shadow'>
                                <div>
                                    <h3 className='text-xl font-semibold mb-2.5 text-black100'>
                                        {item.title}
                                    </h3>
                                    <p className='text-lg text-black700 font-medium'>
                                        {item.description}
                                    </p>
                                </div>
                                <img src={item.icon} alt={item.title} className='block' />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
