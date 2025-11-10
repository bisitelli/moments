// EventModalFormWrapper.tsx
import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import EventForm, { EventFormData } from "./event_form";

type Props = {
  visible: boolean;
  onClose: () => void;
  onFormSubmitted: (data: EventFormData) => void;
  initialValues?: EventFormData;
  formLabel?: string;
  /**
   * If true, tapping outside will only dismiss the keyboard (when open)
   * instead of closing the modal immediately.
   */
  dismissKeyboardOnly?: boolean;
};

export default function EventModalFormWrapper({
  visible,
  onClose,
  onFormSubmitted,
  initialValues,
  formLabel = "Event form",
  dismissKeyboardOnly = false,
}: Props) {
  const handleBackdropPress = () => {
    // Always try to dismiss the keyboard first
    Keyboard.dismiss();
    if (!dismissKeyboardOnly) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose} // Android back button
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        {/* Fullscreen clickable backdrop */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleBackdropPress}
        >
          <SafeAreaView style={styles.safeArea}>
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Prevent closing when tapping inside the card */}
              <TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                  <EventForm
                    initialValues={initialValues}
                    formLabel={formLabel}
                    onFormSubmitted={(data: EventFormData) => onFormSubmitted(data)}
                    onClose={onClose}
                  />
                </View>
              </TouchableWithoutFeedback>
            </ScrollView>
          </SafeAreaView>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // The overlay container around the backdrop (no background here)
  overlay: {
    flex: 1,
  },
  // Fullscreen dimmed backdrop that receives outside taps
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  safeArea: {
    flex: 1,
  },
  // Center the card and allow scrolling when needed
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 16,
  },
  // The actual card styling
  modalContainer: {
    backgroundColor: "white",
    width: "100%",
    maxWidth: 600,
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    overflow: "hidden",
  },
});
