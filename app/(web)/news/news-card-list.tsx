'use client'

import { motion } from 'framer-motion'
import React from 'react'
import NewsTab from './news-tab'
import NewsFilter from './news-filter'
import NewsUpdateCard from './news-update-card'
import NewsGridCard from './news-grid-card'

const NewsHeroMain = '/assets/images/news-hero-main.png';
const NewsCrypto = '/assets/images/news-crypto.png';
const NewsScam = '/assets/images/news-scam.png';

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function NewsCardList() {
    const latestNews = [
        {
            category: 'Crypto',
            time: '2 hours ago',
            title: 'S&P 500 Hits New All-Time High Amid Tech Rally',
            description: 'The euro climbed sharply against the dollar as the European Central Bank hinted at holding rates steady, sending traders rus...'
        },
        {
            category: 'Forex',
            time: '4 hours ago',
            title: 'US Dollar Strengthens Against Major Currencies',
            description: 'Market participants are closely watching the upcoming inflation data which is expected to influence the Federal Reserve...'
        },
        {
            category: 'Stocks',
            time: '5 hours ago',
            title: 'Tech Giants See Significant Gains in Pre-Market Trading',
            description: 'Apple and Microsoft are leading the charge as investors remain optimistic about the future of AI-driven technologies...'
        },
        {
            category: 'Crypto',
            time: '2 hours ago',
            title: 'S&P 500 Hits New All-Time High Amid Tech Rally',
            description: 'The euro climbed sharply against the dollar as the European Central Bank hinted at holding rates steady, sending traders rus...'
        },
        {
            category: 'Forex',
            time: '4 hours ago',
            title: 'US Dollar Strengthens Against Major Currencies',
            description: 'Market participants are closely watching the upcoming inflation data which is expected to influence the Federal Reserve...'
        },
        {
            category: 'Stocks',
            time: '5 hours ago',
            title: 'Tech Giants See Significant Gains in Pre-Market Trading',
            description: 'Apple and Microsoft are leading the charge as investors remain optimistic about the future of AI-driven technologies...'
        },
        {
            category: 'Crypto',
            time: '2 hours ago',
            title: 'S&P 500 Hits New All-Time High Amid Tech Rally',
            description: 'The euro climbed sharply against the dollar as the European Central Bank hinted at holding rates steady, sending traders rus...'
        },
        {
            category: 'Forex',
            time: '4 hours ago',
            title: 'US Dollar Strengthens Against Major Currencies',
            description: 'Market participants are closely watching the upcoming inflation data which is expected to influence the Federal Reserve...'
        },
        {
            category: 'Stocks',
            time: '5 hours ago',
            title: 'Tech Giants See Significant Gains in Pre-Market Trading',
            description: 'Apple and Microsoft are leading the charge as investors remain optimistic about the future of AI-driven technologies...'
        },
    ]

    return (
        <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className='pb-100 max-mobile:pb-16'
        >
            <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4'>
                <motion.div
                    variants={fadeInUp}
                    className='flex items-center pb-[30px] justify-between'
                >
                    <NewsTab />
                    <NewsFilter />
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    className='grid grid-cols-[1.2fr_1fr] gap-10 max-laptop:grid-cols-2'
                >
                    <motion.div variants={fadeInUp}>
                        <h2 className='text-xl font-medium mb-3 text-black100'>
                            Latest News (12)
                        </h2>
                        <div className="space-y-6">
                            {/* Hero Card */}
                            <NewsGridCard
                                category="Forex"
                                time="2 hours ago"
                                title="EUR/USD Surges Past 1.12 as ECB Signals Rate Pause"
                                description="The euro climbed sharply against the dollar as the European Central Bank hinted at holding rates steady, sending traders rushing to adjust positions."
                                image={NewsHeroMain}
                                isLarge={true}
                                categoryColor="bg-primary"
                            />

                            {/* Secondary Cards Grid */}
                            <div className="grid grid-cols-2 gap-6 max-mobile:grid-cols-1">
                                <NewsGridCard
                                    category="Crypto"
                                    time="2 hours ago"
                                    title="Bitcoin Breaks $95K Analysts Eye $100K Target"
                                    image={NewsCrypto}
                                    categoryColor="bg-[#A8DD15]"
                                />
                                <NewsGridCard
                                    category="Scam Alert"
                                    time="4 hours ago"
                                    title="SCAM ALERT: Fake Broker 'FXPrimeGlobal' Exposed"
                                    image={NewsScam}
                                    categoryColor="bg-[#FF4D4D] text-white"
                                />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                        <h2 className='text-xl font-medium mb-3 text-black100'>
                            Latest Updates
                        </h2>
                        <div className='bg-[#f8f9fa] h-[844px] overflow-auto rounded-2xl p-5 shadow-sm border border-border-light200'>
                            <div className='space-y-2'>
                                {latestNews.map((news, index) => (
                                    <NewsUpdateCard
                                        key={index}
                                        category={news.category}
                                        time={news.time}
                                        title={news.title}
                                        description={news.description}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    )
}


