import { isValidUrl } from "@primoui/utils"
import { capitalCase } from "change-case"
import { DownloadCloudIcon, UploadIcon } from "lucide-react"
import { type ComponentProps, useRef, useState, useEffect } from "react"
import type { ControllerRenderProps, FieldPath, FieldValues, UseFormReturn } from "react-hook-form"
import { Button } from "~/components/common/button"
import { Field, FieldError, FieldLabel } from "~/components/common/field"
import { Input } from "~/components/common/input"
import { Stack } from "~/components/common/stack"
import { useMediaAction } from "~/hooks/use-media-action"
import { cx } from "~/lib/utils"
import { ALLOWED_MIMETYPES } from "~/server/web/shared/schema"
import { generatePresignedUrl } from "~/server/web/actions/media"

type FormMediaProps<T extends FieldValues> = Omit<ComponentProps<typeof Field>, "children"> & {
  form: UseFormReturn<T>
  field: ControllerRenderProps<T, FieldPath<T>>
  path: string
  fetchType?: "favicon" | "screenshot"
  websiteUrl?: string
  children?: React.ReactNode | ((props: { value: string | null }) => React.ReactNode)
}

export const FormMedia = <T extends FieldValues>({
  children,
  className,
  form,
  field,
  path,
  fetchType,
  websiteUrl,
  ...props
}: FormMediaProps<T>) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const action = useMediaAction({ form, path, fieldName: field.name, fetchType })
  const [previewUrl, setPreviewUrl] = useState<string | null>(field.value || null)
  
  const error = form.formState.errors[field.name]

  useEffect(() => {
    let active = true

    const loadPreview = async () => {
      const value = field.value
      if (!value) {
        if (active) setPreviewUrl(null)
        return
      }

      // Automatically generate a presigned URL. The action returns the exact same url if it's not a DO Spaces URL.
      const url = await generatePresignedUrl(value)
      
      if (active) {
        setPreviewUrl(url ?? null)
      }
    }

    void loadPreview()
    return () => { active = false }
  }, [field.value])

  return (
    <Field className={cx("items-stretch", className)} {...props}>
      <Stack className="justify-between">
        <FieldLabel className="flex-1">{capitalCase(field.name)}</FieldLabel>

        <Stack size="xs" className="-my-1">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            prefix={<UploadIcon />}
            isPending={action.isUploading}
            disabled={action.isUploading || action.isFetching}
            onClick={() => inputRef.current?.click()}
          >
            Upload
          </Button>

          {websiteUrl !== undefined && (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              prefix={<DownloadCloudIcon />}
              isPending={action.isFetching}
              disabled={!isValidUrl(websiteUrl) || action.isUploading || action.isFetching}
              onClick={() => action.handleFetch(websiteUrl)}
            >
              Fetch
            </Button>
          )}
        </Stack>
      </Stack>

      <Stack size="sm">
        {typeof children === "function" ? children({ value: previewUrl }) : children}

        {/* Hidden input carries the real S3 URL as the form value */}
        <input type="hidden" {...field} />

        {/* Visible read-only input shows the presigned URL so the user can see/copy it */}
        <Input
          type="url"
          className="flex-1 text-xs text-muted-foreground"
          value={previewUrl ?? field.value ?? ""}
          onChange={() => {}}
          readOnly
          placeholder="No URL set"
          title={field.value ?? ""}
        />
      </Stack>

      {error && <FieldError errors={[error as { message?: string }]} />}

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_MIMETYPES.join(",")}
        onChange={action.handleUpload}
        className="hidden"
      />
    </Field>
  )
}
