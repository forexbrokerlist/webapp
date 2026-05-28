"use client"
import Link from 'next/link';
import React, { useState } from 'react'

const ITEMS_PER_PAGE = 6;

interface NewsItem {
  id: string;
  title: string | null;
  summary: string | null;
  imgurl?: string | null;
  content?: string | null;
}

interface ExpoNewsListProps {
  allNews: NewsItem[];
}

export default function ExpoNewsList({ allNews }: ExpoNewsListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(allNews.length / ITEMS_PER_PAGE);
  const paginatedNews = allNews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getPaginationPages = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 4) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 3) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <section className='pb-100'>
      <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4'>
        <h2 className='text-[42px] mb-10  max-mobile:mt-10 max-mobile:text-3xl max-mobile:leading-10 leading-normal text-black100 font-semibold'>
          Exhibition News
        </h2>

        <div className='grid grid-cols-2 max-tab:grid-cols-1 gap-6 mb-10'>
          {paginatedNews.map((news) => (
            <Link href={`/exhibitor/${news.id}`} key={news.id}>
              <div className='grid grid-cols-[1fr_343px] max-laptop:grid-cols-[1fr_250px] max-mobile:grid-cols-1 gap-4'>
                <div className='bg-white p-4 rounded-xl max-mobile:order-2'>
                  <h3 className='text-xl font-semibold text-black100 line-clamp-3 mb-3'>
                    {news.title}
                  </h3>
                  <p className='text-base text-black700 line-clamp-4 font-normal'>
                    {news.summary}
                  </p>
                </div>
                <div className='h-full max-mobile:h-[200px] w-full max-mobile:order-1'>
                  <img
                    className='block w-full h-full object-cover rounded-xl'
                    src={news.imgurl || 'https://www.shutterstock.com/image-vector/breaking-news-live-announcement-banner-600nw-2643360791.jpg'}
                    alt={news.title||"Exhibition News"}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-4 md:mt-12 pb-10">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="flex flex-1 sm:flex-none items-center justify-center gap-2 px-4 md:px-5 cursor-pointer py-2 md:py-2.5 bg-white border border-solid border-border-light300 rounded-full text-black700 text-sm md:text-base font-medium hover:bg-primary hover:border-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed order-1 sm:order-none"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Previous
            </button>

            <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2 order-3 sm:order-none w-full sm:w-auto mt-2 sm:mt-0">
              {getPaginationPages().map((p, i) =>
                p === '...'
                  ? <span key={`ellipsis-${i}`} className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center text-black700 font-medium">...</span>
                  : <button
                      key={p}
                      onClick={() => setCurrentPage(p as number)}
                      className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full font-medium transition-all text-sm md:text-base
                        ${currentPage === p
                          ? 'bg-primary text-black100 font-bold md:text-lg shadow-sm'
                          : 'bg-white border border-solid border-border-light300 text-black700 hover:bg-primary hover:border-primary'
                        }`}
                    >
                      {p}
                    </button>
              )}
            </div>

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(p => p + 1)}
              className="flex flex-1 sm:flex-none items-center justify-center gap-2 px-4 md:px-5 cursor-pointer py-2 md:py-2.5 bg-white border border-solid border-border-light300 rounded-full text-black700 text-sm md:text-base font-medium hover:bg-primary hover:border-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed order-2 sm:order-none"
            >
              Next
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}