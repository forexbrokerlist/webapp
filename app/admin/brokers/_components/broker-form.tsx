"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useHotkeys } from "@mantine/hooks"
import { formatDateTime, getRandomString, slugify } from "@primoui/utils"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { EyeIcon, InfoIcon, PencilIcon } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { type ComponentProps, useMemo, useRef, useState } from "react"
import { Controller, FormProvider as Form, useForm } from "react-hook-form"
import { toast } from "sonner"
import { type Brokers, ToolStatus, ToolTier } from "~/.generated/prisma/browser"
import { ToolActions } from "~/app/admin/brokers/_components/broker-actions"
import { ToolPublishActions } from "~/app/admin/brokers/_components/broker-publish-actions"
import { AIGenerateContent } from "~/components/admin/ai/generate-content"
import { AIRelationSuggestions } from "~/components/admin/ai/relation-suggestions"
import { Button } from "~/components/common/button"
import { Field, FieldError, FieldLabel } from "~/components/common/field"
import { FormMedia } from "~/components/common/form-media"
import { H3 } from "~/components/common/heading"
import { Hint } from "~/components/common/hint"
import { Input, inputVariants } from "~/components/common/input"
import { Link } from "~/components/common/link"
import { Note } from "~/components/common/note"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/common/select"
import { Switch } from "~/components/common/switch"
import { RelationSelector } from "~/components/common/relation-selector"
import { Stack } from "~/components/common/stack"
import { TextArea } from "~/components/common/textarea"
import { Tooltip } from "~/components/common/tooltip"
import { Markdown } from "~/components/web/markdown"
import { siteConfig } from "~/config/site"
import { useComputedField } from "~/hooks/use-computed-field"
import { orpc } from "~/lib/orpc-query"
import { isToolApproved } from "~/lib/tools"
import { cx } from "~/lib/utils"
import { contentSchema } from "~/server/admin/shared/schema"
import type { findBrokerById } from "~/server/admin/brokers/queries"
import { brokerSchema } from "~/server/admin/brokers/schema"

