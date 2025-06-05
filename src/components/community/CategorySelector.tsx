import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Pressable,
} from "react-native";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { CheckIcon, ChevronDownIcon } from "../icons";
import { ICategory } from "../../types/category";

interface CategorySelectorProps {
  value: number;
  onSelect: (categoryId: number) => void;
  categories: ICategory[];
  error?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  value,
  onSelect,
  categories,
  error,
  label,
  required = false,
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const selectedCategory = categories.find((cat) => cat.id === value);
  const displayText = selectedCategory
    ? selectedCategory.name
    : "Chọn danh mục";

  const handleSelect = (categoryId: number) => {
    onSelect(categoryId);
    setIsVisible(false);
  };

  const renderCategoryItem = ({ item }: { item: ICategory }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        item.id === value && styles.selectedCategoryItem,
      ]}
      onPress={() => handleSelect(item.id)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.categoryItemText,
          item.id === value && styles.selectedCategoryItemText,
        ]}
      >
        {item.name}
      </Text>
      {item.id === value && <CheckIcon size={20} color={colors.primary.main} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.required}>*</Text>}
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.selector,
          error && styles.selectorError,
          disabled && styles.selectorDisabled,
        ]}
        onPress={() => !disabled && setIsVisible(true)}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <Text
          style={[
            styles.selectorText,
            !selectedCategory && styles.placeholderText,
            disabled && styles.disabledText,
          ]}
          numberOfLines={1}
        >
          {displayText}
        </Text>
        <ChevronDownIcon
          size={20}
          color={disabled ? colors.text.disabled : colors.text.secondary}
        />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Chọn danh mục</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsVisible(false)}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={categories}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.categoryList}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.openSans.semiBold,
    color: colors.text.primary,
  },
  required: {
    fontSize: 14,
    fontFamily: fonts.openSans.semiBold,
    color: colors.error.main,
    marginLeft: 4,
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.input.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.input.border,
    minHeight: 52,
  },
  selectorError: {
    borderColor: colors.error.main,
    backgroundColor: colors.error.background,
  },
  selectorDisabled: {
    backgroundColor: colors.input.disabled,
    borderColor: colors.input.disabledBorder,
  },
  selectorText: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.openSans.regular,
    color: colors.text.primary,
    marginRight: 8,
  },
  placeholderText: {
    color: colors.text.placeholder,
  },
  disabledText: {
    color: colors.text.disabled2,
  },
  errorText: {
    fontSize: 12,
    fontFamily: fonts.openSans.regular,
    color: colors.error.main,
    marginTop: 4,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
  },
  modalContent: {
    backgroundColor: colors.common.white,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: colors.common.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 16,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    backgroundColor: colors.background.paper,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: fonts.openSans.semiBold,
    color: colors.text.primary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.button.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: fonts.openSans.semiBold,
    color: colors.text.secondary,
  },
  categoryList: {
    maxHeight: 300,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  selectedCategoryItem: {
    backgroundColor: colors.primary.main,
  },
  categoryItemText: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.openSans.regular,
    color: colors.text.primary,
  },
  selectedCategoryItemText: {
    fontFamily: fonts.openSans.semiBold,
    color: colors.primary.main,
  },
});
