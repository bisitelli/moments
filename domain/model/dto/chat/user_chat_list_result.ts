import { UserChatsView } from "../../entities/chat/user_chat_view"

export interface UserChatListResult {
    chats: UserChatsView[]
    hasMore: boolean
}