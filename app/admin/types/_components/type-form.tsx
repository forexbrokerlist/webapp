"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useHotkeys } from "@mantine/hooks"
import { slugify } from "@primoui/utils"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import type { ComponentProps } from "react"
import { Controller, FormProvider as Form, useForm } from "react-hook-form"
import { toast } from "sonner"
import { TypeActions } from "~/app/admin/types/_components/type-actions"
import { AIGenerateDescription } from "~/components/admin/ai/generate-description"
import { Button } from "~/components/common/button"
import { Field, FieldError, FieldLabel } from "~/components/common/field"
import { H3 } from "~/components/common/heading"
import { Input } from "~/components/common/input"
import { Kbd } from "~/components/common/kbd"
import { Link } from "~/components/common/link"
import { RelationSelector } from "~/components/common/relation-selector"
import { Stack } from "~/components/common/stack"
import { TextArea } from "~/components/common/textarea"
import { useComputedField } from "~/hooks/use-computed-field"
import { orpc } from "~/lib/orpc-query"
import { cx } from "~/lib/utils"
import type { findTypeById } from "~/server/admin/types/queries"
import { typeSchema } from "~/server/admin/types/schema"
import { descriptionSchema } from "~/server/admin/shared/schema"

type TypeFormProps = ComponentProps<"form"> & {
  type?: NonNullable<Awaited<ReturnType<typeof findTypeById>>>
}

export function TypeForm({ className, title, type, ...props }: TypeFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: brokers = [] } = useQuery(orpc.brokers.lookup.queryOptions())

  const form = useForm({
    resolver: zodResolver(typeSchema),
    defaultValues: {
      id: type?.id ?? "",
      name: type?.name ?? "",
      slug: type?.slug ?? "",
      label: type?.label ?? "",
      description: type?.description ?? "",
      brokers: type?.brokers?.map(b => String(b.id)) ?? [],
    },
  })

  const mutation = useMutation(
    orpc.types.upsert.mutationOptions({
      onSuccess: data => {
        toast.success(`Type successfully ${type ? "updated" : "created"}`)
        queryClient.invalidateQueries({ queryKey: orpc.types.key() })
        router.push(`/admin/types/${data.id}`)
      },

      onError: error => {
        toast.error(error.message)
      },
    }),
  )

  const onSubmit = form.handleSubmit(data => mutation.mutate(data))

  useHotkeys([["mod+enter", () => onSubmit()]], [], true)

  const name = form.watch("name")

  // Set the slug based on the name
  useComputedField({
    form,
    sourceField: "name",
    computedField: "slug",
    callback: slugify,
    enabled: !type,
  })

  // Set the label based on the name
  useComputedField({
    form,
    sourceField: "name",
    computedField: "label",
    callback: name => name && `${name} Types`,
    enabled: !type,
  })

  return (
    <Form {...form}>
      <Stack className="justify-between">
        <H3 className="flex-1 truncate">{title}</H3>

        <Stack size="sm" className="-my-0.5">
          <AIGenerateDescription
            prompt={`Create a compelling description for the type named "${name}". Begin with a plural noun phrase (e.g., "Types for..." or "Resources that..."). Craft a single, concise sentence that clearly conveys the purpose and value of this type. Ensure the description is specific enough to differentiate this type from others while remaining broad enough to encompass all relevant items within it.`}
            schema={descriptionSchema}
            onStream={object => form.setValue("description", object.description)}
            disabled={!form.formState.isValid}
          />

          {type && <TypeActions type={type} size="md" />}
        </Stack>
      </Stack>

      <form
        onSubmit={onSubmit}
        className={cx("grid gap-4 @lg:grid-cols-2", className)}
        noValidate
        {...props}
      >
        <div className="grid gap-4 @lg:grid-cols-2">
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel data-required htmlFor={field.name}>
                  Name
                </FieldLabel>
                <Input id={field.name} data-1p-ignore {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="slug"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel data-required htmlFor={field.name}>
                  Slug
                </FieldLabel>
                <Input id={field.name} {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <Controller
          control={form.control}
          name="label"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Label</FieldLabel>
              <Input id={field.name} {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-full">
              <FieldLabel htmlFor={field.name}>Description</FieldLabel>
              <TextArea id={field.name} {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="brokers"
          render={({ field }) => (
            <Field className="col-span-full">
              <FieldLabel>Brokers</FieldLabel>
              <RelationSelector 
                relations={brokers.map(t => ({...t, id: String(t.id), name: t.broker_name || ''}))} 
                ids={field.value ?? []} 
                setIds={field.onChange} 
              />
            </Field>
          )}
        />

        <div className="flex justify-between gap-4 col-span-full">
          <Button size="md" variant="secondary" asChild>
            <Link href="/admin/types">Cancel</Link>
          </Button>

          <Button
            size="md"
            isPending={mutation.isPending}
            suffix={<Kbd variant="outline" keys={["meta", "enter"]} />}
          >
            {type ? "Update type" : "Create type"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
