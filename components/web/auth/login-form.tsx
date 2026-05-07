"use client"

import { InboxIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import type { ComponentProps } from "react"
import { Controller, FormProvider as Form } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "~/components/common/button"
import { Field, FieldError } from "~/components/common/field"
import { Input } from "~/components/common/input"
import { Stack } from "~/components/common/stack"
import { useMagicLink } from "~/hooks/use-magic-link"

export const LoginForm = ({ ...props }: ComponentProps<"form">) => {
  const t = useTranslations()
  const router = useRouter()

  const { form, handleSignIn, isPending } = useMagicLink({
    onSuccess: email => {
      router.push(`/auth/verify?email=${email}`)
    },

    onError: ({ error }) => {
      toast.error(error.message)
    },
  })

  return (
    <Form {...form}>
      <>
        <form onSubmit={form.handleSubmit(handleSignIn)} noValidate {...props}>
          <div>
            <label className="text-base font-normal text-black100 block mb-1">
              Email
            </label>
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    id={field.name}
                    type="email"
                    size="lg"
                    className="rounded-full"
                    placeholder={t("forms.sign_in.email_placeholder")}
                    data-1p-ignore
                    {...field}
                  />

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <div className="pt-6">
            <Button className="text-base w-full group" isPending={isPending}>
              {t("forms.sign_in.magic_link_button")}
              <div className="w-7 h-7 rounded-full flex items-center group-hover:bg-white transition-all duration-300 justify-center bg-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M12.0254 4.94141L17.0837 9.99974L12.0254 15.0581" stroke="#1A1A1A" strokeWidth="1.25" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2.91699 10H16.942" stroke="#1A1A1A" strokeWidth="1.25" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Button>
          </div>
        </form>
      </>
    </Form>
  )
}
