import { create } from "zustand"; // Import create
import { EventRequestDTO } from "@/domain/model/dto/events/event_request_dto";
import { EventRepository } from "@/domain/repository/events/event_repository";
import { getErrorMessage } from "@/shared/utils/error_utils";
import { container } from "@/dependency_injection/container";
import { EventItem } from "@/domain/model/entities/events/event_item";

export interface UserEventsStore {
  // Data (Added myEvents to store the actual list)
  myEvents: EventItem[]; // Replace 'any' with EventResponseDTO
  eventRepository: EventRepository;

  // Loading States
  loadingCreate: boolean;
  loadingDelete: string | null;

  // Error States
  errorMyEvents: string | null;
  errorCreate: string | null;
  errorDelete: string | null;

  // Actions
  createEvent: (data: EventRequestDTO) => Promise<void>;
  deleteMyEvent: (id: string) => Promise<void>;
}

// 2. Create the store hook
export const useUserEventStore = create<UserEventsStore>((set, get) => ({
  // Initialize State
  myEvents: [],
  eventRepository: container.eventRepository,
  
  loadingCreate: false,
  loadingDelete: null,
  errorMyEvents: null,
  errorCreate: null,
  errorDelete: null,

  createEvent: async (data: EventRequestDTO) => {
    set({ loadingCreate: true, errorCreate: null });
    try {
      const newEvent = await get().eventRepository.createEvent(data);
      
      // Functional update to add the new event to the list
      set((state) => ({
        loadingCreate: false,
        myEvents: [...state.myEvents, newEvent] 
      }));
    } catch (err: unknown) {
      set({ errorCreate: getErrorMessage(err), loadingCreate: false });
    }
  },

  deleteMyEvent: async (id: string) => {
    set({ loadingDelete: id, errorDelete: null });
    try {
      await get().eventRepository.deleteEvent(id);
      
      // Functional update to remove the event from the list
      set((state) => ({
        loadingDelete: null,
        myEvents: state.myEvents.filter((e) => e.id !== id)
      }));
    } catch (err: unknown) {
      set({ errorDelete: getErrorMessage(err), loadingDelete: null });
    }
  },
}));