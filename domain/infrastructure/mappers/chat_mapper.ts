
// infrastructure/mappers/chat_mapper.ts

import { ChatMessage } from "@/domain/model/entities/chat/chat_message";

export const mapMessageResponseToEntity = (apiResponse: any): ChatMessage => ({
    ...apiResponse,
    sentAt: new Date(apiResponse.sentAt) // Convert String -> Date object here
});