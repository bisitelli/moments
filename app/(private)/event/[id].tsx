import EventHeaderCard from "@/components/events/event_header_card";
import ParticipantCard from "@/components/events/participant_card";
import FloatingBackButton from "@/components/shared/floating_back_button";
import JoinEventButton from "@/components/shared/join_event_button";
import ScrollableChipList from "@/components/shared/scrollable_chip_list";
import StickyHeader from "@/components/shared/sticky_header";
import { EventParticipant } from "@/domain/model/entities/events/event_participant";
import { useEventDetailStore } from "@/store/events/user_event_details_store";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


// Threshold for sticky header animation
const STICKY_HEADER_THRESHOLD = 250;

/**
 * Main screen component for displaying event details.
 * Manages layout, scroll animations, and navigation.
 */
export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { top } = useSafeAreaInsets(); // Get safe area inset for status bar
  const event = useEventDetailStore((state) => state.event);
  const fetchEventById = useEventDetailStore((state) => state.fetchEventById);
  const eventParticipants = useEventDetailStore((state) => state.eventParticipants);
  const isLoadingEvent = useEventDetailStore((state) => state.isLoadingEvent);

  // Animation value for scroll position
  const scrollY = useRef(new Animated.Value(0)).current;

  // Interpolate opacity for the sticky header based on scroll position
  const headerOpacity = scrollY.interpolate({
    inputRange: [STICKY_HEADER_THRESHOLD - 50, STICKY_HEADER_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  useEffect(() => {
    if (id) {
        const eventId = Array.isArray(id) ? id[0] : id;
        fetchEventById(eventId);
    }
  }, [id]);

  // Event handler for joining the event
  const handleJoinEvent = () => {
    console.log("User wants to join event:", id);
  };

  // Handler for navigating to a user's profile
  const handleProfileNavigation = (userId: string) => {
    console.log("Navigate to profile:", userId);
    // e.g., router.push(`/profile/${userId}`);
  };

  if (isLoadingEvent || !event) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }


  // Render the main screen content
  return (
    <View style={styles.container}>
      <FloatingBackButton onPress={() => router.back()} top={top} />

      <StickyHeader
        event={event!}
        topInset={top}
        opacity={headerOpacity}
      />

      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: 100 }} // Space for Join button
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true } // Use native driver for smooth animation
        )}
        scrollEventThrottle={16}
      >
        {/* Section 1: Event Details */}
        <EventHeaderCard
          event={event} 
          startDate={event.startDate}
          endDate={event.endDate}
          city={event.city}
          location={event.placeName}
        />

        {/* Section 2: Interests */}
        <View style={styles.defaultContainer}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <ScrollableChipList
            data={event.interests}
          />
        </View>

        {/* Section 3: Organiser & Participants */}
        <View style={styles.defaultContainer}>
          <Text style={styles.sectionTitle}>Organiser</Text>
          <ParticipantCard
            key={event.organiser.id}
            participantName={event.organiser.profile.name}
            participantImage={event.organiser.profile.profileImage ?? ""}
            onPress={() => handleProfileNavigation(event.organiser.id)}
          />

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>
            Participants ({event?.participantCount})
          </Text>

          {/* TODO: Implement infinite scroll for participants list */}
          {(eventParticipants != null) && eventParticipants.length > 0 ? (
            eventParticipants.map((participant: EventParticipant) => (
              <ParticipantCard
                key={participant.id}
                participantName={participant.profile.name}
                participantImage={participant.profile.profileImage ?? ""}
                onPress={() => handleProfileNavigation(participant.id)}
              />
            ))
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 20, color: 'gray' }}>
              Any participants yet.
            </Text>
          )}        
        </View>
      </Animated.ScrollView>

      <JoinEventButton onPress={handleJoinEvent} />
    </View>
  );
}

// Styles specific to the EventDetailScreen layout
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  defaultContainer: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
    paddingLeft: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 20,
    marginHorizontal: 10,
  },
});