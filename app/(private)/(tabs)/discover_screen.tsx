import { EventFormData } from "@/components/events/event_form";
import EventList from "@/components/events/event_list";
import EventModalFormWrapper from "@/components/events/event_modal_form_wrapper";
import EventFilterMenu from "@/components/shared/event_filter_menu";
import ScrollableFilterButton from "@/components/shared/scrollable_filter_button";
import { mapEventFormToDTO } from "@/domain/infrastructure/mappers/event_mapper";
import { InterestTag } from "@/domain/model/enums/interest_tag";
import { useEventFilter } from "@/hooks/events/use_event_filter";
import { useEventFilterStore } from "@/store/events/use_event_filter_store";
import { useUserEventStore } from "@/store/events/user_events_store";
import React, { useCallback, useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { EventRepository } from "@/domain/repository/events/event_repository";
import { FilterTag } from "@/domain/model/enums/filter_tag";
import { useEventsStore } from "@/store/events/use_events_store_factory";

export default function DiscoverPage() {
  // --- Global Store Data ---
  const interestFilter = useEventFilterStore((s) => s.interestFilter);
  const setInterest = useEventFilterStore((s) => s.setInterest);
  const createEvent = useUserEventStore((s) => s.createEvent);
  
  // --- Pagination Store Hooks ---
  const { events, loadNextPage, refreshState, loading, hasMore } = useEventsStore();

  // --- Local Search State (Strategy Inputs) ---
  const [tagMode, setTagMode] = useState<FilterTag>(FilterTag.Location);
  const [location, setLocation] = useState("Leuven"); 
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD

  // --- UI State ---
  const [showForm, setShowForm] = useState(false);
  const [activeFilterRender, setActiveFilterRender] = useState<(() => React.ReactNode) | null>(null);
  const [filterVisible, setFilterVisible] = useState(false);

  // --- Helpers ---
  const closeFilter = () => {
    setFilterVisible(false);
    setActiveFilterRender(null);
  };

  // --- Filter Menu Configuration ---
  // We pass the setters to the hook so the menu can update our local state
  const filterOptions = useEventFilter({
    onClose: closeFilter,
    onLocationChange: setLocation,
    onDateChange: setDate,
    onModeChange: setTagMode,
  });

  const filterButtons = Object.values(InterestTag)
    .map(tag => ({
      key: tag,
      label: tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase(), // From ALL to All
    }));

  /**
   * This function captures the current state (Location/Date + Interest Tags)
   * and decides which Repository method to call.
   */
  const fetchStrategy = useCallback(async (repo: EventRepository, page: number) => {
    // Convert 'ALL' to undefined so the repo ignores the tag filter if needed
    const tags = interestFilter === InterestTag.ALL ? undefined : [interestFilter];

    if (tagMode === FilterTag.Location) {
       // Case A: Filter by Location AND Tags
       return repo.getEventsByLocation(location, page, tags); 
    } else {
       // Case B: Filter by Date AND Tags
       return repo.getEventsByDateAscending(date, page, tags);
    }
  }, [tagMode, location, date, interestFilter]);


  // --- Effects ---
  // Listen for changes in ANY filter (Interest, Location, Date, Mode)
  // and trigger a fresh load.
  useEffect(() => {
    // 1. Reset the list (page = 0, events = [])
    refreshState();
    // 2. Load first page with the new strategy
    loadNextPage(fetchStrategy);
  }, [fetchStrategy, refreshState, loadNextPage]); 


  // --- Handlers ---

  const onFilterByInterestTagChanged = (tag: InterestTag) => {
    setInterest(tag);
  }

  function handleFormSubmit(data: EventFormData) {
    createEvent(mapEventFormToDTO(data));
    setShowForm(false);
  }

  // Infinite Scroll Handler
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadNextPage(fetchStrategy);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>Discover events 🌍</Text>

        <View style={{marginRight: 12, marginTop: 5}}>
          {/* We pass the configured options to the menu */}
          <EventFilterMenu
            filterOptions={filterOptions}
            onSelect={(render) => {
              setActiveFilterRender(() => render);
              setFilterVisible(true);
            }}
          />
        </View>
      </View>

      {/* Interest Tag Filter */}
      <View style={styles.header}>
        <ScrollableFilterButton
          data={filterButtons}
          onChange={onFilterByInterestTagChanged}
          selectedKey={interestFilter}
          contentPaddingHorizontal={filterButtons.length}
        />
      </View>

      {/* Events list */}
      <EventList
        events={events} 
        emptyComponentLabel={loading ? "Loading..." : "No events yet 😕"}
        contentContainerStyle={{paddingTop: 0}}
        onLoadMore={handleLoadMore}
        isLoadingMore={loading}
      />

      {/* Add event button */}
      <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(true)}>
        <Text style={styles.addButtonText}>＋</Text>
      </TouchableOpacity>

      {/* OVERLAY with TRANSPARENT wrapper */}
      <Modal
        visible={filterVisible}
        transparent
        animationType="fade"
        onRequestClose={closeFilter}
      >
        {/* Fullscreen backdrop (tap outside to close) */}
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={closeFilter}>
          {/* Prevent closing when tapping inside the content */}
          <TouchableWithoutFeedback>
            {/* Wrapper without background/borders: child renders its own card */}
            <View style={styles.filterOverlayWrapper}>
              {activeFilterRender && activeFilterRender()}
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>

      {/* Create Event modal */}
      <EventModalFormWrapper
        visible={showForm}
        formLabel={"Create a Moment"}
        onClose={() => setShowForm(false)}
        onFormSubmitted={handleFormSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 15
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
  },

  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#007AFF",
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  addButtonText: { color: "white", fontSize: 36, lineHeight: 36 },

  // === OVERLAY ===
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)", // dimmed background
    paddingHorizontal: 20,
    paddingTop: 100, // offset from the header
  },

  // TRANSPARENT wrapper: no extra card behind the child
  filterOverlayWrapper: {
    alignSelf: "center",
    maxWidth: 600,
  },
});