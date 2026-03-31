"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useHotkeys } from "@mantine/hooks"
import { getRandomString, slugify } from "@primoui/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { type ComponentProps, useMemo } from "react"
import { Controller, FormProvider as Form, useForm } from "react-hook-form"
import { toast } from "sonner"
import { PostActions } from "~/app/admin/posts/_components/post-actions"
import { Button } from "~/components/common/button"
import { FormMedia } from "~/components/common/form-media"
import { Field, FieldError, FieldLabel } from "~/components/common/field"
import { H3 } from "~/components/common/heading"
import { Input } from "~/components/common/input"
import { Kbd } from "~/components/common/kbd"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { TextArea } from "~/components/common/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/common/select"
import { MarkdownEditor } from "~/components/admin/markdown-editor"
import { FAQField } from "~/components/admin/faq-field"
import { useComputedField } from "~/hooks/use-computed-field"
import { orpc } from "~/lib/orpc-query"
import { cx } from "~/lib/utils"
import type { findPostById } from "~/server/admin/posts/queries"
import { postSchema } from "~/server/admin/posts/schema"

type PostFormProps = ComponentProps<"form"> & {
  post?: NonNullable<Awaited<ReturnType<typeof findPostById>>>
}

export function PostForm({ className, title, post, ...props }: PostFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const form = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      id: post?.id ?? "",
      title: post?.title ?? "",
      slug: post?.slug ?? "",
      description: post?.description ?? "",
      content: post?.content ?? "",
      image: post?.image ?? "",
      status: post?.status ?? "Published",
      publishedAt: post?.publishedAt,
      authorId: post?.authorId ?? undefined,
      locale: post?.locale ?? "en",
      meta_title: post?.meta_title ?? "",
      meta_description: post?.meta_description ?? "",
      og_image: post?.og_image ?? "",
      faqs: post?.faqs?.map(faq => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        order: faq.order,
        isActive: faq.isActive ?? true
      })) ?? [],
    },
  })

  const mutation = useMutation(
    orpc.posts.upsert.mutationOptions({
      onSuccess: data => {
        toast.success(`Post successfully ${post ? "updated" : "created"}`)
        queryClient.invalidateQueries({ queryKey: orpc.posts.key() })
        router.push(`/admin/posts/${data.id}`)
      },

      onError: error => {
        toast.error(error.message)
      },
    }),
  )

  const onSubmit = form.handleSubmit(data => mutation.mutate(data))

  useHotkeys([["mod+enter", () => onSubmit()]], [], true)

  const [, slugValue] = form.watch(["title", "slug"])

  // Set the slug based on the title
  useComputedField({
    form,
    sourceField: "title",
    computedField: "slug",
    callback: slugify,
    enabled: !post,
  })

  const imagePath = useMemo(
    () => `posts/${slugValue || (post?.slug ?? getRandomString(12))}/image`,
    [slugValue, post?.slug],
  )

  return (
    <Form {...form}>
      <Stack className="justify-between">
        <H3 className="flex-1 truncate">{title}</H3>

        <Stack size="sm" className="-my-0.5">
          {post && <PostActions post={post} size="md" />}
        </Stack>
      </Stack>

      <form
        onSubmit={onSubmit}
        className={cx("grid gap-4", className)}
        noValidate
        {...props}
      >
        <div className="grid gap-4 @lg:grid-cols-2">
          <Controller
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel data-required htmlFor={field.name}>
                  Title
                </FieldLabel>
                <Input id={field.name} {...field} />
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

        <div className="grid gap-4 @lg:grid-cols-3">
          <Controller
            control={form.control}
            name="status"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="locale"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Locale</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder="Select locale" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="meta_title"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Meta Title</FieldLabel>
                <Input id={field.name} {...field} placeholder="Enter meta title for SEO" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="meta_description"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Meta Description</FieldLabel>
                <TextArea id={field.name} {...field} rows={3} placeholder="Enter meta description for SEO" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="og_image"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>OG Image</FieldLabel>
                <Input id={field.name} {...field} placeholder="Enter OG image URL" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="image"
            render={({ field, fieldState }) => (
              <Field className="col-span-full" data-invalid={fieldState.invalid}>
                <FieldLabel>Cover Image</FieldLabel>
                <FormMedia form={form} field={field} path={imagePath}>
                  {({ value }) =>
                    value ? (
                      <Image
                        src={value}
                        alt="Cover image preview"
                        width={800}
                        height={400}
                        className="w-full max-h-60 object-cover rounded-md border"
                      />
                    ) : null
                  }
                </FormMedia>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-full">
              <FieldLabel data-required htmlFor={field.name}>Description</FieldLabel>
              <TextArea id={field.name} {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="content"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-full">
              <FieldLabel data-required htmlFor={field.name}>Content (Markdown)</FieldLabel>
              <MarkdownEditor field={field} height={540} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* @ts-ignore */}
        <FAQField
          /* @ts-ignore */
          control={form.control}
          /* @ts-ignore */
          register={form.register}
          /* @ts-ignore */
          errors={form.formState.errors}
        />

        <div className="flex justify-between gap-4 col-span-full">
          <Button size="md" variant="secondary" asChild>
            <Link href="/admin/posts">Cancel</Link>
          </Button>

          <Button
            size="md"
            isPending={mutation.isPending}
            suffix={<Kbd variant="outline" keys={["meta", "enter"]} />}
          >
            {post ? "Update post" : "Create post"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
