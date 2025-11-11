import { UserProfile } from "../../entities/events/user_profile"

export interface EventParticipantResponseDTO {
    id: string
    userProfile: UserProfile
}