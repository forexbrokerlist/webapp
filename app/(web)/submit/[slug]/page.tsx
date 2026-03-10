import { redirect } from "next/navigation"

export default async function (props: { params: { slug: string } }) {
  const { slug } = await props.params
  redirect(`/submit/${slug}/success`)
}