const ToolStatusChange = ({ broker }: { broker: Brokers }) => {
  return (
    <>
      <Link href={`/${broker.slug}`} target="_blank" className="font-semibold underline inline-block">
        {broker.broker_name || ''}
      </Link>{" "}
      is now {broker.status.toLowerCase()}.{" "}
      {broker.status === "Scheduled" && (
        <>
          Will be published on {formatDateTime(broker.publishedAt ?? new Date(), "long")} (
          {Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/^.+\//, "")}).
        </>
      )}
    </>
  )
}

type ToolFormProps = ComponentProps<"form"> & {
  broker?: NonNullable<Awaited<ReturnType<typeof findBrokerById>>>
}

export function ToolForm({ className, title, broker, ...props }: ToolFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: categories = [] } = useQuery(orpc.categories.lookup.queryOptions())
  const { data: subcategories = [] } = useQuery(orpc.subcategories.lookup.queryOptions())
  const { data: tags = [] } = useQuery(orpc.tags.lookup.queryOptions())
  const { data: types = [] } = useQuery(orpc.types.lookup.queryOptions())
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [isStatusPending, setIsStatusPending] = useState(false)
  const [isGenerationComplete, setIsGenerationComplete] = useState(true)
  const originalStatus = useRef(broker?.status ?? ToolStatus.Draft)

  const form = useForm({
    resolver: zodResolver(brokerSchema),
    defaultValues: {
      id: broker?.id,
      broker_name: broker?.broker_name ?? "",
      slug: broker?.slug ?? "",
      broker_website: broker?.broker_website ?? "",
      overall_rating: broker?.overall_rating ?? "",
      description: broker?.description ?? "",
      headquarters: broker?.headquarters ?? "",
      year_established: broker?.year_established ?? null,
      regulators: broker?.regulators ?? "",
      minimum_deposit: broker?.minimum_deposit ?? "",
      execution_types: broker?.execution_types ?? "",
      trading_platforms: broker?.trading_platforms ?? "",
      funding_methods: broker?.funding_methods ?? "",
      deposit_options: broker?.deposit_options ?? "",
      withdrawal_options: broker?.withdrawal_options ?? "",
      deposit_fees: broker?.deposit_fees ?? "",
      withdrawal_fee: broker?.withdrawal_fee ?? "",
      inactivity_fee: broker?.inactivity_fee ?? "",
      profit_share: broker?.profit_share ?? "",
      retail_loss_rate: broker?.retail_loss_rate ?? "",
      pros: broker?.pros ?? "",
      cons: broker?.cons ?? "",
      submitterName: broker?.submitterName ?? "",
      submitterEmail: broker?.submitterEmail ?? "",
      submitterNote: broker?.submitterNote ?? "",
      status: broker?.status ?? ToolStatus.Draft,
      publishedAt: broker?.publishedAt ?? undefined,
      notifySubmitter: true,
      categoryIds: broker?.categories?.map(c => c.id) ?? [],
      subcategoryIds: broker?.subcategories?.map(s => s.id) ?? [],
      tagIds: broker?.tags?.map((t: { id: string }) => t.id) ?? [],
      maximum_evaluation_fee: broker?.maximum_evaluation_fee ?? "",
      daily_loss_limit: broker?.daily_loss_limit ?? "",
      minimum_raw_spreads: broker?.minimum_raw_spreads ?? "",
      minimum_standard_spreads: broker?.minimum_standard_spreads ?? "",
      minimum_commission_for_forex: broker?.minimum_commission_for_forex ?? "",
      average_trading_cost_eur_usd: broker?.average_trading_cost_eur_usd ?? "",
      average_trading_cost_gbp_usd: broker?.average_trading_cost_gbp_usd ?? "",
      average_trading_cost_gold: broker?.average_trading_cost_gold ?? "",
      average_trading_cost_bitcoin: broker?.average_trading_cost_bitcoin ?? "",
      average_trading_cost_wti_crude_oil: broker?.average_trading_cost_wti_crude_oil ?? "",
      subtitle: broker?.subtitle ?? "",
      screenshotUrl: broker?.screenshotUrl ?? "",
      bannerUrl: broker?.bannerUrl ?? "",
    
      typeId: broker?.typeId ?? undefined,
      isSponsor: broker?.isSponsor ?? false,
      isMainSponsor: broker?.isMainSponsor ?? false,
    },
  })

  const mutation = useMutation(
    orpc.brokers.upsert.mutationOptions({
      onSuccess: data => {
        if (data.status !== originalStatus.current) {
          toast.success(<ToolStatusChange broker={data} />)
          originalStatus.current = data.status
        } else {
          toast.success(`Broker successfully ${broker ? "updated" : "created"}`)
        }

        queryClient.invalidateQueries({ queryKey: orpc.brokers.key() })
        router.push(`/admin/brokers/${data.id}`)
      },

      onError: error => {
        toast.error(error.message)
      },

      onSettled: () => {
        setIsStatusPending(false)
      },
    }),
  )

  useHotkeys([["mod+enter", () => form.handleSubmit(data => mutation.mutate(data))()]], [], true)

  // Set the slug based on the name
  useComputedField({
    form,
    sourceField: "broker_name",
    computedField: "slug",
    callback: slugify,
    enabled: !broker,
  })

  // Keep track of the form values
  const [broker_name, slug, broker_website, description, subtitle, screenshotUrl] = form.watch([
    "broker_name",
    "slug",
    "broker_website",
    "description",
    "subtitle",
    "screenshotUrl",
  ])

  // Store the upload path in a memoized value
  const path = useMemo(() => `brokers/${slug || getRandomString(12)}`, [slug])

  // Handle form submission
  const handleSubmit = form.handleSubmit((data, event) => {
    const submitter = (event?.nativeEvent as SubmitEvent)?.submitter
    const isStatusChange = submitter?.getAttribute("name") !== "submit"

    if (isStatusChange) {
      setIsStatusPending(true)
    }

    mutation.mutate(data)
  })

  // Handle status change
  const handleStatusSubmit = (status: ToolStatus, publishedAt: Date | null) => {
    // Update form values
    form.setValue("status", status)
    form.setValue("publishedAt", publishedAt)

    // Submit the form with updated values
    handleSubmit()
  }

  return (
    <Form {...form}>
      <Stack className="justify-between">
        <H3 className="flex-1 truncate">{title}</H3>

        <Stack size="sm" className="-my-0.5">
          <AIGenerateContent
            url={broker_website || ''}
            schema={contentSchema}
            onGenerate={() => setIsGenerationComplete(false)}
            onFinish={() => setIsGenerationComplete(true)}
            onStream={object => {
              form.setValue("subtitle", object.tagline)
              form.setValue("description", object.description)
            }}
          />

          {broker && <ToolActions tool={broker as any} size="md" />}
        </Stack>

        {broker && (
          <Note className="w-full">
            <Link href={`/${broker.slug}`} target="_blank" className="text-primary underline">
              {siteConfig.url}/{broker.slug}
            </Link>

            {isToolApproved(broker as any) && broker.publishedAt && (
              <>
                <br />
                {broker.status === ToolStatus.Scheduled
                  ? "Scheduled to be published"
                  : "Published"}{" "}
                on <strong className="text-foreground">{formatDateTime(broker.publishedAt)}</strong>
              </>
            )}
          </Note>
        )}
      </Stack>

      <form
        onSubmit={handleSubmit}
        className={cx("grid gap-4 @lg:grid-cols-2", className)}
        noValidate
        {...props}
      >
        <Controller
          control={form.control}
          name="broker_name"
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
          name="typeId"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Type</FieldLabel>
              <Select value={field.value ?? ""} onValueChange={(val) => field.onChange(val || undefined)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
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
          name="isSponsor"
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Sponsor</FieldLabel>
              <div className="flex items-center gap-3">
                <Switch
                  id={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <span className="text-sm text-muted-foreground">
                  {field.value ? "Yes" : "No"}
                </span>
              </div>
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="isMainSponsor"
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Main Sponsor</FieldLabel>
              <div className="flex items-center gap-3">
                <Switch
                  id={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <span className="text-sm text-muted-foreground">
                  {field.value ? "Yes" : "No"}
                </span>
              </div>
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="categoryIds"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Categories</FieldLabel>
              <RelationSelector
                relations={categories}
                ids={field.value ?? []}
                setIds={field.onChange}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="subcategoryIds"
          render={({ field, fieldState }) => {
            const selectedCategoryIds = form.watch("categoryIds") ?? []
            const filteredSubcategories = subcategories.filter(s =>
              selectedCategoryIds.length === 0 || selectedCategoryIds.includes(s.categoryId)
            )

            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Subcategories</FieldLabel>
                <RelationSelector
                  relations={filteredSubcategories}
                  ids={field.value ?? []}
                  setIds={field.onChange}
                />
                <Hint>Only subcategories of selected categories are shown (if any are selected).</Hint>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )
          }}
        />

        <Controller
          control={form.control}
          name="tagIds"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-full">
              <FieldLabel htmlFor={field.name}>Tags</FieldLabel>
              <RelationSelector
                relations={tags}
                ids={field.value ?? []}
                setIds={field.onChange}
              />
              <Hint>Select any relevant tags for this broker.</Hint>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="status"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Status</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ToolStatus.Draft}>Draft</SelectItem>
                  <SelectItem value={ToolStatus.Pending}>Pending</SelectItem>
                  <SelectItem value={ToolStatus.Scheduled}>Scheduled</SelectItem>
                  <SelectItem value={ToolStatus.Published}>Published</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />


        <Controller
          control={form.control}
          name="publishedAt"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Published At</FieldLabel>
              <Input
                id={field.name}
                type="datetime-local"
                value={field.value ? (field.value instanceof Date ? field.value.toISOString().slice(0, 16) : new Date(field.value as string).toISOString().slice(0, 16)) : ''}
                onChange={(e) => field.onChange(e.target.value || null)}
                className={fieldState.invalid ? "border-red-500" : ""}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="broker_website"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel data-required htmlFor={field.name}>
                Website URL
              </FieldLabel>
              <Input id={field.name} type="url" {...field} value={field.value || ''} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="screenshotUrl"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Screenshot URL</FieldLabel>
              <FormMedia
                form={form}
                field={field}
                path={`${path}/screenshot`}
                fetchType="screenshot"
                websiteUrl={broker_website}
              >
                {field.value && (
                  <Image
                    src={field.value}
                    alt="Screenshot"
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

        {(!screenshotUrl || screenshotUrl.trim() === '') && (
          <Controller
            control={form.control}
            name="bannerUrl"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Banner URL (Fallback)</FieldLabel>
                <FormMedia
                  form={form}
                  field={field}
                  path={`${path}/banner`}
                  fetchType="screenshot"
                  websiteUrl={broker_website}
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
                <Hint>Used when no screenshot is available</Hint>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        )}

        <Controller
          control={form.control}
          name="overall_rating"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Overall Rating</FieldLabel>
              <Input id={field.name} {...field} value={field.value || ''} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="year_established"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Year Established</FieldLabel>
              <Input id={field.name} type="number" {...field} value={field.value || ''} onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {([
          { name: "headquarters", label: "Headquarters" },
          { name: "regulators", label: "Regulators" },
          { name: "minimum_deposit", label: "Minimum Deposit" },
          { name: "execution_types", label: "Execution Types" },
          { name: "trading_platforms", label: "Trading Platforms" },
          { name: "funding_methods", label: "Funding Methods" },
          { name: "deposit_options", label: "Deposit Options" },
          { name: "withdrawal_options", label: "Withdrawal Options" },
          { name: "deposit_fees", label: "Deposit Fees" },
          { name: "withdrawal_fee", label: "Withdrawal Fee" },
          { name: "inactivity_fee", label: "Inactivity Fee" },
          { name: "profit_share", label: "Profit Share" },
          { name: "retail_loss_rate", label: "Retail Loss Rate" },
          { name: "maximum_evaluation_fee", label: "Max Evaluation Fee" },
          { name: "daily_loss_limit", label: "Daily Loss Limit" },
          { name: "minimum_raw_spreads", label: "Min Raw Spreads" },
          { name: "minimum_standard_spreads", label: "Min Standard Spreads" },
          { name: "minimum_commission_for_forex", label: "Min Commission (Forex)" },
          { name: "average_trading_cost_eur_usd", label: "Avg Cost (EUR/USD)" },
          { name: "average_trading_cost_gbp_usd", label: "Avg Cost (GBP/USD)" },
          { name: "average_trading_cost_gold", label: "Avg Cost (Gold)" },
          { name: "average_trading_cost_bitcoin", label: "Avg Cost (Bitcoin)" },
          { name: "average_trading_cost_wti_crude_oil", label: "Avg Cost (WTI Crude Oil)" },
        ] as const).map((f) => (
          <Controller
            key={f.name}
            control={form.control}
            name={f.name}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>{f.label}</FieldLabel>
                <Input id={field.name} {...field} value={field.value || ''} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        ))}

        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-full">
              <Stack className="w-full justify-between">
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>
              </Stack>
              <TextArea id={field.name} {...field} value={field.value || ''} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="subtitle"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-full">
              <FieldLabel htmlFor={field.name}>Subtitle</FieldLabel>
              <Input id={field.name} {...field} value={field.value || ''} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="pros"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-full">
              <Stack className="w-full justify-between">
                <FieldLabel htmlFor={field.name}>Pros</FieldLabel>
              </Stack>
              <TextArea id={field.name} {...field} value={field.value || ''} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="cons"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-full">
              <Stack className="w-full justify-between">
                <FieldLabel htmlFor={field.name}>Cons</FieldLabel>
              </Stack>
              <TextArea id={field.name} {...field} value={field.value || ''} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {broker?.submitterEmail && (
          <>
            <Controller
              control={form.control}
              name="submitterName"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Submitter Name</FieldLabel>
                  <Input id={field.name} {...field} value={field.value || ''} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="submitterEmail"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Submitter Email</FieldLabel>
                  <Input id={field.name} type="email" data-1p-ignore {...field} value={field.value || ''} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="submitterNote"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="col-span-full">
                  <FieldLabel htmlFor={field.name}>Submitter Note</FieldLabel>
                  <Input id={field.name} {...field} value={field.value || ''} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </>
        )}

        <div className="flex justify-between gap-4 col-span-full">
          <Button size="md" variant="secondary" asChild>
            <Link href="/admin/brokers">Cancel</Link>
          </Button>

          <ToolPublishActions
            toolStatus={broker?.status ?? ToolStatus.Draft}
            isPending={!isStatusPending && mutation.isPending}
            isStatusPending={isStatusPending}
            onStatusSubmit={handleStatusSubmit}
          />
        </div>
      </form>
    </Form>
  )
}
