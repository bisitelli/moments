import { EventRequestDTO } from "@/domain/model/dto/event_request_dto";
import { EventResponseDTO } from "@/domain/model/dto/event_response_dto";
import { EventItem } from "@/domain/model/entities/event_item";
import { EventFormData } from "@/components/events/event_form";
import { InterestTag } from "@/domain/model/enums/interest_tag";

/**
 * Utility class for mapping between Event DTOs, domain entities, and form data.
 */
export class EventMapper {
  /**
   * Converts a single EventResponseDTO -> EventItem
   */
  static toEntity(dto: EventResponseDTO): EventItem {
    return {
      id: dto.id,
      title: dto.title,
      description: dto.description,
      image: dto.image,
      interests: dto.interests,
      organiserName: dto.organiser?.name ?? "Unknown organiser",
      city: dto.city,
      placeName: dto.placeName,
      chatId: dto.chatId,
      startDate: dto.startDate,
      endDate: dto.endDate,
    };
  }

  /**
   * Converts a list of EventResponseDTO -> EventItem[]
   */
  static toEntityList(dtos: EventResponseDTO[]): EventItem[] {
    return dtos.map((dto) => this.toEntity(dto));
  }

  /**
   * Converts a single EventItem -> EventRequestDTO
   * (for sending to backend when creating/updating)
   */
  static toDTO(entity: EventItem): EventRequestDTO {
    return {
      title: entity.title,
      description: entity.description,
      image: entity.image,
      interests: entity.interests,
      city: entity.city,
      placeName: entity.placeName,
      startDate: entity.startDate,
      endDate: entity.endDate,
    };
  }

  /**
   * Converts a list of EventItem -> EventRequestDTO[]
   */
  static toDTOList(entities: EventItem[]): EventRequestDTO[] {
    return entities.map((entity) => this.toDTO(entity));
  }

  /**
   * Converts an EventFormData -> EventItem
   * (Used when creating a new event from the form)
   */
  static fromForm(form: EventFormData): EventRequestDTO {
    return {
      title: form.title.trim(),
      description: form.description?.trim() ?? "",
      image: form.image ?? undefined,
      interests: form.interests ?? [],
      city: form.city.trim(),
      placeName: form.placeName.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
    };
  }

  /**
   * Converts an EventItem -> EventFormData
   * (Used to pre-fill the form when editing an event)
   */
  static toForm(entity: EventResponseDTO): EventFormData {
    return {
      title: entity.title,
      description: entity.description,
      image: entity.image,
      interests: entity.interests,
      city: entity.city,
      placeName: entity.placeName,
      startDate: entity.startDate,
      endDate: entity.endDate,
    };
  }
}
