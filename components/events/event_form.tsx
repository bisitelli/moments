import { InterestTag } from "@/domain/model/enums/interest_tag";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// Define the structure of the event form data
export interface EventFormData {
  title: string;
  description: string;
  image?: string;
  interests?: InterestTag[];
  city: string;
  placeName: string;
  startDate: string;
  endDate: string;
}

// Form component for creating a new event
export default function EventForm({
  onClose,
  onFormSubmitted,
  initialValues,
  formLabel
}:
{
  onClose: () => void,                       
  onFormSubmitted: (data: EventFormData) => void
  initialValues?: EventFormData;
  formLabel: string;                 
}
) {
    // Local state for form fields
  const [form, setForm] = useState<EventFormData>(
    initialValues ?? // Use initial values if provided for editing an event that already exists
    {
      title: "",
      description: "",
      image: "",
      interests: [],
      city: "",
      placeName: "",  
      startDate: "",
      endDate: "",
  });

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [startDateValue, setStartDateValue] = useState<Date | undefined>(
    form.startDate ? new Date(form.startDate) : undefined
  );
  const [endDateValue, setEndDateValue] = useState<Date | undefined>(
    form.endDate ? new Date(form.endDate) : undefined
  );

  // Handle form submission received from the parent
  const handleSave = () => {
    onFormSubmitted(form);          
    setForm({                       
      title: "",
      description: "",
      image: "",
      interests: [],
      city: "",
      placeName: "",
      startDate: "",
      endDate: "",
    });
  };

  // TODO: Add field validation as needed
  return (
      <View>
        <Text style={styles.modalHeader}>{formLabel}</Text>
        <Text style={styles.fieldLabel}>Title</Text>
        <TextInput
          placeholder="Enter a title for your event"
          value={form.title}
          onChangeText={(text) => setForm({ ...form, title: text })}
          style={styles.input}
        />
        <Text style={styles.fieldLabel}>Description</Text>
        <TextInput
          placeholder="Describe what your event is about"
          value={form.description}
          onChangeText={(text) => setForm({ ...form, description: text })}
          style={styles.input}
        />
        <Text style={styles.fieldLabel}>Image URL (optional)</Text>
        <TextInput
          placeholder="Link to an image for your event"
          value={form.image}
          onChangeText={(text) => setForm({ ...form, image: text })}
          style={styles.input}
        />
        {/* <TextInput  //TODO: Change to multi-select dropdown later
          placeholder="Interests"
          value={form.interests}
          onChangeText={(text) => setForm({ ...form, interests: text })}
          style={styles.input}
        /> */}
        <Text style={styles.fieldLabel}>City</Text>
        <TextInput
          placeholder="Where is the event happening?"
          value={form.city}
          onChangeText={(text) => setForm({ ...form, city: text })}
          style={styles.input}
        />
        <Text style={styles.fieldLabel}>Place name</Text>
        <TextInput
          placeholder="Venue or location name"
          value={form.placeName}
          onChangeText={(text) => setForm({ ...form, placeName: text })}
          style={styles.input}
        />
        <Text style={styles.fieldLabel}>Start date</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowStartPicker(true)}
        >
          <Text style={{ color: form.startDate ? "#000" : "#9ca3af" }}>
            {form.startDate || "Select start date"}
          </Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={startDateValue || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(_event, selectedDate) => {
              if (Platform.OS !== "ios") {
                setShowStartPicker(false);
              }
              if (selectedDate) {
                setStartDateValue(selectedDate);
                const iso = selectedDate.toISOString();
                setForm((prev) => ({ ...prev, startDate: iso }));
              }
            }}
          />
        )}
        <Text style={styles.fieldLabel}>End date</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowEndPicker(true)}
        >
          <Text style={{ color: form.endDate ? "#000" : "#9ca3af" }}>
            {form.endDate || "Select end date"}
          </Text>
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={endDateValue || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(_event, selectedDate) => {
              if (Platform.OS !== "ios") {
                setShowEndPicker(false);
              }
              if (selectedDate) {
                setEndDateValue(selectedDate);
                const iso = selectedDate.toISOString();
                setForm((prev) => ({ ...prev, endDate: iso }));
              }
            }}
          />
        )}

        <View style={styles.formButtons}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
          >
            <Text
              style={[
                styles.saveButton,
                !form.title.trim() && { color: "#aaa" },
              ]}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>
  );
}

// Styles for the modal and form
const styles = StyleSheet.create({
  modalHeader: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  formButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: { color: "#555", fontSize: 16 },
  saveButton: { color: "#007AFF", fontWeight: "bold", fontSize: 16 },
});