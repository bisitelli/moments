import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";

interface FilterDropdownButtonProps {
  options: [string, () => void][];
}

export default function FilterDropdownButton({ options }: FilterDropdownButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleDropdown = () => {
    const toValue = isOpen ? 0 : 1;
    Animated.timing(animation, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setIsOpen(!isOpen);
  };

  const dropdownStyle = {
    opacity: animation,
    transform: [
      {
        scaleY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.9, 1],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      {/* Botón principal */}
      <TouchableOpacity style={styles.mainButton} onPress={toggleDropdown}>
        <Text style={styles.mainButtonText}>Filter ⌄</Text>
      </TouchableOpacity>

      {/* Menú flotante (sin overlay ni cierre por fuera) */}
      {isOpen && (
        <Animated.View style={[styles.dropdown, dropdownStyle]}>
          {options.map(([label, callback], index) => (
            <React.Fragment key={index}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => {
                  callback();
                  setIsOpen(false);
                }}
              >
                <Text style={styles.optionText}>{label}</Text>
              </TouchableOpacity>

              {/* Separador entre opciones */}
              {index < options.length - 1 && <View style={styles.separator} />}
            </React.Fragment>
          ))}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
    marginBottom: -8,
    marginRight: 15,
    position: "relative",
    zIndex: 10,
  },
  mainButton: {
    backgroundColor: "#007AFF",
    height: 45,
    justifyContent: "center",
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  mainButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  dropdown: {
    position: "absolute",
    top: 50,
    right: 0,
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    width: 180,
    zIndex: 20,
    overflow: "hidden",
  },
  optionButton: {
    paddingVertical: 14,
    paddingHorizontal: 15,
  },
  optionText: {
    fontSize: 15,
    color: "#333",
  },
  separator: {
    height: 1.5,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 10,
  },
});
