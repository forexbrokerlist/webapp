"use client"

import { useState } from "react"
import { AdDetailsForm, type AdDetailsValues } from "./ad-details-form"
import { AdsPicker } from "~/components/web/ads/ads-picker"
import type { AdMany } from "~/server/web/ads/payloads"
import type { AdType } from "~/.generated/prisma/client"
import { Button } from "~/components/common/button"
import { ChevronLeft } from "lucide-react"
import type { CategoryMany } from "~/server/web/categories/payloads"

export const AdvertiseFlow = ({ 
  ads, 
  type, 
  categories, 
  subcategories 
}: { 
  ads: AdMany[]
  type: AdType | null
  categories: CategoryMany[]
  subcategories: { id: string; name: string; categoryId: string }[] 
}) => {
  const [step, setStep] = useState<1 | 2>(1)
  const [adDetails, setAdDetails] = useState<AdDetailsValues | null>(null)

  const handleDetailsSubmit = (values: AdDetailsValues) => {
    setAdDetails(values)
    setStep(2)
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
