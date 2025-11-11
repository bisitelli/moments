import { EventFormData } from "@/components/events/event_form";
import { EventRequestDTO } from "@/domain/model/dto/event_request_dto";
import { EventResponseDTO } from "@/domain/model/dto/event_response_dto";
import { EventItem } from "@/domain/model/entities/events/event_item";
import { InterestTag } from "@/domain/model/enums/interest_tag";

/**
 * Utility class for mapping between Event DTOs, domain entities, and form data.
 */
export class EventMapper {
  // =========================
  // JSON <-> DTO
  // =========================

  /**
   * Parses raw API JSON into EventResponseDTO.
   * Supports both (id/title) and (eventId/name), and nested blocks (eventBio, location, chat).
   */
  static fromJson(json: any): EventResponseDTO {
    if (!json) throw new Error("EventMapper.fromJson: empty payload");

    const organiser = json.organiser
      ? {
          id: String(json.organiser.id ?? ""),
          profileId: String(json.organiser.profileId ?? ""),
          name: String(json.organiser.name ?? "Unknown organiser"),
        }
      : {
          id: "",
          profileId: "",
          name: "Unknown organiser",
        };

    const dto: EventResponseDTO = {
      id: String(json.id ?? json.eventId ?? ""),
      title: String(json.title ?? json.name ?? ""),
      description: String(json.description ?? json.eventBio?.description ?? ""),
      image: json.image ?? json.eventBio?.image ?? undefined,
      interests: (json.interests ?? json.eventBio?.interestTags ?? []) as InterestTag[],
      organiser,
      city: String(json.city ?? json.location?.city ?? ""),
      placeName: String(json.placeName ?? json.location?.placeName ?? ""),
      chatId: String(json.chatId ?? json.chat?.id ?? ""),
      startDate: String(json.startDate ?? ""),
      endDate: String(json.endDate ?? ""),
    };

    return dto;
  }

  /** Batch: JSON[] -> EventResponseDTO[] */
  static fromJsonList(arr: any[]): EventResponseDTO[] {
    return (arr ?? []).map((j) => this.fromJson(j));
  }

  /**
   * Serializes EventRequestDTO into the API payload shape:
   * {
   *   name,
   *   eventBio: { description, image, interestTags },
   *   location: { city, placeName },
   *   startDate, endDate
   * }
   */
  static toJson(dto: EventRequestDTO): any {
    if (!dto) throw new Error("EventMapper.toJson: empty dto");

    return {
      name: dto.title,
      eventBio: {
        description: dto.description,
        image: dto.image ?? null,
        interestTags: dto.interests as InterestTag[],
      },
      location: {
        city: dto.city,
        placeName: dto.placeName,
      },
      startDate: dto.startDate,
      endDate: dto.endDate,
    };
  }

  /** Batch: EventRequestDTO[] -> any[] (API payloads) */
  static toJsonList(dtos: EventRequestDTO[]): any[] {
    return (dtos ?? []).map((d) => this.toJson(d));
  }

  // =========================
  // DTO -> Entity
  // =========================

  /** Converts a single EventResponseDTO -> EventItem */
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

  /** Converts a list of EventResponseDTO -> EventItem[] */
  static toEntityList(dtos: EventResponseDTO[]): EventItem[] {
    return dtos.map((dto) => this.toEntity(dto));
  }

  /** Convenience: raw API JSON -> EventItem (fromJson + toEntity) */
  static entityFromJson(j: any): EventItem {
    return this.toEntity(this.fromJson(j));
  }

  static entityFromJsonList(arr: any[]): EventItem[] {
    return arr.map((json) => EventMapper.entityFromJson(json))
  }

  // =========================
  // Entity/Form <-> DTO
  // =========================

  /** Converts a single EventItem -> EventRequestDTO (for create/update) */
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

  /** Converts a list of EventItem -> EventRequestDTO[] */
  static toDTOList(entities: EventItem[]): EventRequestDTO[] {
    return entities.map((entity) => this.toDTO(entity));
  }

  /** Converts EventFormData -> EventRequestDTO (create from form) */
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

  /** Converts EventResponseDTO -> EventFormData (prefill edit form) */
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
