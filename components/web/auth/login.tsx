import { useTranslations } from "next-intl"
import Image from "next/image"
import { Note } from "~/components/common/note"
import { Stack } from "~/components/common/stack"
import { LoginButton } from "~/components/web/auth/login-button"
import { LoginForm } from "~/components/web/auth/login-form"
import googleIcon from "~/public/google.svg"

export const Login = () => {
  const t = useTranslations()

  return (
    <div>
      <LoginForm />

      <Note className="flex items-center justify-center gap-3 my-2 before:content-[''] before:flex-1 before:border-t before:border-gray-200 after:content-[''] after:flex-1 after:border-t after:border-gray-200">
        {t("common.or")}
      </Note>

      <LoginButton
        provider="google"
        suffix={<Image src={googleIcon} alt="Google" className="size-4" unoptimized />}
      />
    </div>
  )
}
