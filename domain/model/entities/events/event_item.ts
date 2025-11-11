import { InterestTag } from "../../enums/interest_tag";

export interface EventItem {
    id: string
    title: string
    description: string
    image?: string
    interests: InterestTag[]
    organiserName: string
    city: string
    placeName: string
    chatId: string
    startDate: string
    endDate: string
}