import React from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { EventParticipant } from "@/domain/model/entities/events/event_participant";
import ParticipantCard from "./participant_card"; // Adjust import path if needed

interface ParticipantCardListProps {
  participants: EventParticipant[] | null | undefined;
  participantCount: number
  onParticipantPress: (participantId: string) => void;
  onLoadMore: () => void
  isLoadingMore?: boolean
}

export const EventParticipantCardList = ({
  participants,
  onParticipantPress,
  onLoadMore,
  isLoadingMore,
  participantCount
}: ParticipantCardListProps) => {

    // Footer loader: Only renders when loading more data
    const renderFooter = () => {
    if (isLoadingMore) {
      return (
        <View style={styles.loaderFooter}>
        <ActivityIndicator size="small" color="#0000ff" />
        </View>
      );
    }
    };

  if (participantCount === 0) {
    return (
       <Text style={styles.emptyText}>
           No participants yet.
        </Text>
    )
  }

  return (
    <FlatList
      // --- Infinite Scroll Logic ---
      // Triggers when the scroll is within 70% of the screen height from the bottom
      onEndReachedThreshold={0.3} 
      
      // Callback to parent to fetch data
      onEndReached={() => {
        if (!isLoadingMore) {
          onLoadMore();
        }
      }}

      ListFooterComponent={renderFooter}

      data={participants}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ParticipantCard
          participantName={item.profile.name}
          participantImage={item.profile.profileImage ?? ""}
          onPress={() => onParticipantPress(item.id)}
        />
      )}
      contentContainerStyle={(!participants || participants.length === 0) ? styles.centerContainer : undefined}
    />
  );
};

const styles = StyleSheet.create({
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
  centerContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  loaderFooter: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});