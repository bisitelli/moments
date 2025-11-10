import React, { useMemo, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  FlatList,
} from "react-native";
import { FilterTag } from "@/domain/model/enums/filter_tag";

export type FilterOption = {
  tag: FilterTag;
  label: string;
  render: () => React.ReactNode;
};

interface Props {
  options: FilterOption[];
  selectedTag: FilterTag | null;
  onSelect: (render: () => React.ReactNode, tag: FilterTag) => void;
  triggerLabel?: string;
}

export default function DropdownButtonFilter({
  options,
  selectedTag,
  onSelect,
  triggerLabel = "Filter",
}: Props) {
  const [open, setOpen] = useState(false);

  const selectedLabel = useMemo(() => {
    const found = options.find((o) => o.tag === selectedTag);
    return found?.label ?? triggerLabel;
  }, [options, selectedTag, triggerLabel]);

  const close = () => setOpen(false);

  return (
    <View>
      {/* Trigger button */}
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={styles.trigger}
        activeOpacity={0.8}
      >
        <Text style={styles.triggerText}>{selectedLabel}</Text>
        <Text style={styles.caret}>▼</Text>
      </TouchableOpacity>

      {/* Dropdown overlay */}
      <Modal visible={open} transparent animationType="fade" onRequestClose={close}>
        {/* Backdrop: tap outside to close */}
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={close}>
          {/* Prevent closing when tapping inside the card */}
          <TouchableWithoutFeedback>
            {/* Wrapper to right-align the menu */}
            <View style={styles.menuWrapper}>
              <View style={styles.menuCard}>
                <FlatList
                  data={options}
                  keyExtractor={(item) => String(item.tag)}
                  renderItem={({ item }) => {
                    const active = item.tag === selectedTag;
                    return (
                      <TouchableOpacity
                        style={[styles.itemRow, active && styles.itemRowActive]}
                        onPress={() => {
                          onSelect(item.render, item.tag);
                          close();
                        }}
                      >
                        <Text style={[styles.itemText, active && styles.itemTextActive]}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const MENU_WIDTH = 220; // narrow menu width

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#007AFF",
    borderWidth: 1,
    borderColor: "#007AFF", // match bg
  },
  // ← trigger text in white
  triggerText: { fontWeight: "700", color: "#FFFFFF" },
  // caret also white to match (optional, looks better)
  caret: { marginLeft: 4, color: "#FFFFFF" },

  // overlay
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    paddingHorizontal: 20,
    paddingTop: 100, // drop the menu a bit from the header
  },

  // right align the menu
  menuWrapper: {
    alignItems: "flex-end",
  },

  // narrow menu card aligned to the right
  menuCard: {
    width: MENU_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 6,
    // shadows
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  itemRow: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  itemRowActive: {
    backgroundColor: "#007AFF12",
  },
  itemText: { color: "#222", fontSize: 16 },
  itemTextActive: { color: "#007AFF", fontWeight: "700" },
  separator: { height: 6 },
});
