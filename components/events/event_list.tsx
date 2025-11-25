import { EventItem } from "@/domain/model/entities/events/event_item";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import EventCard from "./event_card";

// Internal component to handle the Fade In animation
const FadeInItem = ({ children, index }: { children: React.ReactNode; index: number }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200, // Not too slow, not instant
      delay: (index % 10) * 50, // Small stagger that resets every 10 items
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, index]);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) }] }}>
      {children}
    </Animated.View>
  );
};

type Props = {
  events: EventItem[];
  emptyComponentLabel?: string;
  headerLabel?: string;
  paddingTop?: number;
  paddingBottom?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
  onLoadMore?: () => void; 
  isLoadingMore?: boolean; 
};

export default function EventList({
  events,
  emptyComponentLabel,
  headerLabel,
  paddingTop = 0,
  paddingBottom = 0,
  contentContainerStyle,
  onLoadMore,
  isLoadingMore = false,
}: Props) {
  const router = useRouter();

  const handleEventPress = (eventId: string) => {
    router.push({
      pathname: "/(private)/event/[id]",
      params: { id: eventId },
    });
  };

  // Header logic
  const header =
    headerLabel && headerLabel.trim().length > 0 ? (
      <Text style={styles.header}>{headerLabel}</Text>
    ) : null;

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

  return (
    <FlatList
      data={events}
      keyExtractor={(item: EventItem) => String(item.id)}
      renderItem={({ item, index }) => (
        <FadeInItem index={index}>
          <EventCard
            event={item}
            onPressed={() => handleEventPress(item.id)}
          />
        </FadeInItem>
      )}
      
      // --- Infinite Scroll Logic ---
      // Triggers when the scroll is within 50% of the screen height from the bottom
      onEndReachedThreshold={0.5} 
      
      // Callback to parent to fetch data
      onEndReached={() => {
        if (!isLoadingMore && onLoadMore) {
          onLoadMore();
        }
      }}
      
      // Shows the loader below the last item
      ListFooterComponent={renderFooter}

      ListHeaderComponent={header}
      ListEmptyComponent={
        emptyComponentLabel ? (
          <Text style={styles.emptyText}>{emptyComponentLabel}</Text>
        ) : null
      }
      
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      
      contentContainerStyle={[
        { paddingTop, paddingBottom },
        contentContainerStyle,
      ]}
      
      contentInsetAdjustmentBehavior="never"
      showsVerticalScrollIndicator
    />
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 18, fontWeight: "700", marginTop: 6, marginBottom: 6 },
  emptyText: { color: "#999", textAlign: "center", marginTop: 24 },
  separator: { height: 8 },
  
  // Footer styling to center the loader
  loaderFooter: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});