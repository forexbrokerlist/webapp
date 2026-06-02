import seoData from "~/config/seo.json"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { cache } from "react"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { ContactForm } from "~/components/web/contact-form"
import { StructuredData } from "~/components/web/structured-data"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { generateWebPage } from "~/lib/structured-data"
import CommonBanner from "~/components/web/common-banner"
import { Share } from "next/font/google"
const TradeImage = '/assets/images/contact-us.svg';
const MessageImage = '/assets/images/message.svg';

const namespace = "pages.contact_us"

const getData = cache(async () => {
  const t = await getTranslations()
  const url = "/contact"
  const title = t(`${namespace}.title`)
  const description = t(`${namespace}.description`, { siteName: siteConfig.name })

  return getPageData(url, title, description, {
    breadcrumbs: [{ url, title }],
    structuredData: [generateWebPage(url, title, description)],
  })
})

export const generateMetadata = async (): Promise<Metadata> => {
  const { url, metadata } = await getData()
  const mergedMetadata = { ...metadata, ...seoData.contact }
  return getPageMetadata({
    url,
    title: mergedMetadata.title,
    description: mergedMetadata.description,
    metadata: mergedMetadata
  })
}

export default async function () {
  const t = await getTranslations()
  const { metadata, structuredData } = await getData()

  return (
    <>

      <CommonBanner
        image={TradeImage}
        description='Have questions, feedback, or business inquiries? Reach out to our team—we’re here to help and respond quickly to 
all your needs.'
        highlightedText="Contact Us –" title="We’re Here to Help 
You Anytime" />
      <div className="pt-[40px] pb-100 max-mobile:py-16">
        <div className="max-w-[1460px] px-5 mx-auto">
          <div className="grid grid-cols-[1fr_390px] max-mobile:grid-cols-1 gap-0 max-mobile:rounded-xl rounded-2xl bg-white">
            <div className="p-[35px] max-mobile:p-5">
              <div className="pb-[35px] max-mobile:pb-5">
                <h2 className="text-black200 text-3xl max-mobile:text-2xl font-bold mb-2">
                  Connect With Our Team for Inquiries
                </h2>
                <p className="text-lg max-mobile:text-base text-black700 max-w-[731px] font-medium">
                  Need assistance with listings, advertising, or partnerships? Send us a message and our dedicated team will review your request and get back to you promptly with the
                  right support and guidance.
                </p>
              </div>
              <ContactForm />
            </div>
            <div className="bg-[#a8dd151a] flex flex-col justify-between">
              <div>
                <div className="bg-primary p-5 max-mobile:rounded-none rounded-r-2xl relative">
                  <img src={MessageImage} alt="MessageImage" className="block absolute right-4 top-4 max-w-100" />
                  <div className="relative">
                    <h3 className="text-xl max-mobile:mb-2 text-black100 font-semibold mb-4">
                      We're here to help
                    </h3>
                    <p className="text-lg max-mobile:text-base text-black100 font-medium">
                      Have questions, feedback, or just want to share your thoughts? We genuinely love to hear from you! Feel free to reach out anytime your
                      input is valuable to us.
                    </p>
                  </div>
                </div>
                <div className="p-5">
                  <div className="bg-white rounded-xl p-3 grid grid-cols-[50px_1fr] items-center gap-3">
                    <div className="w-[50px] h-[50px] bg-primary rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                        <path d="M10.8353 3.25C7.64342 3.28475 5.862 3.48756 4.67837 4.6712C3.25 6.09957 3.25 8.39852 3.25 12.9963C3.25 17.5943 3.25 19.8933 4.67837 21.3216C6.10675 22.75 8.4057 22.75 13.0036 22.75C17.6015 22.75 19.9004 22.75 21.3288 21.3216C22.5127 20.1378 22.7152 18.3558 22.75 15.1627" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M15.166 3.25H19.4993C21.0314 3.25 21.7974 3.25 22.2734 3.72595C22.7493 4.2019 22.7493 4.96794 22.7493 6.5V10.8333M21.666 4.33333L11.916 14.0833" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-base font-medium text-black700">
                        Share your question, suggestion, or
                        partnership idea and we'll follow up
                        by email.
                      </p>
                    </div>
                  </div>
                  <div className="bg-white mt-5 rounded-xl p-3 grid grid-cols-[50px_1fr] items-center gap-3">
                    <div className="w-[50px] h-[50px] bg-primary rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                        <path d="M12.9993 23.8346C18.9824 23.8346 23.8327 18.9844 23.8327 13.0013C23.8327 7.01822 18.9824 2.16797 12.9993 2.16797C7.01626 2.16797 2.16602 7.01822 2.16602 13.0013C2.16602 18.9844 7.01626 23.8346 12.9993 23.8346Z" stroke="black" stroke-width="1.5" />
                        <path d="M10.291 10.293L14.0826 14.0842M17.3327 8.66797L11.916 14.0846" stroke="black" stroke-width="1.5" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-base  font-medium text-black700">
                        Most requests receive a reply within 1-2 business days.
                      </p>
                    </div>
                    
                  </div>
                  
                </div>
                     <div className="mx-5">
                <div className="bg-white rounded-xl p-3 grid grid-cols-[50px_1fr] items-center gap-3">
                  <div className="w-[50px] h-[50px] bg-primary rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                      <path d="M7.58398 9.20703L10.7712 11.0914C12.6293 12.19 13.372 12.19 15.2302 11.0914L18.4173 9.20703" stroke="#121212" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M2.1831 14.5999C2.25392 17.9209 2.28933 19.5814 3.51472 20.8115C4.7401 22.0415 6.44554 22.0843 9.85642 22.17C11.9586 22.2229 14.0401 22.2229 16.1423 22.17C19.5532 22.0843 21.2586 22.0415 22.484 20.8115C23.7094 19.5814 23.7448 17.9209 23.8156 14.5999C23.8384 13.532 23.8384 12.4706 23.8156 11.4027C23.7448 8.08173 23.7094 6.42123 22.484 5.19118C21.2586 3.96114 19.5532 3.91829 16.1423 3.83259C14.0401 3.77976 11.9586 3.77976 9.8564 3.83258C6.44554 3.91827 4.7401 3.96111 3.51471 5.19117C2.28932 6.42122 2.25392 8.08172 2.18309 11.4027C2.16032 12.4706 2.16033 13.532 2.1831 14.5999Z" stroke="#121212" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-black800 mb-0">
                      Prefer direct email?
                    </p>
                     <a href="mailto:forexbrokerlist24@gmail.com" className="block text-base text-primary  underline underline-offset-4 cursor-pointer">forexbrokerlist24@gmail.com</a>
                     
                  </div>
                </div>
              </div>
              </div>
         

            </div>
          </div>
        </div>
      </div>
      <div className='w-full h-[1px] bg-[linear-gradient(90deg,#F0F1EC_0%,#A8DD15_50%,#F0F1EC_100%)]'></div>


      <StructuredData data={structuredData} />
    </>
  )
}
