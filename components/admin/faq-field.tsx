"use client"

import { useState } from "react"
import { useFieldArray, Control, UseFormRegister } from "react-hook-form"
import { Button } from "~/components/common/button"
import { Field, FieldError, FieldLabel } from "~/components/common/field"
import { Input } from "~/components/common/input"
import { Stack } from "~/components/common/stack"
import { TextArea } from "~/components/common/textarea"
import { X, Plus, GripVertical } from "lucide-react"
// @ts-ignore
import type { PostSchema } from "~/server/admin/posts/schema"
import { z } from "zod"

// @ts-ignore
interface FAQFieldProps {
  control: Control<PostSchema>
  register: UseFormRegister<PostSchema>
  errors?: any
}

// @ts-ignore
export function FAQField({ control, register, errors }: FAQFieldProps) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "faqs"
  })

  const addFAQ = () => {
    append({
      id: Date.now().toString(),
      question: "",
      answer: "",
      order: fields.length,
      isActive: true
    })
  }

  const removeFAQ = (index: number) => {
    remove(index)
  }

  const moveFAQ = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      move(index, index - 1)
    } else if (direction === 'down' && index < fields.length - 1) {
      move(index, index + 1)
    }
  }

  return (
    <div className="col-span-full">
      <FieldLabel>FAQs</FieldLabel>
      <Stack className="mt-2">
        {fields.map((field, index) => (
          <div key={field.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                <span className="text-sm font-medium">FAQ {index + 1}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => moveFAQ(index, 'up')}
                  disabled={index === 0}
                >
                  ↑
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => moveFAQ(index, 'down')}
                  disabled={index === fields.length - 1}
                >
                  ↓
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeFAQ(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Field>
              <FieldLabel htmlFor={`faqs.${index}.question`} className="min-w-3xl">Question</FieldLabel>
              <Input
                {...register(`faqs.${index}.question`)}
                placeholder="Enter FAQ question"
              />
              {errors?.faqs?.[index]?.question && (
                <FieldError errors={[errors.faqs[index].question]} />
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor={`faqs.${index}.answer`}>Answer</FieldLabel>
              <TextArea
                {...register(`faqs.${index}.answer`)}
                placeholder="Enter FAQ answer"
                rows={3}
              />
              {errors?.faqs?.[index]?.answer && (
                <FieldError errors={[errors.faqs[index].answer]} />
              )}
            </Field>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  {...register(`faqs.${index}.isActive`)}
                  defaultChecked={true}
                />
                Active
              </label>
              <Field>
                <FieldLabel htmlFor={`faqs.${index}.order`} className="text-sm">Order</FieldLabel>
                <Input
                  type="number"
                  {...register(`faqs.${index}.order`, { valueAsNumber: true })}
                  className="w-20"
                />
              </Field>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="secondary"
          onClick={addFAQ}
          className="w-full inline-flex items-center justify-center gap-2"
        >

          <span>Add FAQ </span>
        </Button>
      </Stack>
    </div>
  )
}
