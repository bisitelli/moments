import React from "react";
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator } from "react-native";

type JoinButtonProps = {
  onPress: () => void;
  label?: string;                    
  variant?: 'primary' | 'destructive'; // Visual style (optional, default "primary")
  isLoading?: boolean;               // Loading state (optional, default false)
};

/**
 * A floating action button (FAB) for joining or leaving an event.
 */
export default function JoinEventButton({ 
  onPress, 
  label = "Join", 
  variant = "primary",
  isLoading = false
}: JoinButtonProps) {

  // Determine color based on variant
  const isDestructive = variant === 'destructive';
  const backgroundColor = isDestructive ? "#FF3B30" : "#007AFF"; // Red vs Blue

  return (
    <TouchableOpacity 
      style={[styles.joinButton, { backgroundColor }]} 
      onPress={onPress}
      activeOpacity={0.8}
      disabled={isLoading} // Disable interaction when loading
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <Text style={styles.joinButtonText}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

// Styles for this component
const styles = StyleSheet.create({
  joinButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 25,
    minWidth: 100, 
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    
    // Shadow
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  joinButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});