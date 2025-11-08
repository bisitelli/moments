import { KeyboardAvoidingView, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import EventForm, { EventFormData } from "./event_form";

// Modal component to wrap the EventForm for creating or updating a new event
export default function EventModalFormWrapper(
{
    visible,
    onClose,
    onFormSubmitted,
    initialValues,
    formLabel = "Event form"
}:
{
    visible: boolean;
    onClose: () => void;
    onFormSubmitted: (data: EventFormData) => void;
    initialValues?: EventFormData; // Optional initial values for editing existing event
    formLabel?: string;
}
 ) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.modalContainer}>
              <EventForm
                initialValues={initialValues}
                formLabel={formLabel}
                onFormSubmitted={(data: EventFormData) => onFormSubmitted(data)}
                onClose={onClose}
            />
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 16,
  },
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
  },
});

