"use client"

import { useRef, useState, useEffect, useMemo, type ComponentProps } from "react"
import { Button } from "~/components/common/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { getTrustedPlatforms } from '~/server/web/brokers/queries'
import { Search } from "lucide-react"
type Broker = {
  name: string
  logoUrl: string
  slug?: string | null
  categorySlug?: string | null
}

interface HeroProps extends ComponentProps<"section"> {
  brokers: Broker[]
}

const Herobanner = '/assets/images/herobanner.png';

export const Hero = ({ className, brokers, ...props }: HeroProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const allBrokers = brokers || [];
  const randomBrokers = useMemo(() => {
    if (!allBrokers.length) return [];
    const shuffled = [...allBrokers].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }, [allBrokers, isOpen]);
  const inputRef = useRef<HTMLInputElement>(null);
  // Determine which brokers to display: random set initially, filtered when query present
  const displayedBrokers = useMemo(() => {
    if (query) {
      return allBrokers.filter((b) => b.name.toLowerCase().includes(query.toLowerCase()));
    }
    return randomBrokers;
  }, [query, allBrokers, randomBrokers]);
  return (
    <>
      {/* <section className={cx("relative flex flex-col gap-y-12 w-full pt-16 pb-24 border-b border-border/40", className)} {...props}>
        <div className="absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 opacity-60 dark:opacity-100 -z-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(150, 150, 150, 0.3) 1px, transparent 0)', backgroundSize: '24px 24px' }} />

        <Intro alignment="center" className="relative z-10 px-4">
          <IntroTitle className="max-w-[16em] lg:text-5xl/[1.1]!">Discover and Compare the Best Forex Brokers</IntroTitle>
          <IntroDescription className="lg:mt-2">{t("brand.description")}</IntroDescription>

          <Suspense fallback={<CountBadgeSkeleton />}>
            <CountBadge />
          </Suspense>
        </Intro>
      </section> */}
      <section className="relative overflow-hidden max-mobile:pb-16 min-h-[calc(100dvh-50px)] max-tab:min-h-auto mb-4" {...props}>
        <div className="max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4">
          <div className="relative bg-[#F0F2EC]">

            <div className="max-w-[800px] pt-[200px] max-mobile:pt-[120px] max-laptop:pt-[150px] max-tab:pt-[160px] max-laptop:max-w-[700px]">
              <motion.div
                className="w-fit py-1.5 px-2 bg-white pr-4 rounded-full flex items-center gap-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="py-[3px] px-2.5 max-mobile:text-sm bg-black100 text-white text-sm font-normal rounded-full">
                  New
                </div>
                <span className="text-base max-mobile:text-sm font-medium text-black700">
                  512+ Verified Brokers Listed
                </span>
              </motion.div>

              <motion.h1
                className="text-[72px] font-bold relative z-[9] max-mobile:text-4xl max-mobile:leading-[45px] leading-[80px] max-laptop:text-[60px] max-laptop:leading-[70px] text-black100 font-monda my-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              >
                Find, Compare & Choose the Best Forex Brokers

              </motion.h1>

              <motion.p
                className="text-lg relative z-[9] max-w-[710px] max-mobile:text-base max-mobile:mb-5 font-medium text-black700 mb-9"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
              >
                Search and compare 512+ forex brokers by spread, regulation, platform, and minimum deposit. Trusted by thousands of traders worldwide, completely free.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
                className="flex  items-center gap-2"
              >
                <Link href="/brokers">
                  <Button size="md" variant="primary" className="px-5 gap-2.5 group relative z-[9]">
                    Find Your Broker
                    <div className="w-7 h-7 rounded-full flex items-center group-hover:bg-white transition-all duration-300 justify-center bg-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M12.0254 4.94141L17.0837 9.99974L12.0254 15.0581" stroke="#1A1A1A" strokeWidth="1.25" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2.91699 10H16.942" stroke="#1A1A1A" strokeWidth="1.25" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </Button>
                </Link>
                <div className='flex flex-col sm:flex-row sm:items-center gap-5 w-full lg:w-auto'>

                  {/* Search bar */}
                  <div className='relative w-full sm:w-[250px] lg:w-[320px]'>
                    <div
                      className='flex items-center rounded-full px-3 py-2 gap-2 w-full bg-white/10 border border-[#1A1A1A]/20 backdrop-blur-[13.8px] cursor-text'
                      onClick={() => {
                        setIsOpen(true)
                        inputRef.current?.focus()
                      }}
                    >
                      <input
                        ref={inputRef}
                        type='text'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsOpen(true)}
                        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
                        placeholder='Search Broker ...'
                        className='bg-transparent text-black100 text-sm placeholder:text-black100/40 outline-none w-full'
                      />
                      <Search className='text-white bg-black100 p-1.5 rounded-full w-8 h-8 shrink-0' />

                    </div>

                    {isOpen && (
                      <div className='absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50'>
                        <ul className='max-h-[300px] overflow-y-auto'>
                          {displayedBrokers.length > 0 ? (
                            displayedBrokers.map((broker) => (
                              <Link
                                key={broker.name}
                                href={broker.categorySlug === "forex-brokers" ? `/forex-broker/${broker.slug}` : `/${broker.categorySlug || "forex-broker"}/${broker.slug}`}
                                className='flex items-center gap-3 px-4 py-3 hover:bg-gray-50'
                              >
                                <img src={broker.logoUrl} alt={broker.name} className='w-6 h-6 object-contain' />
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


                </div>
              </motion.div>

              <motion.div
                className="pt-[50px] relative z-[9] max-mobile:pt-[30px] flex items-center max-mobile:grid max-mobile:grid-cols-2 max-mobile:gap-5"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.2,
                      delayChildren: 0.4,
                    }
                  }
                }}
              >
                <motion.div
                  className="pr-[30px] max-mobile:px-5 border-r border-border-light300 max-mobile:border-none"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                  }}
                >
                  <h2 className="text-[40px] max-mobile:text-3xl leading-normal text-black100 font-semibold font-monda text-center">
                    512+
                  </h2>
                  <p className="text-lg max-mobile:text-base text-black700 text-center font-medium">
                    Verified Brokers
                  </p>
                </motion.div>
                <motion.div
                  className="px-[30px] max-mobile:px-5 border-r border-border-light300 max-mobile:border-none"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                  }}
                >
                  <h2 className="text-[40px] max-mobile:text-3xl leading-normal text-black100 font-semibold font-monda text-center">
                    5,000+
                  </h2>
                  <p className="text-lg max-mobile:text-base text-black700 text-center font-medium">
                    Newsletter Members
                  </p>
                </motion.div>
                <motion.div
                  className="pl-[30px] max-mobile:px-5"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                  }}
                >
                  <h2 className="text-[40px] max-mobile:px-5 max-mobile:text-3xl leading-normal text-black100 font-semibold font-monda text-center">
                    15k+
                  </h2>
                  <p className="text-lg max-mobile:text-base text-black700 text-center font-medium">
                    Trader Reviews
                  </p>
                </motion.div>
              </motion.div>
            </div>

          </div>
        </div>
        <motion.div
          className="absolute max-mobile:hidden right-0 top-0 max-tab:flex max-tab:pt-10 max-tab:justify-center max-tab:relative"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <img src={Herobanner} className="max-w-[1200px] max-mobile:max-w-full max-mobile:w-full max-laptop:max-w-[900px] max-tab:max-w-[500px] block" alt="Herobanner" />
        </motion.div>
      </section>
    </>
  )
}
