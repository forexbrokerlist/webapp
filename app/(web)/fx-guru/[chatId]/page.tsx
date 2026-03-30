import { FxGuruChat } from "~/components/web/tools/fx-guru-chat"

export default function ChatPage({
  params,
}: {
  params: { chatId: string }
}) {
  return <FxGuruChat />
}