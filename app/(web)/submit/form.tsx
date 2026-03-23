"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks"
import { useAction } from "next-safe-action/hooks"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { XCircle } from "lucide-react"
import type { ComponentProps } from "react"
import { Controller, FormProvider as Form } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "~/components/common/button"
import { Checkbox } from "~/components/common/checkbox"
import { Field, FieldError, FieldLabel } from "~/components/common/field"
import { Hint } from "~/components/common/hint"
import { Input } from "~/components/common/input"
import { TextArea } from "~/components/common/textarea"
import { cx } from "~/lib/utils"
import { submitBroker } from "~/server/web/actions/submit"
import { createSubmitBrokerSchema } from "~/server/web/shared/schema"
import { createStripeCheckout } from "~/server/web/products/actions"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/common/select"
import { RelationSelector } from "~/components/common/relation-selector"

type SubmitFormProps = ComponentProps<"form"> & {
  categories?: any[]
  subcategories?: any[]
  tags?: any[]
  plan?: any
  isCancelled?: boolean
}

export const SubmitForm = ({
  className,
  categories = [],
  subcategories = [],
  tags = [],
  ...props
}: SubmitFormProps) => {
  const router = useRouter()
  const t = useTranslations("forms.submit")
  const tSchema = useTranslations("schema")
  const [showCancelled, setShowCancelled] = useState(props.isCancelled)
  
  // Persist plan across redirects (Cregis might drop query parameters on cancel)
  const [activePlan, setActivePlan] = useState(props.plan)

  useEffect(() => {
    if (props.plan) {
      setActivePlan(props.plan)
      sessionStorage.setItem("submitActivePlan", JSON.stringify(props.plan))
    } else if (props.isCancelled) {
      const stored = sessionStorage.getItem("submitActivePlan")
      if (stored) {
        try {
          setActivePlan(JSON.parse(stored))
        } catch (e) {}
      }
    }
  }, [props.plan, props.isCancelled])

  const schema = createSubmitBrokerSchema(tSchema)
  const resolver = zodResolver(schema)

  const checkoutAction = useAction(createStripeCheckout, {
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to initiate payment")
    }
  })

  const { form, action, handleSubmitWithAction } = useHookFormAction(submitBroker, resolver, {
    formProps: {
      values: {
        broker_name: "",
        broker_website: "",
        description: "",
        headquarters: "",
        year_established: undefined,
        regulators: "",
        minimum_deposit: "",
        execution_types: "",
        trading_platforms: "",
        funding_methods: "",
        deposit_options: "",
        withdrawal_options: "",
        deposit_fees: "",
        withdrawal_fee: "",
        inactivity_fee: "",
        profit_share: "",
        retail_loss_rate: "",
        maximum_evaluation_fee: "",
        daily_loss_limit: "",
        minimum_raw_spreads: "",
        minimum_standard_spreads: "",
        minimum_commission_for_forex: "",
        average_trading_cost_eur_usd: "",
        average_trading_cost_gbp_usd: "",
        average_trading_cost_gold: "",
        average_trading_cost_bitcoin: "",
        average_trading_cost_wti_crude_oil: "",
        pros: "",
        cons: "",
        newsletterOptIn: true,
        categoryIds: [],
        subcategoryIds: [],
        tagIds: [],
      },
    },

    actionProps: {
      onSuccess: ({ data }) => {
        form.reset()

        if (!data) return

        let planToUse = activePlan
        if (!planToUse) {
          try {
            const stored = sessionStorage.getItem("submitActivePlan")
            if (stored) planToUse = JSON.parse(stored)
          } catch (e) {}
        }

        if (planToUse && planToUse.price > 0) {
          checkoutAction.execute({
            lineItems: [{ price: planToUse.id, quantity: 1 }],
            successUrl: `/submit/${data.slug}/success`,
            cancelUrl: `/submit?plan=${planToUse.slug}`,
            mode: "payment",
            metadata: { planId: planToUse.id, brokerId: String(data.id), type: "subscription" }
          })
          return
        }

        toast.success(t("submitted_success", { name: data.broker_name || "Broker" }))
        router.push(`/submit/${data.slug}/success`)
      },
    },
  })

  const { serverError } = action.result

  if (showCancelled) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-card border border-destructive/20 rounded-xl p-8 sm:p-12 shadow-sm flex flex-col items-center text-center gap-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
          <XCircle className="size-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Payment Cancelled</h2>
          <p className="text-muted-foreground">
            Your payment process was cancelled and no charges were made.
            If you experienced an issue, you can try again or contact support.
          </p>
        </div>
        <Button 
          size="lg" 
          className="mt-4"
          onClick={() => {
            setShowCancelled(false)
            window.history.replaceState(null, '', window.location.pathname + (activePlan ? `?plan=${activePlan.slug}` : ''))
          }}
        >
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmitWithAction}
        className={cx("grid w-full gap-5 @md:grid-cols-2", className)}
        noValidate
        {...props}
      >
        <h3 className="col-span-full font-semibold text-xl -mb-2">Basic Information</h3>
        <Controller
          control={form.control}
          name="broker_name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel data-required htmlFor={field.name}>
                Name:
              </FieldLabel>
              <Input
                id={field.name}
                size="lg"
                placeholder="Ex. Rejoice Forex"
                data-1p-ignore
                {...field}
                value={field.value || ""}
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
              <FieldLabel htmlFor={field.name}>
                Website URL:
              </FieldLabel>
              <Input
                id={field.name}
                type="url"
                size="lg"
                placeholder="https://example.com"
                {...field}
                value={field.value || ""}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="headquarters"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Headquarters:
              </FieldLabel>
              <Input
                id={field.name}
                size="lg"
                placeholder="Cyprus, UK, etc."
                {...field}
                value={field.value || ""}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="year_established"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Year Established:
              </FieldLabel>
              <Input
                id={field.name}
                type="number"
                size="lg"
                placeholder="2010"
                {...field}
                value={(field.value as string | number) || ""}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="regulators"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-full">
              <FieldLabel htmlFor={field.name}>
                Regulators:
              </FieldLabel>
              <Input
                id={field.name}
                size="lg"
                placeholder="FCA, ASIC, CySEC..."
                {...field}
                value={field.value || ""}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-full">
              <FieldLabel htmlFor={field.name}>Description:</FieldLabel>
              <TextArea id={field.name} size="lg" placeholder="Broker description" {...field} value={field.value || ""} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <h3 className="col-span-full font-semibold text-xl mt-4 -mb-2">Classification</h3>

        <Controller
          control={form.control}
          name="categoryIds"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Categories:</FieldLabel>
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
                <FieldLabel htmlFor={field.name}>Subcategories:</FieldLabel>
                <RelationSelector
                  relations={filteredSubcategories}
                  ids={field.value ?? []}
                  setIds={field.onChange}
                />
                <Hint>Only subcategories of selected categories are shown.</Hint>
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
              <FieldLabel htmlFor={field.name}>Tags:</FieldLabel>
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

        <h3 className="col-span-full font-semibold text-xl mt-4 -mb-2">Trading Conditions</h3>

        <Controller
          control={form.control}
          name="trading_platforms"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Trading Platforms:
              </FieldLabel>
              <Input
                id={field.name}
                size="lg"
                placeholder="MT4, MT5, cTrader..."
                {...field}
                value={field.value || ""}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="execution_types"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Execution Types:
              </FieldLabel>
              <Input
                id={field.name}
                size="lg"
                placeholder="STP, ECN, Market Maker"
                {...field}
                value={field.value || ""}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="profit_share"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Profit Share:
              </FieldLabel>
              <Input
                id={field.name}
                size="lg"
                placeholder="80% to 90%"
                {...field}
                value={field.value || ""}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="retail_loss_rate"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Retail Loss Rate:
              </FieldLabel>
              <Input
                id={field.name}
                size="lg"
                placeholder="76.2%"
                {...field}
                value={field.value || ""}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <h3 className="col-span-full font-semibold text-xl mt-4 -mb-2">Accounts & Funding</h3>

        <Controller
          control={form.control}
          name="minimum_deposit"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Minimum Deposit:
              </FieldLabel>
              <Input
                id={field.name}
                size="lg"
                placeholder="$100"
                {...field}
                value={field.value || ""}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="funding_methods"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Funding Methods:
              </FieldLabel>
              <Input
                id={field.name}
                size="lg"
                placeholder="Bank Wire, Credit Card, PayPal"
                {...field}
                value={field.value || ""}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="deposit_options"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Deposit Options:
              </FieldLabel>
              <Input
                id={field.name}
                size="lg"
                placeholder="Skrill, Neteller, Crypto"
                {...field}
                value={field.value || ""}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="withdrawal_options"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Withdrawal Options:
              </FieldLabel>
              <Input
                id={field.name}
                size="lg"
                placeholder="Skrill, Neteller, Crypto"
                {...field}
                value={field.value || ""}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="deposit_fees"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Deposit Fees:
              </FieldLabel>
              <Input
                id={field.name}
                size="lg"
                placeholder="0% / None"
                {...field}
                value={field.value || ""}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="withdrawal_fee"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Withdrawal Fee:
              </FieldLabel>
              <Input
                id={field.name}
                size="lg"
                placeholder="$5 for Wire, 0 for eWallets"
                {...field}
                value={field.value || ""}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="inactivity_fee"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Inactivity Fee:
              </FieldLabel>
              <Input
                id={field.name}
                size="lg"
                placeholder="$10 per month after 1 year"
                {...field}
                value={field.value || ""}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <h3 className="col-span-full font-semibold text-xl mt-4 -mb-2">Pros & Cons</h3>

        <Controller
          control={form.control}
          name="pros"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-full">
              <FieldLabel htmlFor={field.name}>Pros:</FieldLabel>
              <TextArea id={field.name} size="lg" placeholder="List of pros separated by semicolon: Pro 1; Pro 2" {...field} value={field.value || ""} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="cons"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-full">
              <FieldLabel htmlFor={field.name}>Cons:</FieldLabel>
              <TextArea id={field.name} size="lg" placeholder="List of cons separated by semicolon: Con 1; Con 2" {...field} value={field.value || ""} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="newsletterOptIn"
          render={({ field, fieldState }) => (
            <Field
              orientation="horizontal"
              className="col-span-full items-center gap-2 mt-4"
              data-invalid={fieldState.invalid}
            >
              <Checkbox id={field.name} checked={field.value} onCheckedChange={field.onChange} />
              <FieldLabel htmlFor={field.name} className="font-normal">
                {t("newsletter_label")}
              </FieldLabel>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {serverError && <Hint className="col-span-full">{serverError}</Hint>}

        <div className="col-span-full">
          <Button type="submit" variant="primary" isPending={action.isPending || checkoutAction.isPending} className="flex min-w-32">
            {t("submit_button")}
          </Button>
        </div>
      </form>
    </Form>
  )
}
