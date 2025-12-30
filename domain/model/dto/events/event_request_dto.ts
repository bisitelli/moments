import { InterestTag } from "../../enums/interest_tag";

export interface EventRequestDTO {
    name: string;
    eventBio: {
        description: string;
        image: string | null;
        interestTags: InterestTag[];
    };
    location: {
        city: string;
        placeName: string;
    };
    startDate: string;
    endDate: string;
}