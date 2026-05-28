import React from 'react'
import CommonBanner from '~/components/web/common-banner';
import { db } from '~/services/db';
import ExpoNewsList from './exponewslist';

export default async function Page() {
  const allNews = await db.expo_news.findMany();

  return (
    <div>
      <CommonBanner
        image={"/assets/images/news-card.png"}
        highlightedText="Global Fintech & Broker Expos"
        title="with live event updates & exhibitor insights."
        description="Stay ahead with real-time announcements, key takeaways, and behind-the-scenes coverage directly from the world's leading financial exhibitions and summits."
      />
      <ExpoNewsList allNews={allNews} />
    </div>
  );
}