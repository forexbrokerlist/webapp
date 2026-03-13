"use client"

import { useState } from "react"
import { useAction } from "next-safe-action/hooks"
import { ArrowRight, Check, Loader2, Mail, ShieldCheck } from "lucide-react"
import { Button } from "~/components/common/button"
import { Input } from "~/components/common/input"
import { sendToolClaimOtp, verifyToolClaimOtp } from "~/server/web/actions/claim"
import { cx } from "~/lib/utils"
import { toast } from "sonner"

type ClaimFlowProps = {
  brokerId: string
  onSuccess?: () => void
}

export const ClaimFlow = ({ brokerId, onSuccess }: ClaimFlowProps) => {
  const [step, setStep] = useState<"email" | "otp" | "success">("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")

  const sendOtpAction = useAction(sendToolClaimOtp, {
    onSuccess: () => {
      setStep("otp")
      toast.success("Verification code sent to your email")
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to send verification code")
    }
  })

  const verifyOtpAction = useAction(verifyToolClaimOtp, {
    onSuccess: () => {
      setStep("success")
      toast.success("Ownership claimed successfully!")
      onSuccess?.()
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Invalid or expired verification code")
    }
  })

  if (step === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center animate-in fade-in zoom-in duration-300">
        <div className="size-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
          <Check className="size-8 text-green-500" />
        </div>
        <h4 className="text-xl font-bold mb-2">Claim Verified!</h4>
        <p className="text-sm text-muted-foreground">
          You are now the verified owner of this broker. You can manage your profile from the dashboard.
        </p>
        <Button 
          className="mt-6 w-full" 
          onClick={() => window.location.reload()}
        >
          Go to Profile
        </Button>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col space-y-6 py-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {step === "email" ? (
        <div className="flex-1 flex flex-col space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Business Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="email@broker-domain.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <p className="text-[12px] text-muted-foreground italic">
              * Must match the broker&apos;s website domain
            </p>
          </div>
          <div className="mt-auto">
            <Button
              className="w-full h-11 font-bold"
              disabled={sendOtpAction.isPending || !email}
              onClick={() => sendOtpAction.execute({ toolId: brokerId, email })}
            >
              {sendOtpAction.isPending ? (
                <Loader2 className="size-4 animate-spin mr-2" />
              ) : (
                <ShieldCheck className="size-4 mr-2" />
              )}
              Send Verification Code
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col space-y-4">
          <div className="space-y-2 text-center mb-2">
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit code sent to <span className="font-semibold text-foreground">{email}</span>
            </p>
          </div>
          <Input
            placeholder="000000"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className="h-14 text-center text-2xl tracking-[0.5em] font-bold"
          />
          <div className="mt-auto flex flex-col gap-2">
            <Button
              className="w-full h-11 font-bold"
              disabled={verifyOtpAction.isPending || otp.length !== 6}
              onClick={() => verifyOtpAction.execute({ toolId: brokerId, otp })}
            >
              {verifyOtpAction.isPending ? (
                <Loader2 className="size-4 animate-spin mr-2" />
              ) : (
                <Check className="size-4 mr-2" />
              )}
              Verify & Claim
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => setStep("email")}
            >
              Change Email
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
