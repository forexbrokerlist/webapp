"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import { Button } from "~/components/common/button"
import { BrokerClaimDialog } from "~/components/web/brokers/broker-claim-dialog"

type BrokerClaimButtonProps = {
  broker: any // Using any for now to match BrokerClaimDialog
  children?: ReactNode
}

export const BrokerClaimButton = ({ broker, children }: BrokerClaimButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* <Button variant="secondary" size="md" onClick={() => setIsOpen(true)}>
        Claim Ownership
      </Button> */}
 <button  onClick={() => setIsOpen(true)} className='py-2.5 px-5 w-[200px] justify-center text-base font-medium text-black100 border-none bg-[#F0F1EC] rounded-full cursor-pointer flex items-center gap-2'>
                                    Claim Ownership
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M15.5 2V5M6.5 2V5M11 2V5" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M19 12V10.5C19 7.20017 19 5.55025 17.9749 4.52512C16.9497 3.5 15.2998 3.5 12 3.5H10C6.70017 3.5 5.05025 3.5 4.02513 4.52513C3 5.55025 3 7.20017 3 10.5V15C3 18.2998 3 19.9497 4.02513 20.9749C5.05025 22 6.70017 22 10 22H11" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M7 15H11M7 11H15" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M15.7367 21.6527L14 22L14.3473 20.2633C14.4179 19.9106 14.5913 19.5866 14.8456 19.3323L18.9111 15.2668C19.2668 14.9111 19.8437 14.9111 20.1995 15.2668L20.7332 15.8005C21.0889 16.1563 21.0889 16.7332 20.7332 17.0889L16.6677 21.1544C16.4134 21.4087 16.0894 21.5821 15.7367 21.6527Z" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button> 
      <BrokerClaimDialog broker={broker} isOpen={isOpen} setIsOpen={setIsOpen}>
        {children}
      </BrokerClaimDialog>
    </>
  )
}
