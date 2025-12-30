import { EventFormData } from "@/components/events/event_form";
import { EventRequestDTO } from "@/domain/model/dto/events/event_request_dto";
import { EventResponseDTO } from "@/domain/model/dto/events/event_response_dto";
import { EventItem } from "@/domain/model/entities/events/event_item";
import { EventOrganiser } from "@/domain/model/entities/events/event_organiser";
import { mapProfileToFrontend, processImage } from "./user_profile_mapper";


export const mapEventToFrontend = (dto: EventResponseDTO): EventItem => {
    
    let organiserMapped: EventOrganiser;

    if (dto.organiser) {
        organiserMapped = {
            id: dto.organiser.id ?? "no-id",
            profile: mapProfileToFrontend(dto.organiser.profile)  
        };
    } else {
        organiserMapped = {
            id: "no-organiser-data",
            profile: mapProfileToFrontend(dto.organiser)  
        };
    }

    return {
        id: dto.eventId,
        title: dto.name,
        description: dto.eventBio?.description ?? "",
        image: processImage(dto.eventBio?.image) || null,
        interests: (dto.eventBio?.interestTags ?? []),
        organiser: organiserMapped,
        participantCount: dto.participantCount ?? 0, 
        city: dto.location?.city ?? "Unknown City",
        placeName: dto.location?.placeName ?? "Unknown Place",
        startDate: dto.startDate,
        endDate: dto.endDate
    };
};

export const mapEventFormToDTO = (formData: EventFormData): EventRequestDTO => {
  return {
        name: formData.title.trim(),
        eventBio: {
            description: formData.description.trim(),
            // If image is empty or missing, send null explicitly; otherwise trimmed string
            image: formData.image?.trim() ? formData.image.trim() : null,
            // Ensure interests is an array even if undefined in form
            interestTags: formData.interests ?? [],
        },
        location: {
            city: formData.city.trim(),
            placeName: formData.placeName.trim(),
        },
    startDate: formData.startDate,
    endDate: formData.endDate,
  };
};