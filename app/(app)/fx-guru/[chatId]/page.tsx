import { FxGuruChat } from "~/components/web/tools/fx-guru-chat"

export default async function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>
}) {
  const { chatId } = await params
  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height)-80px)] bg-[#f0f4f8] dark:bg-background overflow-hidden rounded-xl border border-border shadow-sm">
      <FxGuruChat chatId={chatId} />
    </div>
  )
}
