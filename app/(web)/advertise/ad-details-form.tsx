"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import type { ComponentProps } from "react"
import { Controller, useForm, FormProvider as Form } from "react-hook-form"
import { Button } from "~/components/common/button"
import { Field, FieldError, FieldLabel } from "~/components/common/field"
import { Input } from "~/components/common/input"
import { Note } from "~/components/common/note"
import { Stack } from "~/components/common/stack"
import { TextArea } from "~/components/common/textarea"
import { cx } from "~/lib/utils"
import { createAdDetailsSchema } from "~/server/web/shared/schema"
import { FormMedia } from "~/components/common/form-media"
import Image from "next/image"
import { getRandomString, slugify } from "@primoui/utils"
import { useMemo } from "react"

export type AdDetailsValues = {
  name: string
  websiteUrl: string
  description: string
  buttonLabel?: string
  faviconUrl?: string
  bannerUrl?: string
}

type AdDetailsFormProps = ComponentProps<"form"> & {
  defaultValues?: Partial<AdDetailsValues>
  onSave: (values: AdDetailsValues) => void
}

export const AdDetailsForm = ({ className, defaultValues, onSave, ...props }: AdDetailsFormProps) => {
  const t = useTranslations("forms.ad_details")
  const tSchema = useTranslations("schema")

  const schema = createAdDetailsSchema(tSchema).omit({ sessionId: true })
  const resolver = zodResolver(schema)

  const form = useForm<AdDetailsValues>({
    resolver,
    defaultValues: {
      name: defaultValues?.name ?? "",
      websiteUrl: defaultValues?.websiteUrl ?? "",
      description: defaultValues?.description ?? "",
      buttonLabel: defaultValues?.buttonLabel ?? "",
      faviconUrl: defaultValues?.faviconUrl ?? "",
      bannerUrl: defaultValues?.bannerUrl ?? "",
    },
  })

  const [name, websiteUrl] = form.watch(["name", "websiteUrl"])
  const path = useMemo(() => `ads/${name ? slugify(name) : getRandomString(12)}`, [name])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSave)}
        className={cx("grid w-full gap-5 @md:grid-cols-2", className)}
        noValidate
        {...props}
      >
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
          name="websiteUrl"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel data-required htmlFor={field.name}>
                {t("website_url_label")}
              </FieldLabel>
              <Input
                id={field.name}
                type="url"
                size="lg"
                placeholder={t("website_url_placeholder")}
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Stack className="w-full justify-between">
                <FieldLabel data-required htmlFor={field.name}>
                  {t("description_label")}
                </FieldLabel>
                <Note className="text-xs">{t("description_note")}</Note>
              </Stack>
              <TextArea
                id={field.name}
                size="lg"
                placeholder={t("description_placeholder")}
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="buttonLabel"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>{t("button_label")}</FieldLabel>
              <Input id={field.name} size="lg" placeholder={t("button_placeholder")} {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="faviconUrl"
          render={({ field }) => (
            <FormMedia
              form={form}
              field={field}
              path={`${path}/favicon`}
              fetchType="favicon"
              websiteUrl={websiteUrl}
            >
              {({ value }) =>
                value && (
                  <Image
                    src={value}
                    alt="Favicon"
                    width={32}
                    height={32}
                    className="size-8 border box-content rounded-md object-contain"
                  />
                )
              }
            </FormMedia>
          )}
        />

        <Controller
          control={form.control}
          name="bannerUrl"
          render={({ field }) => (
            <FormMedia form={form} field={field} path={`${path}/banner`}>
              {({ value }) =>
                value && (
                  <Image
                    src={value}
                    alt="Banner"
                    height={72}
                    width={128}
                    className="h-8 w-auto border box-content rounded-md aspect-video object-cover"
                  />
                )
              }
            </FormMedia>
          )}
        />

        <Button type="submit" size="lg" className="col-span-full mt-2">
          {t("create.button_label")}
        </Button>
      </form>
    </Form>
  )
}
