import EventCard from "@/components/events/event_card";
import { EventFormData } from "@/components/events/event_form";
import EventModalFormWrapper from "@/components/events/event_modal_form_wrapper";
import { EventItem } from "@/domain/entities/event_item";
import { mapFormToRequestDTO } from "@/domain/infrastructure/mappers/event_mapper";
import { useEventStore } from "@/store/use_event_store";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";


export default function EventsPage() {
    // Access to events goblal state
  const eventState = useEventStore;
  const [events, setEvents] = useState<EventItem[]>([]); // User fetch of state instead
  const [showForm, setShowForm] = useState(false);
  
    
  function handleFormSubmit(data: EventFormData) {
    eventState.getState()
        .createEvent(
            mapFormToRequestDTO(data)
        )
    setShowForm(false);
  }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Moments Near You</Text>

            { events.length === 1 ? (
                <Text style={styles.emptyText}>No events yet. Create your first one!</Text>
            ) : (
                    <FlatList
                        data={events}
                        keyExtractor={(item) => item.id} 
                        renderItem={({ item }) => <EventCard event={item} />} 
                    />
            )}

            {/* Floating Add Button */}
            <TouchableOpacity style={styles.addButton} onPress={() => {setShowForm(true)}}>
                <Text style={styles.addButtonText}>＋</Text>
            </TouchableOpacity>

            {/* Create Event Modal */}
            <EventModalFormWrapper
                visible={showForm}
                formLabel={"Create a Moment"}
                onClose={() => setShowForm(false)}
                onFormSubmitted={handleFormSubmit}
            />
        </View>
    );
}

// Styles for events page
const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
    header: { fontSize: 24, fontWeight: "bold", marginBottom: 12, marginTop: 30, },
    emptyText: { color: "#999", textAlign: "center", marginTop: 40 },
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
    
});
