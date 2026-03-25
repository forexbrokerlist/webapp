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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/common/select"
import Image from "next/image"
import { getRandomString, slugify } from "@primoui/utils"
import { useEffect, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useSession } from "~/lib/auth-client"

export const PENDING_AD_DETAILS_KEY = "pending_ad_details"

import { categoryManyPayload, type CategoryMany } from "~/server/web/categories/payloads"

export type AdDetailsValues = {
  name: string
  websiteUrl: string
  description: string
  categoryId: string
  subcategoryId?: string
  buttonLabel?: string
  faviconUrl?: string
  bannerUrl?: string
}

type AdDetailsFormProps = ComponentProps<"form"> & {
  defaultValues?: Partial<AdDetailsValues>
  onSave: (values: AdDetailsValues) => void
  categories: CategoryMany[]
  subcategories: { id: string; name: string; categoryId: string }[]
}

export const AdDetailsForm = ({
  className,
  defaultValues,
  onSave,
  categories,
  subcategories,
  ...props
}: AdDetailsFormProps) => {
  const t = useTranslations("forms.ad_details")
  const tSchema = useTranslations("schema")

  const schema = createAdDetailsSchema(tSchema).omit({ sessionId: true })
  const resolver = zodResolver(schema)

  const session = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const form = useForm<AdDetailsValues>({
    resolver,
    defaultValues: {
      name: defaultValues?.name ?? "",
      websiteUrl: defaultValues?.websiteUrl ?? "",
      description: defaultValues?.description ?? "",
      categoryId: defaultValues?.categoryId ?? "",
      subcategoryId: defaultValues?.subcategoryId ?? "",
      buttonLabel: defaultValues?.buttonLabel ?? "",
      faviconUrl: defaultValues?.faviconUrl ?? "",
      bannerUrl: defaultValues?.bannerUrl ?? "",
    },
  })

  useEffect(() => {
    const saved = localStorage.getItem(PENDING_AD_DETAILS_KEY)
    if (saved) {
      try {
        const values = JSON.parse(saved) as AdDetailsValues
        form.reset(values)
        localStorage.removeItem(PENDING_AD_DETAILS_KEY)
      } catch (e) {
        console.error("Failed to restore ad details", e)
      }
    }
  }, [form])

  const handleSave = (values: AdDetailsValues) => {
    if (session.data) {
      onSave(values)
      return
    }

    localStorage.setItem(PENDING_AD_DETAILS_KEY, JSON.stringify(values))
    router.push(`/auth/login?next=${pathname}`)
  }

  const [name, websiteUrl] = form.watch(["name", "websiteUrl"])
  const path = useMemo(() => `ads/${name ? slugify(name) : getRandomString(12)}`, [name])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSave)}
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
          name="categoryId"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel data-required htmlFor={field.name}>
                Category
              </FieldLabel>
              <Select onValueChange={(val) => {
                field.onChange(val)
                form.setValue("subcategoryId", "")
              }} defaultValue={field.value}>
                <SelectTrigger id={field.name} size="lg">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          name="description"
          render={({ field, fieldState }) => (
            <Field className="col-span-full" data-invalid={fieldState.invalid}>
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
