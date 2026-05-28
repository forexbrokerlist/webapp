'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { getTrustedPlatforms } from '~/server/web/brokers/queries'
import { getPresignedUrlFromFull } from '~/lib/media'
import Link from 'next/link'
import { searchBrokersAction } from './actions'


type Broker = {
  name: string
  logoUrl: string
  slug?: string
}

type Props = {
  brokers: Awaited<ReturnType<typeof getTrustedPlatforms>>
}

export default function FintechExhibition({ brokers }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false)
  const [searchResults, setSearchResults] = useState<Broker[]>([])
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const icons = [
    { src: '/assets/images/Shield.svg', alt: 'Shield' },
    { src: '/assets/images/Chart.png', alt: 'Chart' },
    { src: '/assets/images/Search.png', alt: 'Search' },
    { src: '/assets/images/Analytics.png', alt: 'Analytics' },
    { src: '/assets/images/Settings.png', alt: 'Settings' },
  ]

  const mappedBrokers: Broker[] =
    brokers?.brokers?.map((b: any) => ({
      name: b.broker_name || b.name || 'Unknown',
      logoUrl: b.logoUrl ?? '/assets/images/placeholder-logo.png',
      slug:
        b.slug && b.slug.length > 0
          ? b.slug
          : (b.broker_name || b.name || '').toLowerCase().replace(/\s+/g, '-'),
    })) ?? []

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    const debounceTimer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const response = await searchBrokersAction(query)
        const { brokers } = response || {}
        const mapped: Broker[] = (brokers ?? []).map((b: any) => ({
          name: b.broker_name || b.name || 'Unknown',
          logoUrl: b.logoUrl ?? '/assets/images/placeholder-logo.png',
          slug:
            b.slug && b.slug.length > 0
              ? b.slug
              : (b.broker_name || b.name || '').toLowerCase().replace(/\s+/g, '-'),
        }))
        setSearchResults(mapped)
      } catch (e) {
        console.error('searchBrokers failed', e)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query])

  const filtered: Broker[] = query.trim() ? searchResults : mappedBrokers

  return (
    <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4'>
      <div className="bg-[url('/assets/images/black-layer.png')] px-16 sm:px-10 md:px-16 lg:px-24 py-[50px] max-mobile:px-5 max-mobile:rounded-none bg-cover bg-center bg-no-repeat rounded-3xl">

        {/* Top text section */}
        <div>
          <h2 className='text-xl sm:text-2xl capitalize text-white mb-2.5 font-semibold text-center'>
            the world's leading fintech exhibition
          </h2>
          <p className='text-sm sm:text-base lg:text-lg text-white opacity-70 text-center'>
            Born in 2019 and hosted by FinTech service provider WikiGlobal, WikiEXPO
            is a financial technology exhibition focusing on trading environment safety.
            Emphasizing on "Diversity and Security", it integrates various industry resources
            and fosters healthy competition and orderly development. It is a grand industry
            event encompassing authoritative information, industry insights, networking,
            and business opportunities.
          </p>
        </div>

        {/* Divider line */}
        <div
          className='w-full mt-8'
          style={{ height: '1px', border: '1px solid rgba(255, 255, 255, 0.14)' }}
        />

        {/* Bottom row */}
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-start gap-6 mt-8'>

          {/* Left text */}
          <p className='text-white font-normal text-sm sm:text-base text-center lg:text-left shrink-0'>
            The first step to safe trading, verify your broker with a single click.
          </p>

          {/* Search + Icons wrapper */}
          <div className='flex flex-col sm:flex-row sm:items-center gap-5 w-full lg:w-auto'>

            {/* Search bar */}
            <div className='relative w-full sm:w-[360px] lg:w-[456px]'>
              <div
                className='flex items-center rounded-xl px-3 py-3 gap-2 w-full bg-white/10 border border-[#1A1A1A]/20 backdrop-blur-[13.8px] cursor-text'
                onClick={() => {
                  setIsOpen(true)
                  inputRef.current?.focus()
                }}
              >
                <Search className='text-white/50 w-8 h-4 shrink-0' />
                <input
                  ref={inputRef}
                  type='text'
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsOpen(true)}
                  onBlur={() => setTimeout(() => setIsOpen(false), 150)}
                  placeholder='Search news, brokers, markets...'
                  className='bg-transparent text-white text-sm placeholder:text-white/40 outline-none w-full'
                />
                <span className='text-white text-xs border border-white/20 rounded px-1.5 py-0.5'>
                  ⌘/
                </span>
              </div>

              {/* Dropdown */}
              {isOpen && (
                <div className='absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl overflow-hidden z-50'>
                  <ul className='py-1 max-h-64 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
                    {isSearching ? (
                      <li className='px-4 py-3 text-sm text-gray-400'>Searching...</li>
                    ) : filtered.length > 0 ? (
                      filtered.map((broker) => (
                        <Link
                          key={broker.name}
                          href={`/forex-broker/${broker.slug}`}
                          target="_blank"
                          className='flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition'
                          onClick={() => {
                            setQuery(broker.name)
                            setIsOpen(false)
                          }}
                        >
                          <img
                            src={broker.logoUrl ?? '/assets/images/placeholder-logo.png'}
                            alt={broker.name}
                            className='w-5 h-5 rounded-full object-contain'
                          />
                          <span className='text-sm text-gray-800'>{broker.name}</span>
                        </Link>
                      ))
                    ) : (
                      <li className='px-4 py-3 text-sm text-gray-400'>No results found</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Icon buttons — below search on mobile, inline on sm+ */}
            <div className='flex items-center justify-center sm:justify-start'>
              {icons.map((icon, index) => (
                <div
                  key={icon.alt}
                  className={`relative w-10 h-10 rounded-full hover:opacity-80 hover:z-50 transition-all cursor-pointer ${index !== 0 ? '-ml-2.5' : ''}`}
                  style={{ zIndex: index }}
                >
                  <img src={icon.src} alt={icon.alt} className='w-full h-full object-contain' />
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}