import { FxGuruChat } from "~/components/web/tools/fx-guru-chat"

export default async function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>
}) {
  const { chatId } = await params
  return (

    <FxGuruChat chatId={chatId} />
  )
}
