import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  EDeliveryMethod,
  EProductCondition,
  EProductStatus,
} from "../../enums/product";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { useTranslation } from "../../hooks";
import { NAMESPACES } from "../../i18n";

interface ICategory {
  id: number;
  name: string;
}

export interface ProductFilterOptions {
  categoryIds: number[];
  conditions: EProductCondition[];
  deliveryMethods: EDeliveryMethod[];
}

interface ProductFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: ProductFilterOptions) => void;
  categories: ICategory[];
  initialFilters?: ProductFilterOptions;
}

export const ProductFilterModal: React.FC<ProductFilterModalProps> = ({
  visible,
  onClose,
  onApply,
  categories,
  initialFilters,
}) => {
  const { t: tMarketplace } = useTranslation(NAMESPACES.MARKETPLACE);
  const { t: tCommon } = useTranslation(NAMESPACES.COMMON);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(
    initialFilters?.categoryIds || []
  );
  const [selectedConditions, setSelectedConditions] = useState<
    EProductCondition[]
  >(initialFilters?.conditions || []);
  const [selectedDeliveryMethods, setSelectedDeliveryMethods] = useState<
    EDeliveryMethod[]
  >(initialFilters?.deliveryMethods || []);

  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleConditionToggle = (condition: EProductCondition) => {
    setSelectedConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition]
    );
  };

  const handleDeliveryMethodToggle = (method: EDeliveryMethod) => {
    setSelectedDeliveryMethods((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    );
  };

  const handleReset = () => {
    setSelectedCategoryIds([]);
    setSelectedConditions([]);
    setSelectedDeliveryMethods([]);
  };

  const handleApply = () => {
    const filters: ProductFilterOptions = {
      categoryIds: selectedCategoryIds,
      conditions: selectedConditions,
      deliveryMethods: selectedDeliveryMethods,
    };
    onApply(filters);
    onClose();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCategoryIds.length > 0) count++;
    if (selectedConditions.length > 0) count++;
    if (selectedDeliveryMethods.length > 0) count++;
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
            <Text style={styles.headerButtonText}>{tCommon("cancel")}</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{tMarketplace("filter_title")}</Text>

          <TouchableOpacity onPress={handleReset} style={styles.headerButton}>
            <Text style={styles.resetButtonText}>{tCommon("reset")}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{tCommon("category")}</Text>
            <View style={styles.optionsContainer}>
              {categories.map((category) => {
                const isSelected = selectedCategoryIds.includes(category.id);
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.optionItem,
                      isSelected && styles.optionItemSelected,
                    ]}
                    onPress={() => handleCategoryToggle(category.id)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tình trạng</Text>
            <View style={styles.optionsContainer}>
              {Object.values(EProductCondition).map((condition) => {
                const isSelected = selectedConditions.includes(condition);
                return (
                  <TouchableOpacity
                    key={condition}
                    style={[
                      styles.optionItem,
                      isSelected && styles.optionItemSelected,
                    ]}
                    onPress={() => handleConditionToggle(condition)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {tMarketplace(`condition.${condition.toLowerCase()}`)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {tMarketplace("delivery_method")}
            </Text>
            <View style={styles.optionsContainer}>
              {Object.values(EDeliveryMethod).map((method) => {
                const isSelected = selectedDeliveryMethods.includes(method);
                return (
                  <TouchableOpacity
                    key={method}
                    style={[
                      styles.optionItem,
                      isSelected && styles.optionItemSelected,
                    ]}
                    onPress={() => handleDeliveryMethodToggle(method)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {tMarketplace(`delivery.${method.toLowerCase()}`)}
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
              {tCommon("apply")}
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
  textInput: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: fonts.openSans.regular,
    color: colors.text.primary,
    backgroundColor: colors.background.paper,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionItem: {
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
  optionItemSelected: {
    backgroundColor: colors.primary.light,
    borderColor: colors.primary.main,
  },
  optionText: {
    fontSize: 14,
    fontFamily: fonts.openSans.medium,
    color: colors.text.secondary,
  },
  optionTextSelected: {
    color: colors.common.black,
    fontFamily: fonts.openSans.semiBold,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  priceInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: fonts.openSans.regular,
    color: colors.text.primary,
    backgroundColor: colors.background.paper,
  },
  priceSeparator: {
    fontSize: 16,
    fontFamily: fonts.openSans.medium,
    color: colors.text.secondary,
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
