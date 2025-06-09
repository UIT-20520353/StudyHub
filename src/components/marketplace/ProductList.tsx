import React from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { IProductSummary } from "../../types/product";
import { ProductItem } from "./ProductItem";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";

interface ProductListProps {
  products: IProductSummary[];
  onProductPress: (product: IProductSummary) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onProductPress,
  refreshing = false,
  onRefresh,
}) => {
  const renderItem = ({ item }: { item: IProductSummary }) => (
    <ProductItem product={item} onProductPress={() => onProductPress(item)} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => `product-${item.id}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary.main]}
              tintColor={colors.primary.main}
            />
          ) : undefined
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không có sản phẩm</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    gap: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: colors.common.gray,
    textAlign: "center",
    fontFamily: fonts.openSans.medium,
  },
});
