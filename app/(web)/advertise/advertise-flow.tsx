"use client"

import { useState } from "react"
import { AdDetailsForm, type AdDetailsValues } from "./ad-details-form"
import { AdsPicker } from "~/components/web/ads/ads-picker"
import type { AdMany } from "~/server/web/ads/payloads"
import type { AdType } from "~/.generated/prisma/client"
import { Button } from "~/components/common/button"
import { ChevronLeft, XCircle } from "lucide-react"
import type { CategoryMany } from "~/server/web/categories/payloads"

export const AdvertiseFlow = ({
  ads,
  type,
  categories,
  subcategories,
  isCancelled
}: {
  ads: AdMany[]
  type: AdType | null
  categories: CategoryMany[]
  subcategories: { id: string; name: string; categoryId: string }[]
  isCancelled?: boolean
}) => {
  const [step, setStep] = useState<1 | 2>(1)
  const [showCancelled, setShowCancelled] = useState(isCancelled)
  const [adDetails, setAdDetails] = useState<AdDetailsValues | null>(null)

  const handleDetailsSubmit = (values: AdDetailsValues) => {
    setAdDetails(values)
    setStep(2)
  }

  if (showCancelled) {
    return (
      <div className="bg-white rounded-xl border border-solid border-border-light300 animate-in fade-in zoom-in-95 duration-500">
        <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
          <XCircle className="size-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Payment Cancelled</h2>
          <p className="text-muted-foreground">
            Your payment process was cancelled and no charges were made.
            If you experienced an issue, you can try again or contact support.
          </p>
        </div>
        <Button
          size="lg"
          className="mt-4"
          onClick={() => {
            setShowCancelled(false)
            // Optional: clean up the URL without a full page reload
            window.history.replaceState(null, '', window.location.pathname)
          }}
        >
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="">
      {step === 1 && (
        <div className="bg-white max-mobile:py-5 max-mobile:px-3  rounded-xl border border-solid border-border-light300 p-[30px] relative animate-in fade-in duration-500">
          <h2 className="text-xl text-black100 font-semibold mb-6">
            Ad Details: Enter your ad information
          </h2>
          <AdDetailsForm
            defaultValues={adDetails ?? undefined}
            onSave={handleDetailsSubmit}
            categories={categories}
            subcategories={subcategories}
          />
        </div>
      )}

      {step === 2 && adDetails && (
        <div className="w-full flex flex-col gap-4 relative animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Button variant="ghost" className="mr-auto -ml-2 text-muted-foreground" onClick={() => setStep(1)} prefix={<ChevronLeft />}>
            Back to details
          </Button>

          <AdsPicker ads={ads} type={type} adDetails={adDetails} className="w-full" />
        </div>
      )}
    </div>
  )
}
