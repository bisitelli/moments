import { EventDetailListHeader } from "@/components/events/event_detail_list_header";
import ParticipantCard from "@/components/events/participant_card";
import FloatingBackButton from "@/components/shared/floating_back_button";
import JoinEventButton from "@/components/shared/join_event_button";
import StickyHeader from "@/components/shared/sticky_header";
import { useEventDetailPage } from "@/hooks/events/use_event_details_page";
import React from "react";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function EventDetailScreen() {
  const {
    event,
    eventParticipants,
    isLoadingEvent,
    isLoadingParticipants,
    insets,
    scrollY,
    headerOpacity,
    handleJoinEvent,
    handleProfileNavigation,
    handleLoadMore,
    handleGoBack,
  } = useEventDetailPage();

  // --- Render Components (Footer & Empty State) ---

  const ListEmptyComponent = () => (
    <Text style={styles.emptyText}>No participants yet.</Text>
  );

  const ListFooter = () => {
    // If we have loaded the event but count is 0, show empty text
    if (event?.participantCount === 0) {
      return ListEmptyComponent();
    }

    // Show spinner if loading more pages
    if (isLoadingParticipants) {
      return (
        <View style={styles.loaderFooter}>
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      );
    }
    return null;
  };

  // --- Initial Full Page Loading ---
  if (isLoadingEvent || !event) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Navigation */}
      <FloatingBackButton onPress={handleGoBack} top={insets.top} />

      {/* Sticky Header (appears on scroll) */}
      <StickyHeader
        event={event}
        topInset={insets.top}
        opacity={headerOpacity}
      />

      <Animated.FlatList
        data={eventParticipants}
        keyExtractor={(item) => item.id}
        
        // 1. Header: Encapsulated logic for Event Info + Organiser
        ListHeaderComponent={
          <EventDetailListHeader
            event={event}
            onOrganiserPress={handleProfileNavigation}
          />
        }
        
        // 2. Items: Participant rows
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 15 }}>
            <ParticipantCard
              participantName={item.profile.name}
              participantImage={item.profile.profileImage ?? ""}
              onPress={() => handleProfileNavigation(item.id)}
            />
          </View>
        )}
        
        // 3. Footer: Spinner logic or empty label
        ListFooterComponent={ListFooter}
        
        // Infinite Scroll
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        
        // Animations: Link scroll position to Animated Value
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <JoinEventButton onPress={handleJoinEvent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  loaderFooter: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "gray",
    marginBottom: 20,
  },
});