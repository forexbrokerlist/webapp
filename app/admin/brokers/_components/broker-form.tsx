"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useHotkeys } from "@mantine/hooks"
import { formatDateTime, getRandomString, slugify } from "@primoui/utils"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { EyeIcon, InfoIcon, PencilIcon, Trash, Plus, Copy } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { type ComponentProps, useMemo, useRef, useState } from "react"
import { Controller, FormProvider as Form, useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import { type Brokers, ToolStatus, ToolTier, DeploymentType, BusinessSize, SupportChannel, PricingModel, LearningFormat, SkillLevel, ProviderType } from "~/.generated/prisma/browser"
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
      company_name: broker?.company_name ?? "",
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
      logoUrl: broker?.logoUrl ?? "",
      typeId: broker?.typeId ?? undefined,
      isSponsor: broker?.isSponsor ?? false,
      isMainSponsor: broker?.isMainSponsor ?? false,
      features: broker?.features ?? [],
      socialProof: broker?.socialProof ?? "",
      highlightedPoint: broker?.highlightedPoint ?? "",
      maxLeverage: broker?.maxLeverage ?? "",
      totalInstruments: broker?.totalInstruments ?? "",
      availableInIndia: broker?.availableInIndia ?? false,
      islamicAccount: broker?.islamicAccount ?? false,
      demoAccount: broker?.demoAccount ?? false,
      copyTrading: broker?.copyTrading ?? false,
      accountTypes: broker?.accountTypes ?? [],
      beginner_friendly: broker?.beginner_friendly ?? false,
      review_article: broker?.review_article ?? "",
      seo_title: broker?.seo_title ?? "",
      seo_meta_description: broker?.seo_meta_description ?? "",
      newer_traders_rating: broker?.newer_traders_rating ?? null,
      scalpers_rating: broker?.scalpers_rating ?? null,
      swing_traders_rating: broker?.swing_traders_rating ?? null,
      news_traders_rating: broker?.news_traders_rating ?? null,
      day_traders_rating: broker?.day_traders_rating ?? null,
      copy_traders_rating: broker?.copy_traders_rating ?? null,
      automated_traders_rating: broker?.automated_traders_rating ?? null,
      investors_rating: broker?.investors_rating ?? null,
      faqs: broker?.faqs ?? [],
      deployment_type: broker?.deployment_type ?? DeploymentType.Both,
      starting_price: broker?.starting_price ?? "",
      bestFor: broker?.bestFor ?? [],
      free_trial_available: broker?.free_trial_available ?? false,
      api_access: broker?.api_access ?? false,
      support_channels: broker?.support_channels ?? [],
      support_hours: broker?.support_hours ?? "",
      languages_supported: broker?.languages_supported ?? [],
      pricingModel: broker?.pricingModel ?? PricingModel.MonthlySaas,
      provider_type: broker?.provider_type ?? ProviderType.OnlineAcademy,
      skill_level: broker?.skill_level ?? [],
      learning_format: broker?.learning_format ?? [],
      topics_covered: broker?.topics_covered ?? [],
      outcomes: broker?.outcomes ?? [],
      certificate_available: broker?.certificate_available ?? false,
      community_access: broker?.community_access ?? false,
      mentorship_available: broker?.mentorship_available ?? false,
      courseModules: broker?.courseModules ?? [],
      // platformIntegrations: broker?.platformIntegrations ?? [],
      // keyFeatures: broker?.keyFeatures ?? [],
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
          name="company_name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Company Name</FieldLabel>
              <Input id={field.name} {...field} value={field.value || ''} />
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
          name="availableInIndia"
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Available In India</FieldLabel>
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
          name="islamicAccount"
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Islamic Account</FieldLabel>
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
          name="demoAccount"
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Demo Account</FieldLabel>
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
          name="copyTrading"
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Copy Trading</FieldLabel>
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
              <FormMedia
                form={form}
                field={field}
                path={`${path}/screenshot`}
                fetchType="screenshot"
                websiteUrl={broker_website}
              >
                {({ value }) => value && (
                  <Image
                    src={value}
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

        <Controller
          control={form.control}
          name="logoUrl"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FormMedia
                form={form}
                field={field}
                path={`${path}/logo`}
                fetchType="favicon"
                websiteUrl={broker_website}
              >
                {({ value }) => value && (
                  <Image
                    src={value}
                    alt="Logo"
                    width={120}
                    height={60}
                    className="h-16 w-auto border rounded-md object-contain bg-foreground/5 p-1"
                  />
                )}
              </FormMedia>
              <Hint>Fetches logo from Google Favicons, enhances &amp; stores in the protected DO Spaces bucket.</Hint>
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
                  {({ value }) => value && (
                    <Image
                      src={value}
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
          { name: "maxLeverage", label: "Max Leverage" },
          { name: "totalInstruments", label: "Total Instruments" },
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

        <FeaturesField control={form.control} register={form.register} />
        <AccountTypesField control={form.control} register={form.register} />
        <LanguagesSupportedField control={form.control} register={form.register} />
        <FAQsField control={form.control} register={form.register} />
        <CourseModulesField control={form.control} register={form.register} />





        <div className="col-span-full pt-4 border-t mt-4">
          <H3>Service & Support</H3>
          <Hint>Details about deployment, pricing, and support channels</Hint>
        </div>

        <Controller
          control={form.control}
          name="deployment_type"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Deployment Type</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(DeploymentType).map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="starting_price"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Starting Price</FieldLabel>
              <Input id={field.name} {...field} value={field.value || ''} placeholder="e.g. $50/mo or Free" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="pricingModel"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Pricing Model</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PricingModel).map((model) => (
                    <SelectItem key={model} value={model}>{model}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="provider_type"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Provider Type</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ProviderType).map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="support_hours"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Support Hours</FieldLabel>
              <Input id={field.name} {...field} value={field.value || ''} placeholder="e.g. 24/7 or Business Hours" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="free_trial_available"
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Free Trial Available</FieldLabel>
              <div className="flex items-center gap-3">
                <Switch
                  id={field.name}
                  checked={field.value || false}
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
          name="api_access"
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>API Access</FieldLabel>
              <div className="flex items-center gap-3">
                <Switch
                  id={field.name}
                  checked={field.value || false}
                  onCheckedChange={field.onChange}
                />
                <span className="text-sm text-muted-foreground">
                  {field.value ? "Yes" : "No"}
                </span>
              </div>
            </Field>
          )}
        />
        <OutcomesField control={form.control} register={form.register} />

        <div className="col-span-full grid grid-cols-1 @lg:grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name="bestFor"
            render={({ field }) => (
              <Field>
                <FieldLabel>Best For (Business Size)</FieldLabel>
                <div className="flex flex-wrap gap-4 mt-2">
                  {Object.values(BusinessSize).map((size) => (
                    <label key={size} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                        checked={field.value?.includes(size)}
                        onChange={(e) => {
                          const currentValues = field.value || []
                          if (e.target.checked) {
                            field.onChange([...currentValues, size])
                          } else {
                            field.onChange(currentValues.filter((v: any) => v !== size))
                          }
                        }}
                      />
                      <span className="text-sm">{size}</span>
                    </label>
                  ))}
                </div>
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="support_channels"
            render={({ field }) => (
              <Field>
                <FieldLabel>Support Channels</FieldLabel>
                <div className="flex flex-wrap gap-4 mt-2">
                  {Object.values(SupportChannel).map((channel) => (
                    <label key={channel} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                        checked={field.value?.includes(channel)}
                        onChange={(e) => {
                          const currentValues = field.value || []
                          if (e.target.checked) {
                            field.onChange([...currentValues, channel])
                          } else {
                            field.onChange(currentValues.filter((v: any) => v !== channel))
                          }
                        }}
                      />
                      <span className="text-sm">{channel}</span>
                    </label>
                  ))}
                </div>
              </Field>
            )}
          />
        </div>

        <Controller
          control={form.control}
          name="highlightedPoint"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-full">
              <FieldLabel htmlFor={field.name}>Highlighted Point</FieldLabel>
              <Input id={field.name} {...field} value={field.value || ''} placeholder="Enter highlighted point" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="socialProof"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-full">
              <FieldLabel htmlFor={field.name}>Social Proof</FieldLabel>
              <TextArea id={field.name} {...field} value={field.value || ''} placeholder="Enter social proof (testimonials, user count, etc.)" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="beginner_friendly"
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Beginner Friendly</FieldLabel>
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
          name="review_article"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-full">
              <FieldLabel htmlFor={field.name}>Review Article</FieldLabel>
              <TextArea id={field.name} {...field} value={field.value || ''} placeholder="Add a detailed review or article content..." />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="seo_title"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-full">
              <FieldLabel htmlFor={field.name}>SEO Title</FieldLabel>
              <Input id={field.name} {...field} value={field.value || ''} placeholder="Enter SEO optimized title" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="seo_meta_description"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-full">
              <FieldLabel htmlFor={field.name}>SEO Meta Description</FieldLabel>
              <TextArea id={field.name} {...field} value={field.value || ''} placeholder="Enter meta description for search engines" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="col-span-full pt-4 border-t mt-4">
          <H3>Education & Learning</H3>
          <Hint>Educational content, learning formats, and additional features</Hint>
        </div>

        <Controller
          control={form.control}
          name="skill_level"
          render={({ field }) => (
            <Field>
              <FieldLabel>Skill Level</FieldLabel>
              <div className="flex flex-wrap gap-4 mt-2">
                {Object.values(SkillLevel).map((level) => (
                  <label key={level} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                      checked={field.value?.includes(level)}
                      onChange={(e) => {
                        const currentValues = field.value || []
                        if (e.target.checked) {
                          field.onChange([...currentValues, level])
                        } else {
                          field.onChange(currentValues.filter((v: any) => v !== level))
                        }
                      }}
                    />
                    <span className="text-sm">{level}</span>
                  </label>
                ))}
              </div>
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="learning_format"
          render={({ field }) => (
            <Field>
              <FieldLabel>Learning Format</FieldLabel>
              <div className="flex flex-wrap gap-4 mt-2">
                {Object.values(LearningFormat).map((format) => (
                  <label key={format} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                      checked={field.value?.includes(format)}
                      onChange={(e) => {
                        const currentValues = field.value || []
                        if (e.target.checked) {
                          field.onChange([...currentValues, format])
                        } else {
                          field.onChange(currentValues.filter((v: any) => v !== format))
                        }
                      }}
                    />
                    <span className="text-sm">{format}</span>
                  </label>
                ))}
              </div>
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="topics_covered"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-full">
              <FieldLabel htmlFor={field.name}>Topics Covered</FieldLabel>
              <TextArea id={field.name} {...field} value={field.value || ''} placeholder="Enter topics covered, separated by commas" />
              <Hint>Separate topics with commas (e.g., Technical Analysis, Risk Management, Trading Psychology)</Hint>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />



        <Controller
          control={form.control}
          name="certificate_available"
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Certificate Available</FieldLabel>
              <div className="flex items-center gap-3">
                <Switch
                  id={field.name}
                  checked={field.value || false}
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
          name="community_access"
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Community Access</FieldLabel>
              <div className="flex items-center gap-3">
                <Switch
                  id={field.name}
                  checked={field.value || false}
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
          name="mentorship_available"
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Mentorship Available</FieldLabel>
              <div className="flex items-center gap-3">
                <Switch
                  id={field.name}
                  checked={field.value || false}
                  onCheckedChange={field.onChange}
                />
                <span className="text-sm text-muted-foreground">
                  {field.value ? "Yes" : "No"}
                </span>
              </div>
            </Field>
          )}
        />

        <div className="col-span-full pt-4">
          <H3>Trader Ratings</H3>
          <Hint>Ratings for different trader profiles (0-5)</Hint>
        </div>

        {([
          { name: "newer_traders_rating", label: "Newer Traders Rating" },
          { name: "scalpers_rating", label: "Scalpers Rating" },
          { name: "swing_traders_rating", label: "Swing Traders Rating" },
          { name: "news_traders_rating", label: "News Traders Rating" },
          { name: "day_traders_rating", label: "Day Traders Rating" },
          { name: "copy_traders_rating", label: "Copy Traders Rating" },
          { name: "automated_traders_rating", label: "Automated Traders Rating" },
          { name: "investors_rating", label: "Investors Rating" },
        ] as const).map((f) => (
          <Controller
            key={f.name}
            control={form.control}
            name={f.name}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>{f.label}</FieldLabel>
                <Input
                  id={field.name}
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        ))}
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
          <Button size="md" variant="normal" asChild>
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
    </Form >
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
          variant="normal"
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

function AccountTypesField({ control, register }: { control: any, register: any }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "accountTypes",
  })

  return (
    <div className="col-span-full">
      <FieldLabel>Account Types</FieldLabel>
      <Stack className="mt-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <Input
              {...register(`accountTypes.${index}`)}
              placeholder="Enter account type"
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
          variant="normal"
          size="sm"
          onClick={() => append("")}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Account Type
        </Button>
      </Stack>
    </div>
  )
}

function OutcomesField({ control, register }: { control: any, register: any }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "outcomes",
  })

  return (
    <div className="col-span-full">
      <FieldLabel>What You'll Learn</FieldLabel>
      <Stack className="mt-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <Input
              {...register(`outcomes.${index}`)}
              placeholder="Enter learning outcome"
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
          variant="normal"
          size="sm"
          onClick={() => append("")}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add What You'll Learn
        </Button>
      </Stack>
    </div>
  )
}

function FAQsField({ control, register }: { control: any, register: any }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "faqs",
  })

  return (
    <div className="col-span-full">
      <FieldLabel>FAQs</FieldLabel>
      <Stack className="mt-2">
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-start bg-muted/20 p-3 rounded-lg border border-border/50">
            <div className="space-y-1">
              <FieldLabel className="text-xs">Question</FieldLabel>
              <Input
                {...register(`faqs.${index}.question`)}
                placeholder="Enter question"
                className="w-full"
              />
            </div>
            <div className="space-y-1">
              <FieldLabel className="text-xs">Answer</FieldLabel>
              <TextArea
                {...register(`faqs.${index}.answer`)}
                placeholder="Enter answer"
                className="w-full min-h-[40px]"
              />
            </div>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => remove(index)}
              className="shrink-0 mt-6"
            >
              <Trash className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="normal"
          size="sm"
          onClick={() => append({ question: "", answer: "" })}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add FAQ
        </Button>
      </Stack>
    </div>
  )
}

