"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks"
import { useTranslations } from "next-intl"
import { Controller, FormProvider as Form } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "~/components/common/button"
import { Field, FieldError, FieldLabel } from "~/components/common/field"
import { Input } from "~/components/common/input"
import { TextArea } from "~/components/common/textarea"
import { submitContactUs } from "~/server/web/actions/contact"
import { createContactUsSchema } from "~/server/web/shared/schema"

export const ContactForm = () => {
  const t = useTranslations("forms.contact")
  const tSchema = useTranslations("schema")

  const resolver = zodResolver(createContactUsSchema(tSchema))

  const { form, action, handleSubmitWithAction } = useHookFormAction(submitContactUs, resolver, {
    formProps: {
      defaultValues: {
        captcha: "",
        name: "",
        email: "",
        subject: "",
        message: "",
      },
    },

    actionProps: {
      onSuccess: ({ data }) => {
        toast.success(data || t("success_message"))
        form.reset()
      },
      onError: ({ error }) => {
        toast.error(error.serverError || t("errors.failed"))
      },
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={handleSubmitWithAction} className="grid gap-5.5" noValidate>
        <Controller
          control={form.control}
          name="captcha"
          render={({ field }) => <input type="hidden" {...field} />}
        />
        <div className="grid grid-cols-2 gap-5">
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel data-required htmlFor={field.name}>
                  {t("name_label")}
                </FieldLabel>
                <Input id={field.name} size="lg" placeholder={t("name_placeholder")} {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel data-required htmlFor={field.name}>
                  {t("email_label")}
                </FieldLabel>
                <Input
                  id={field.name}
                  type="email"
                  size="lg"
                  placeholder={t("email_placeholder")}
                  data-1p-ignore
                  {...field}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
        <Controller
          control={form.control}
          name="subject"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>{t("subject_label")}</FieldLabel>
              <Input
                id={field.name}
                size="lg"
                placeholder={t("subject_placeholder")}
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="message"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel data-required htmlFor={field.name}>
                {t("message_label")}
              </FieldLabel>
              <TextArea
                id={field.name}
                size="lg"
                placeholder={t("message_placeholder")}
                className="min-h-36"
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className="max-w-[220px] w-full">
          <Button type="submit" variant="secondary" className="text-base w-full" isPending={action.isPending}>
            {t("submit_button")}
          </Button>
        </div>
      </form>
    </Form>
  )
}
