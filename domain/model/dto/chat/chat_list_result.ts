import { ChatMessage } from "../../entities/chat/chat_message"

export interface ChatListResult {
    messages: ChatMessage[]
    hasMore: boolean
}