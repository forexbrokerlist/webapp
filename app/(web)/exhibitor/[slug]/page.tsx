import React from 'react'
import CommonBanner from '~/components/web/common-banner'
import { db } from '~/services/db'
import { notFound } from 'next/navigation'

export default async function page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const news = await db.expo_news.findUnique({
    where: {
      id: resolvedParams.slug
    }
  });

  if (!news) {
    notFound();
  }
  

  let highlightedText = "";
  let mainTitle = news.title || "News Details";

  if (news.title && news.title.includes(":")) {
    const parts = news.title.split(":");
    highlightedText = parts[0] + ":";
    mainTitle = parts.slice(1).join(":").trim();
  }

  return (
    <div>
      <CommonBanner 
        highlightedText={highlightedText}
        title={mainTitle} 
        description={""}
        className="!max-mobile:!px-0"
        titleClassName="text-[40px] leading-[42px] max-mobile:text-[24px] max-mobile:leading-[30px]"
        image={news.imgurl || "/assets/images/expo-card.png"} 
      />
      <div className="max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4 py-[50px]">
        {news.content ? (
            <div className="bg-white border border-border-light300 p-10 max-mobile:p-5 rounded-2xl">
                <div 
                    className="prose max-w-none prose-lg text-black700 [&_p]:!indent-0 [&_p]:!my-0 [&_p:empty]:!hidden [&_h2]:!my-1 [&_h3]:!my-0" 
                    dangerouslySetInnerHTML={{ __html: news.content }} 
                />
            </div>
        ) : (
            <p>No content available for this news item.</p>
        )}
      </div>
    </div>
  )
}