import { EventItem } from "@/domain/model/entities/events/event_item";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import EventCard from "./event_card";
import { FadeInView } from "../shared/fade_in_view";

type Props = {
  events: EventItem[];
  emptyComponentLabel?: string;
  headerLabel?: string;
  paddingTop?: number;
  paddingBottom?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
  onLoadMore?: () => void; 
  isLoadingMore?: boolean; 
  handleRefresh: () => void
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
  handleRefresh
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
        <FadeInView 
          index={index}
          children={
            <EventCard
              event={item}
              onPressed={() => handleEventPress(item.id)}
            />
          }
        />  
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

      refreshControl={
        <RefreshControl 
            refreshing={(isLoadingMore && events.length > 0 ? true : false)} 
            onRefresh={handleRefresh} 
        />
      }
      
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