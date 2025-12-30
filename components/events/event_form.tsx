import { InterestTag } from "@/domain/model/enums/interest_tag";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

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

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const [startDateValue, setStartDateValue] = useState<Date | undefined>(
    form.startDate ? new Date(form.startDate) : undefined
  );
  const [endDateValue, setEndDateValue] = useState<Date | undefined>(
    form.endDate ? new Date(form.endDate) : undefined
  );

  // Handle form submission received from the parent
  const handleSave = () => {
    const start = form.startDate ? new Date(form.startDate) : null;
    const end = form.endDate ? new Date(form.endDate) : null;

    if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
      Alert.alert("Invalid dates", "Please select both a start and end date.");
      return;
    }

    const diffMs = end.getTime() - start.getTime();
    const maxDurationMs = 24 * 60 * 60 * 1000;

    if (diffMs <= 0 || diffMs >= maxDurationMs) {
      Alert.alert(
        "Invalid duration",
        "The event must be longer than 0 hours and shorter than 24 hours."
      );
      return;
    }

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
          onPress={() => setShowStartDatePicker(true)}
        >
          <Text style={{ color: form.startDate ? "#000" : "#9ca3af" }}>
            {startDateValue
              ? startDateValue.toLocaleDateString()
              : "Select start date"}
          </Text>
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
            value={startDateValue || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(_event, selectedDate) => {
              if (Platform.OS !== "ios") {
                setShowStartDatePicker(false);
              }
              if (selectedDate) {
                // Preserve previous time if set
                const base = startDateValue || new Date();
                const combined = new Date(selectedDate);
                combined.setHours(
                  base.getHours(),
                  base.getMinutes(),
                  0,
                  0
                );
                setStartDateValue(combined);
                setForm((prev) => ({ ...prev, startDate: combined.toISOString() }));
              }
            }}
          />
        )}
        <Text style={styles.fieldLabel}>Start time</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowStartTimePicker(true)}
        >
          <Text style={{ color: startDateValue ? "#000" : "#9ca3af" }}>
            {startDateValue
              ? startDateValue.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Select start time"}
          </Text>
        </TouchableOpacity>
        {showStartTimePicker && (
          <DateTimePicker
            value={startDateValue || new Date()}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(_event, selectedTime) => {
              if (Platform.OS !== "ios") {
                setShowStartTimePicker(false);
              }
              if (selectedTime) {
                const base = startDateValue || new Date();
                const combined = new Date(base);
                combined.setHours(
                  selectedTime.getHours(),
                  selectedTime.getMinutes(),
                  0,
                  0
                );
                setStartDateValue(combined);
                setForm((prev) => ({ ...prev, startDate: combined.toISOString() }));
              }
            }}
          />
        )}
        <Text style={styles.fieldLabel}>End date</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowEndDatePicker(true)}
        >
          <Text style={{ color: form.endDate ? "#000" : "#9ca3af" }}>
            {endDateValue
              ? endDateValue.toLocaleDateString()
              : "Select end date"}
          </Text>
        </TouchableOpacity>
        {showEndDatePicker && (
          <DateTimePicker
            value={endDateValue || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(_event, selectedDate) => {
              if (Platform.OS !== "ios") {
                setShowEndDatePicker(false);
              }
              if (selectedDate) {
                const base = endDateValue || new Date();
                const combined = new Date(selectedDate);
                combined.setHours(
                  base.getHours(),
                  base.getMinutes(),
                  0,
                  0
                );
                setEndDateValue(combined);
                setForm((prev) => ({ ...prev, endDate: combined.toISOString() }));
              }
            }}
          />
        )}
        <Text style={styles.fieldLabel}>End time</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowEndTimePicker(true)}
        >
          <Text style={{ color: endDateValue ? "#000" : "#9ca3af" }}>
            {endDateValue
              ? endDateValue.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Select end time"}
          </Text>
        </TouchableOpacity>
        {showEndTimePicker && (
          <DateTimePicker
            value={endDateValue || new Date()}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(_event, selectedTime) => {
              if (Platform.OS !== "ios") {
                setShowEndTimePicker(false);
              }
              if (selectedTime) {
                const base = endDateValue || new Date();
                const combined = new Date(base);
                combined.setHours(
                  selectedTime.getHours(),
                  selectedTime.getMinutes(),
                  0,
                  0
                );
                setEndDateValue(combined);
                setForm((prev) => ({ ...prev, endDate: combined.toISOString() }));
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