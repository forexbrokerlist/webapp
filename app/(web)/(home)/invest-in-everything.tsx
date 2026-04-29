"use client"
import { MoveRight } from 'lucide-react'
import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '~/components/common/button'
import Link from 'next/link'
const RightImage = '/assets/images/right-img.png';

export default function InvestInEverything() {
  return (
    <div className="max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-0 ">
      <div className="bg-[url('/assets/images/black-layer.png')] px-100 max-tab:px-10 max-mobile:px-5 max-mobile:rounded-none bg-cover bg-center bg-no-repeat rounded-3xl ">
        <div className='grid grid-cols-[1fr_593px] max-tab:grid-cols-1 items-end'>
          <motion.div
            className='py-[60px]'
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
          >
            <motion.h2
              className='text-[42px] max-mobile:text-3xl max-mobile:mb-2 max-mobile:leading-10 leading-normal text-white font-bold'
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
              }}
            >
             Choose the Right Forex Broker for Your Investment
            </motion.h2>
            <motion.p
              className='text-lg max-mobile:text-base max-mobile:leading-6 text-white mb-7'
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
              }}
            >
             Compare forex brokers by spread, regulation, platform, and minimum deposit. Browse 512+ verified listings completely free. A signup is required.
            </motion.p>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
              }}
            >
               <Link href={`/brokers`}>
              <Button variant='primary' size='md' className={` border-none py-2.5 bg-white text-black100  flex justify-between items-center group`}>
               
                Browse All Brokers
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 bg-black100 `}>
                  <MoveRight className="text-white" />
                </div>
              </Button>
                </Link>

            </motion.div>
          </motion.div>

          <motion.div
            className='flex items-end'
            animate={{ y: [0, -15, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <img src={RightImage} alt="RightImage" className='block' />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
