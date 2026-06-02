"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks"
import { useTranslations } from "next-intl"
import { type ComponentProps, useMemo } from "react"
import { Controller, FormProvider as Form } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "~/components/common/button"
import { Field, FieldError, FieldLabel } from "~/components/common/field"
import { Input } from "~/components/common/input"
import { Note } from "~/components/common/note"
import { Stack } from "~/components/common/stack"
import { TextArea } from "~/components/common/textarea"
import { cx } from "~/lib/utils"
import { createAdFromCheckout } from "~/server/web/ads/actions"
import type { AdOne } from "~/server/web/ads/payloads"
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
import type { CategoryMany } from "~/server/web/categories/payloads"

type AdFormProps = ComponentProps<"form"> & {
  sessionId: string
  ad?: AdOne | null
  categories: CategoryMany[]
}

export const AdForm = ({ className, sessionId, ad, categories, ...props }: AdFormProps) => {
  const t = useTranslations("forms.ad_details")
  const tSchema = useTranslations("schema")

  const formAction = createAdFromCheckout
  const schema = createAdDetailsSchema(tSchema)
  const resolver = zodResolver(schema)

  const { form, action, handleSubmitWithAction } = useHookFormAction(formAction, resolver, {
    formProps: {
      defaultValues: {
        sessionId,
        name: ad?.name ?? "",
        websiteUrl: ad?.websiteUrl ?? "",
        description: ad?.description ?? "",
        categoryId: ad?.categoryId ?? "",
        subcategoryId: ad?.subcategoryId ?? "",
        buttonLabel: ad?.buttonLabel ?? "",
        faviconUrl: ad?.faviconUrl ?? "",
        bannerUrl: ad?.bannerUrl ?? "",
      },
    },

    actionProps: {
      onSuccess: () => {
        toast.success(t(`${ad ? "update" : "create"}.success_message`))
      },

      onError: ({ error }) => {
        toast.error(error.serverError)
      },
    },
  })

  const [name, websiteUrl] = form.watch(["name", "websiteUrl"])
  const path = useMemo(() => `ads/${name ? slugify(name) : getRandomString(12)}`, [name])

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmitWithAction}
        className={cx("grid w-full gap-5 grid-cols-2", className)}
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
                maxLength={160}
                {...field}
              />
              <div className="flex justify-between items-center">
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                <span className={cx(
                  "ml-auto text-xs tabular-nums",
                  field.value?.length >= 160 ? "text-red-500" : "text-muted-foreground"
                )}>
                  {field.value?.length ?? 0}/160
                </span>
              </div>
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="faviconUrl"
          render={({ field }) => (
            <FormMedia
              className="max-mobile:col-span-full"
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
            <FormMedia form={form} field={field} path={`${path}/banner`} className="max-mobile:col-span-full">
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

        <Button type="submit" size="lg" variant="secondary" className="col-span-full text-base mt-2" isPending={action.isPending}>
          {t(`${ad ? "update" : "create"}.button_label`)}
        </Button>
      </form>
    </Form>
  )
}
