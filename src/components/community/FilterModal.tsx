import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";

interface ICategory {
  id: number;
  name: string;
}

export interface FilterOptions {
  categoryIds: number[];
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  categories: ICategory[];
  initialFilters?: FilterOptions;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  categories,
  initialFilters,
}) => {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(
    initialFilters?.categoryIds || []
  );

  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleReset = () => {
    setSelectedCategoryIds([]);
  };

  const handleApply = () => {
    onApply({
      categoryIds: selectedCategoryIds,
    });
    onClose();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCategoryIds.length > 0) count++;
    return count;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>Hủy</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Bộ lọc</Text>

          <TouchableOpacity onPress={handleReset} style={styles.headerButton}>
            <Text style={styles.resetButtonText}>Đặt lại</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Danh mục</Text>
            <View style={styles.categoriesContainer}>
              {categories.map((category) => {
                const isSelected = selectedCategoryIds.includes(category.id);
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryItem,
                      isSelected && styles.categoryItemSelected,
                    ]}
                    onPress={() => handleCategoryToggle(category.id)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        isSelected && styles.categoryTextSelected,
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>
              Áp dụng
              {getActiveFiltersCount() > 0 && ` (${getActiveFiltersCount()})`}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerButton: {
    minWidth: 60,
  },
  headerButtonText: {
    fontSize: 16,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
  },
  resetButtonText: {
    fontSize: 16,
    fontFamily: fonts.openSans.medium,
    color: colors.primary.main,
    textAlign: "right",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.openSans.semiBold,
    color: colors.text.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.openSans.semiBold,
    color: colors.text.primary,
    marginBottom: 12,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.background.paper,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border.light,
    gap: 6,
  },
  categoryItemSelected: {
    backgroundColor: colors.primary.light,
    borderColor: colors.primary.main,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: fonts.openSans.medium,
    color: colors.text.secondary,
  },
  categoryTextSelected: {
    color: colors.common.black,
    fontFamily: fonts.openSans.semiBold,
  },
  footer: {
    padding: 16,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  applyButton: {
    height: 48,
    backgroundColor: colors.primary.main,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  applyButtonText: {
    fontSize: 16,
    fontFamily: fonts.openSans.semiBold,
    color: colors.common.white,
  },
});
