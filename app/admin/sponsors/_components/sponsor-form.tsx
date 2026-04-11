"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useHotkeys } from "@mantine/hooks"
import { getRandomString, slugify } from "@primoui/utils"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { type ComponentProps, useMemo } from "react"
import { Controller, FormProvider as Form, useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import { SponsorActions } from "~/app/admin/sponsors/_components/sponsor-actions"
import { Button } from "~/components/common/button"
import { Field, FieldError, FieldLabel } from "~/components/common/field"
import { FormMedia } from "~/components/common/form-media"
import { H3 } from "~/components/common/heading"
import { Input } from "~/components/common/input"
import { Kbd } from "~/components/common/kbd"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { Switch } from "~/components/common/switch"
import { RelationSelector } from "~/components/common/relation-selector"
import { TextArea } from "~/components/common/textarea"
import { Trash, Plus } from "lucide-react"
import { orpc } from "~/lib/orpc-query"
import { useComputedField } from "~/hooks/use-computed-field"
import { cx } from "~/lib/utils"
import type { findSponsorById } from "~/server/admin/sponsors/queries"
import { sponsorSchema } from "~/server/admin/sponsors/schema"

type SponsorFormProps = ComponentProps<"form"> & {
  sponsor?: NonNullable<Awaited<ReturnType<typeof findSponsorById>>>
}

export function SponsorForm({ className, title, sponsor, ...props }: SponsorFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: categories = [] } = useQuery(orpc.categories.lookup.queryOptions())

  const form = useForm({
    resolver: zodResolver(sponsorSchema),
    defaultValues: {
      id: sponsor?.id ?? "",
      name: sponsor?.name ?? "",
      slug: sponsor?.slug ?? "",
      websiteUrl: sponsor?.websiteUrl ?? "",
      logoUrl: sponsor?.logoUrl ?? "",
      isActive: sponsor?.isActive ?? true,
      order: sponsor?.order ?? 0,
      categoryId: sponsor?.categoryId ?? "",
      title: sponsor?.title ?? "",
      description: sponsor?.description ?? "",
      bannerImage: sponsor?.bannerImage ?? "",
      highlightedPoint: sponsor?.highlightedPoint ?? "",
      features: sponsor?.features ?? [],
      socialProof: sponsor?.socialProof ?? "",  
      subtitle :sponsor?.subtitle??""
    },
  })

  const mutation = useMutation(
    orpc.sponsors.upsert.mutationOptions({
      onSuccess: data => {
        toast.success(`Sponsor successfully ${sponsor ? "updated" : "created"}`)
        queryClient.invalidateQueries({ queryKey: orpc.sponsors.key() })
        router.push(`/admin/sponsors/${data.id}`)
      },
      onError: error => {
        toast.error(error.message)
      },
    }),
  )

  const onSubmit = form.handleSubmit(data => mutation.mutate(data))

  useHotkeys([["mod+enter", () => onSubmit()]], [], true)

  // Set the slug based on the name
  useComputedField({
    form,
    sourceField: "name",
    computedField: "slug",
    callback: slugify,
    enabled: !sponsor,
  })

  const [name, websiteUrl] = form.watch(["name", "websiteUrl"])

  const path = useMemo(() => `sponsors/${name ? slugify(name) : getRandomString(12)}`, [name])

  return (
    <Form {...form}>
      <Stack className="justify-between">
        <H3 className="flex-1 truncate">{title}</H3>

        <Stack size="sm" className="-my-0.5">
          {sponsor && <SponsorActions sponsor={sponsor} size="md" />}
        </Stack>
      </Stack>

      <form
        onSubmit={onSubmit}
        className={cx("grid gap-4 @lg:grid-cols-2", className)}
        noValidate
        {...props}
      >
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

        <Controller
          control={form.control}
          name="websiteUrl"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Website URL
              </FieldLabel>
              <Input id={field.name} type="url" {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Title
              </FieldLabel>
              <Input id={field.name} {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
   <Controller
          control={form.control}
          name="subtitle"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Subtitle
              </FieldLabel>
              <Input id={field.name} {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="highlightedPoint"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Highlighted Point
              </FieldLabel>
              <Input id={field.name} {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="socialProof"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Social Proof
              </FieldLabel>
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
              <FieldLabel htmlFor={field.name}>
                Description
              </FieldLabel>
              <TextArea id={field.name} {...field} rows={4} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="logoUrl"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel data-required>Logo</FieldLabel>
              <FormMedia
                form={form}
                field={field}
                path={`${path}/logo`}
                fetchType="favicon"
                websiteUrl={websiteUrl}
              >
                {field.value && (
                  <Image
                    src={field.value}
                    alt="Logo"
                    width={100}
                    height={100}
                    className="h-16 w-auto border box-content rounded-md object-contain px-4 py-2 bg-foreground/5"
                  />
                )}
              </FormMedia>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="bannerImage"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Banner Image</FieldLabel>
              <FormMedia
                form={form}
                field={field}
                path={`${path}/banner`}
              >
                {field.value && (
                  <Image
                    src={field.value}
                    alt="Banner"
                    width={400}
                    height={200}
                    className="h-16 w-auto border rounded-md object-cover bg-foreground/5"
                  />
                )}
              </FormMedia>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <FeaturesField control={form.control} register={form.register} />

        <Controller
          control={form.control}
          name="order"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Order</FieldLabel>
              <Input id={field.name} type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="categoryId"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Category</FieldLabel>
              <RelationSelector
                relations={categories}
                ids={field.value ? [field.value] : []}
                setIds={ids => field.onChange(ids[0] || "")}
                multiple={false}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="isActive"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="flex-row items-center gap-2 pt-6">
              <Switch id={field.name} checked={field.value} onCheckedChange={field.onChange} />
              <FieldLabel htmlFor={field.name} className="mb-0">Active</FieldLabel>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="flex justify-between gap-4 col-span-full mt-4">
          <Button size="md" variant="secondary" asChild>
            <Link href="/admin/sponsors">Cancel</Link>
          </Button>

          <Button
            size="md"
            isPending={mutation.isPending}
            suffix={<Kbd variant="outline" keys={["meta", "enter"]} />}
          >
            {sponsor ? "Update sponsor" : "Create sponsor"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

function FeaturesField({ control, register }: { control: any, register: any }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  })

  return (
    <div className="col-span-full">
      <FieldLabel>Features</FieldLabel>
      <Stack className="mt-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <Input
              {...register(`features.${index}`)}
              placeholder="Enter feature"
              className="flex-1"
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => remove(index)}
              className="shrink-0"
            >
              <Trash className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => append("")}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Feature
        </Button>
      </Stack>
    </div>
  )
}
