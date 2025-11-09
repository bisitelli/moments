import { EventItem } from "@/domain/model/entities/event_item";
import { FlatList, StyleSheet, Text } from "react-native";
import EventCard from "./event_card";

export default function EventList ({
    events,
    emptyComponentLabel,
    headerLabel,
    paddingTop,
    paddingBottom
}:
{
    events: EventItem[],
    emptyComponentLabel?: string
    headerLabel?: string
    paddingTop?: number
    paddingBottom?: number
})   
{
    return (
        <FlatList
            data={events}
            keyExtractor={(item: EventItem) => String(item.id)
            }
            renderItem={({ item }) => <EventCard event={item} />}
            ListHeaderComponent={<Text style={styles.header}>{headerLabel ?? ""}</Text>}
            ListEmptyComponent={<Text style={styles.emptyText}>{emptyComponentLabel ?? ""}</Text>}
            contentContainerStyle={{ paddingBottom: paddingBottom ?? 0, paddingTop: paddingTop ?? 0}}
            showsVerticalScrollIndicator
        />
    )
}

const styles = StyleSheet.create({
    header: { fontSize: 24, fontWeight: "bold", marginBottom: 12, marginTop: 30, },
    emptyText: { color: "#999", textAlign: "center", marginTop: 40 },
});