"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useHotkeys } from "@mantine/hooks"
import { slugify } from "@primoui/utils"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import type { ComponentProps } from "react"
import { Controller, FormProvider as Form, useForm } from "react-hook-form"
import { toast } from "sonner"
import { SubcategoryActions } from "~/app/admin/subcategories/_components/subcategory-actions"
import { AIGenerateDescription } from "~/components/admin/ai/generate-description"
import { Button } from "~/components/common/button"
import { Field, FieldError, FieldLabel } from "~/components/common/field"
import { H3 } from "~/components/common/heading"
import { Input } from "~/components/common/input"
import { Kbd } from "~/components/common/kbd"
import { Link } from "~/components/common/link"
import { RelationSelector } from "~/components/common/relation-selector"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/common/select"
import { Stack } from "~/components/common/stack"
import { TextArea } from "~/components/common/textarea"
import { useComputedField } from "~/hooks/use-computed-field"
import { orpc } from "~/lib/orpc-query"
import { cx } from "~/lib/utils"
import type { findSubcategoryById } from "~/server/admin/subcategories/queries"
import { subcategorySchema } from "~/server/admin/subcategories/schema"
import { descriptionSchema } from "~/server/admin/shared/schema"

type SubcategoryFormProps = ComponentProps<"form"> & {
  subcategory?: NonNullable<Awaited<ReturnType<typeof findSubcategoryById>>>
}

export function SubcategoryForm({ className, title, subcategory, ...props }: SubcategoryFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: tools = [] } = useQuery(orpc.brokers.lookup.queryOptions())
  const { data: categories = [] } = useQuery(orpc.categories.lookup.queryOptions())

  const form = useForm({
    resolver: zodResolver(subcategorySchema),
    defaultValues: {
      id: subcategory?.id ?? "",
      name: subcategory?.name ?? "",
      slug: subcategory?.slug ?? "",
      label: subcategory?.label ?? "",
      description: subcategory?.description ?? "",
      categoryId: subcategory?.categoryId ?? "",
      tools: subcategory?.tools.map((t: { id: string }) => t.id) ?? [],
    },
  })

  const mutation = useMutation(
    orpc.subcategories.upsert.mutationOptions({
      onSuccess: data => {
        toast.success(`Subcategory successfully ${subcategory ? "updated" : "created"}`)
        queryClient.invalidateQueries({ queryKey: orpc.subcategories.key() })
        router.push(`/admin/subcategories/${data.id}`)
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
    enabled: !subcategory,
  })

  // Set the label based on the name
  useComputedField({
    form,
    sourceField: "name",
    computedField: "label",
    callback: name => name && `${name} Tools`,
    enabled: !subcategory,
  })

  return (
    <Form {...form}>
      <Stack className="justify-between">
        <H3 className="flex-1 truncate">{title}</H3>

        <Stack size="sm" className="-my-0.5">
          <AIGenerateDescription
            prompt={`Create a compelling description for the subcategory named "${name}". Begin with a plural noun phrase (e.g., "Tools for..." or "Resources that..."). Craft a single, concise sentence that clearly conveys the purpose and value of this subcategory. Ensure the description is specific enough to differentiate this subcategory from others while remaining broad enough to encompass all relevant items within it.`}
            schema={descriptionSchema}
            onStream={object => form.setValue("description", object.description)}
            disabled={!form.formState.isValid}
          />

          {subcategory && <SubcategoryActions subcategory={subcategory} size="md" />}
        </Stack>
      </Stack>

      <form
        onSubmit={onSubmit}
        className={cx("grid gap-4 @lg:grid-cols-2", className)}
        noValidate
        {...props}
      >
        <div className="grid gap-4 @lg:grid-cols-2 col-span-full">
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
          name="categoryId"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel data-required htmlFor={field.name}>
                Parent Category
              </FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id={field.name}>
                  <SelectValue placeholder="Select a parent category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c: { id: string, name: string }) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
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
          name="tools"
          render={({ field }) => (
            <Field className="col-span-full">
              <FieldLabel>Tools</FieldLabel>
              <RelationSelector relations={tools.map((t: { id: string | number, broker_name: string | null }) => ({...t, id: String(t.id), name: t.broker_name || ''}))} ids={field.value ?? []} setIds={field.onChange} />
            </Field>
          )}
        />

        <div className="flex justify-between gap-4 col-span-full">
          <Button size="md" variant="secondary" asChild>
            <Link href="/admin/subcategories">Cancel</Link>
          </Button>

          <Button
            size="md"
            isPending={mutation.isPending}
            suffix={<Kbd variant="outline" keys={["meta", "enter"]} />}
          >
            {subcategory ? "Update subcategory" : "Create subcategory"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
