import React, { useState, useMemo } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  FlatList,
  Pressable,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { IUniversity } from "../../types/university";

interface UniversitySelectorProps {
  value?: number | null;
  onSelect: (universityId: number) => void;
  placeholder?: string;
  error?: string;
  label?: string;
  required?: boolean;
  universities: IUniversity[];
}

export const UniversitySelector: React.FC<UniversitySelectorProps> = ({
  value,
  onSelect,
  placeholder = "Chọn trường đại học",
  error,
  label,
  required = false,
  universities,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");

  const selectedUniversity = useMemo(() => {
    if (!value) return null;
    return universities.find((university) => university.id === value) || null;
  }, [value, universities]);

  const filteredUniversities = universities.filter(
    (university) =>
      university.name.toLowerCase().includes(searchText.toLowerCase()) ||
      university.shortName.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelect = (university: IUniversity) => {
    onSelect(university.id);
    setModalVisible(false);
    setSearchText("");
  };

  // Safe error rendering
  const safeError =
    typeof error === "string"
      ? error
      : error && typeof error === "object"
      ? "Validation error"
      : "";

  const renderUniversityItem = ({ item }: { item: IUniversity }) => (
    <TouchableOpacity
      style={[
        styles.universityItem,
        value === item.id && styles.selectedUniversityItem,
      ]}
      onPress={() => handleSelect(item)}
    >
      <View style={styles.universityInfo}>
        <Text style={styles.universityName}>{item.name}</Text>
        <Text style={styles.universityDetails}>
          {item.shortName} • {item.city}
        </Text>
      </View>
      {value === item.id && (
        <Ionicons
          name="checkmark-circle"
          size={20}
          color={colors.primary.main}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <TouchableOpacity
        style={[styles.selector, safeError && styles.selectorError]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.selectorContent}>
          {selectedUniversity ? (
            <View style={styles.selectedValue}>
              <Text style={styles.selectedText} numberOfLines={1}>
                {selectedUniversity.name}
              </Text>
            </View>
          ) : (
            <Text style={styles.placeholder}>{placeholder}</Text>
          )}
        </View>
        <Ionicons
          name="chevron-down"
          size={20}
          color={safeError ? colors.common.red : colors.text.secondary}
        />
      </TouchableOpacity>

      {safeError ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={14} color={colors.common.red} />
          <Text style={styles.errorText}>{safeError}</Text>
        </View>
      ) : null}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn trường đại học</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Ionicons
                name="search"
                size={20}
                color={colors.text.secondary}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm trường đại học..."
                value={searchText}
                onChangeText={setSearchText}
                autoCapitalize="none"
              />
            </View>

            <FlatList
              data={filteredUniversities}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderUniversityItem}
              style={styles.universityList}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 12,
    fontFamily: fonts.openSans.medium,
    color: colors.text.primary,
    marginBottom: 8,
    marginLeft: 4,
  },
  required: {
    color: colors.common.red,
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.common.white,
    borderRadius: 12,
    minHeight: 56,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
    shadowColor: colors.common.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  selectorError: {
    borderColor: colors.common.red,
  },
  selectorContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedValue: {
    flex: 1,
  },
  selectedText: {
    fontSize: 16,
    fontFamily: fonts.openSans.medium,
    color: colors.text.primary,
  },
  selectedSubtext: {
    fontSize: 12,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
    marginTop: 2,
  },
  placeholder: {
    fontSize: 16,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 12,
    fontFamily: fonts.openSans.regular,
    color: colors.common.red,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.common.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: fonts.openSans.semiBold,
    color: colors.text.primary,
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 20,
    backgroundColor: colors.background.paper,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    fontFamily: fonts.openSans.regular,
    color: colors.text.primary,
  },
  universityList: {
    paddingHorizontal: 20,
  },
  universityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  selectedUniversityItem: {
    backgroundColor: colors.background.paper,
  },
  universityInfo: {
    flex: 1,
  },
  universityName: {
    fontSize: 16,
    fontFamily: fonts.openSans.medium,
    color: colors.text.primary,
  },
  universityDetails: {
    fontSize: 12,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border.light,
    marginHorizontal: 16,
  },
});