function LanguagesSupportedField({ control, register }: { control: any, register: any }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "languages_supported",
  })

  return (
    <div className="col-span-full">
      <FieldLabel>Languages Supported</FieldLabel>
      <Stack className="mt-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <Input
              {...register(`languages_supported.${index}`)}
              placeholder="Enter language"
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
          variant="normal"
          size="sm"
          onClick={() => append("")}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Language
        </Button>
      </Stack>
    </div>
  )
}

function CourseModulesField({ control, register }: { control: any, register: any }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "courseModules",
  })

  return (
    <div className="col-span-full">
      <FieldLabel>Course Modules</FieldLabel>
      <Stack className="mt-2">
        {fields.map((field, index) => (
          <div key={field.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Module {index + 1}</h4>
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
            <div className="grid grid-cols-1 @lg:grid-cols-2 gap-3">
              <div>
                <FieldLabel htmlFor={`courseModules.${index}.title`}>Title</FieldLabel>
                <Input
                  {...register(`courseModules.${index}.title`)}
                  placeholder="Enter module title"
                />
              </div>
              <div>
                <FieldLabel htmlFor={`courseModules.${index}.difficulty`}>Difficulty</FieldLabel>
                <Select
                  {...register(`courseModules.${index}.difficulty`)}
                  onValueChange={(value) => {
                    const event = { target: { value } }
                    register(`courseModules.${index}.difficulty`).onChange(event)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <FieldLabel htmlFor={`courseModules.${index}.duration`}>Duration</FieldLabel>
                <Input
                  {...register(`courseModules.${index}.duration`)}
                  placeholder="e.g., 2 hours, 1 week"
                />
              </div>
              <div>
                <FieldLabel htmlFor={`courseModules.${index}.order`}>Order</FieldLabel>
                <Input
                  {...register(`courseModules.${index}.order`)}
                  type="number"
                  placeholder="Module order"
                  onChange={(e) => {
                    const value = e.target.value ? parseInt(e.target.value) : ''
                    const event = { target: { value } }
                    register(`courseModules.${index}.order`).onChange(event)
                  }}
                />
              </div>
            </div>
            <div>
              <FieldLabel htmlFor={`courseModules.${index}.topics`}>Topics (comma-separated)</FieldLabel>
              <Input
                {...register(`courseModules.${index}.topics`)}
                placeholder="Enter topics separated by commas"
                onChange={(e) => {
                  const topics = e.target.value.split(',').map(topic => topic.trim()).filter(Boolean)
                  const event = { target: { value: topics } }
                  register(`courseModules.${index}.topics`).onChange(event)
                }}
              />
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="normal"
          size="sm"
          onClick={() => append({
            title: "",
            difficulty: "Beginner",
            duration: "",
            topics: [],
            order: fields.length + 1,
          })}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Course Module
        </Button>
      </Stack>
    </div>
  )
}
