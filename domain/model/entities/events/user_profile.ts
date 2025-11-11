import { InterestTag } from "../../enums/interest_tag"

export interface UserProfile {
    id: string
    name: string
    age: number
    nationality: string
    languages: string[]
    interests: InterestTag[]
    city: string
    country: string
}