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
      <div className="w-full max-w-2xl mx-auto bg-card border border-destructive/20 rounded-xl p-8 sm:p-12 shadow-sm flex flex-col items-center text-center gap-6 animate-in fade-in zoom-in-95 duration-500">
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
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      {step === 1 && (
        <div className="w-full bg-card border rounded-xl p-6 sm:p-10 shadow-sm relative animate-in fade-in duration-500">
           <div className="mb-6 font-semibold text-xl">1. Ad Details</div>
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
