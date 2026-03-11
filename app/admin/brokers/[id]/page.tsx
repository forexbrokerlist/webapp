import { notFound } from "next/navigation"
import { ToolForm } from "~/app/admin/brokers/_components/broker-form"
import { Wrapper } from "~/components/common/wrapper"
import { findBrokerById } from "~/server/admin/brokers/queries"

export default async function ({ params }: PageProps<"/admin/brokers/[id]">) {
  const { id } = await params
  const broker = await findBrokerById(Number(id))

  if (!broker) {
    return notFound()
  }

  return (
    <Wrapper size="md" gap="sm">
      <ToolForm title={`Edit ${broker.broker_name || ''}`} broker={broker} />
    </Wrapper>
  )
}
