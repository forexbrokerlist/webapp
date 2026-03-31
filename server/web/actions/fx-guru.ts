"use server"

import { db } from "~/services/db"
import { getServerSession } from "~/lib/auth"

export async function saveFxGuruConversation(data: {
  conversationId: string
  sessionId: string
  title: string
  tool?: string
}) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      throw new Error("Unauthorized")
    }

    const { conversationId, sessionId, title, tool = "fx-guru" } = data
    const userId = session.user.id

    // Check if conversation already exists for this user and tool
    const existing = await db.userConversation.findFirst({
      where: { userId, conversationId, tool }
    })

    if (existing) {
      // Potentially update the title if it's "New chat" and we have a better one?
      // For now, just return success to avoid duplicates.
      return { success: true, id: existing.id }
    }

    const userConversation = await db.userConversation.create({
      data: {
        userId,
        conversationId,
        sessionId,
        title,
        tool,
      },
    })

    return { success: true, id: userConversation.id }
  } catch (error) {
    console.error("Error saving FxGuru conversation:", error)
    return { success: false, error: "Failed to save conversation" }
  }
}

export async function getFxGuruConversations() {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return []
    }

    const conversations = await db.userConversation.findMany({
      where: { userId: session.user.id, tool: "fx-guru" }
    })
    
    // Sort by descending id (since cuid embeds timestamp sequentially it serves well for reverse-chronological)
    return conversations.sort((a, b) => b.id.localeCompare(a.id))
  } catch (error) {
    console.error("Error fetching FxGuru conversations:", error)
    return []
  }
}
