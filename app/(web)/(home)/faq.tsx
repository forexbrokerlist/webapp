'use client'
import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/common/accordion"
import { Button } from '~/components/common/button';
const ProfileGroup = '/assets/images/profile-group.svg';
function FAQ() {
  const faqs = [
    {
      question: "What is ForexBrokerList.io?",
      answer: "A comprehensive directory to discover and compare 512+ forex brokers and industry service providers. We help traders find the right broker based on spreads, regulation, platforms, and more."
    },
    {
      question: "How do I find the right forex broker?",
      answer: "Browse our directory and filter brokers by regulation, minimum deposit, platform, and trading conditions. Each listing has detailed info to help you make a confident, informed decision."
    },
    {
      question: "Are the brokers on your list regulated?",
      answer: "Every listing displays regulatory information and the number of licenses a broker holds. Always verify a broker's regulation before depositing any funds."
    },
    {
      question: "How can my broker get listed on the site?",
      answer: "Simply visit our Submit page and fill in your broker or service details for review. Sponsored placements are also available for maximum visibility across our platform."
    },
    {
      question: "What is the difference between a regular and sponsored listing?",
      answer: "Regular listings appear in the standard directory, while sponsored listings get priority placement at the top of their category. Sponsored spots offer significantly more visibility to our professional audience."
    },
    {
      question: "Is ForexBrokerList.io free for traders?",
      answer: "Yes, browsing and comparing all brokers on our platform is 100% free. No sign-up is required to explore listings and access broker information."
    },
    {
      question: "How do I stay updated with new listings?",
      answer: "Subscribe to our newsletter and join 5,000+ members who get updates directly to your inbox. New brokers, platform changes, and industry news all in one place."
    }
  ]

  return (
    <div className="max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4">
      <div className='py-100 max-mobile:py-16'>
        <div className='grid grid-cols-[650px_1fr] max-tab:grid-cols-1 max-laptop:grid-cols-2 max-laptop:gap-10 gap-20'>
          <div>
            <div className='pb-[50px] max-mobile:pb-8'>
              <h2 className='text-[42px] max-mobile:text-3xl max-mobile:leading-10 leading-normal text-black100 font-bold font-monda'>
                Frequently Asked Questions
              </h2>
              <p className='text-lg max-mobile:text-base text-black700 font-medium leading-normal'>
              Got questions about forex brokers or our directory? Find quick answers below.
              </p>
            </div>
            <div className='max-w-[560px] max-mobile:rounded-xl max-mobile:p-5 w-full blur-card overflow-hidden relative rounded-[20px] border border-[rgba(18,18,18,0.1)] bg-white shadow-[0_0_26px_0_rgba(0,0,0,0.05)] backdrop-blur-[15.6px] p-[30px]'>
              <img src={ProfileGroup} alt="ProfileGroup" className='block' />
              <div className='pt-[30px]'>
                <h3 className='text-2xl max-mobile:text-xl max-mobile:leading-8 font-semibold text-black100 mb-3'>
                  Still confused? We’ll guide you.
                </h3>
                <p className='text-lg max-mobile:text-base text-black800 font-normal mb-5'>
                  Our team will help you create your first AI fashion visuals
                  and set up the perfect workflow for your store — step by step.
                </p>
                <Button size="md" variant="primary" className="px-5 gap-2.5 group">
                  Contact Us
                  <div className="w-7 h-7 rounded-full flex items-center group-hover:bg-white transition-all duration-300 justify-center bg-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M12.0254 4.94141L17.0837 9.99974L12.0254 15.0581" stroke="#1A1A1A" stroke-width="1.25" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M2.91699 10H16.942" stroke="#1A1A1A" stroke-width="1.25" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </div>
                </Button>
              </div>
            </div>
          </div>
          <div>
            <div className='p-5 max-mobile:rounded-xl max-mobile:p-4 rounded-[24px] border border-[rgba(0,0,0,0.07)] bg-white shadow-[0_0_80px_0_rgba(0,0,0,0.06)]'>
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
      <div className='w-full h-[1px] bg-[linear-gradient(90deg,#F0F1EC_0%,#A8DD15_50%,#F0F1EC_100%)]'></div>
    </div>
  )
}

export default FAQ
