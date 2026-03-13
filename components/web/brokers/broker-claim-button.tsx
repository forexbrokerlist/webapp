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
      <Button variant="secondary" size="md" onClick={() => setIsOpen(true)}>
        Claim Ownership
      </Button>

      <BrokerClaimDialog broker={broker} isOpen={isOpen} setIsOpen={setIsOpen}>
        {children}
      </BrokerClaimDialog>
    </>
  )
}
