import React from 'react'
import CommonBanner from '../../../components/web/common-banner'
import NewsCategoriesTab from './news-categories-tab'
import NewsCardList from './news-card-list'

export default function page() {
    return (
        <div>
            <CommonBanner highlightedText="Real-time crypto & finance news" title=" with AI-powered market impact analysis." description="Explore our comprehensive directory of forex brokers and trading services across 
          multiple categories." image="/assets/images/news-card.png" />
            <NewsCategoriesTab />
            <NewsCardList />
            <div className='w-full h-[1px] bg-[linear-gradient(90deg,#F0F1EC_0%,#A8DD15_50%,#F0F1EC_100%)]'></div>
        </div>
    )
}
