import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState, useEffect, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Loading } from "../../components/common/Loading";
import SearchInput from "../../components/common/SearchInput";
import { ProductList } from "../../components/marketplace";
import {
  ProductFilterModal,
  ProductFilterOptions,
} from "../../components/marketplace/ProductFilterModal";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/category";
import { colors } from "../../theme/colors";
import { MainTabNavigationProp } from "../../types/navigation";
import { IProductSummary } from "../../types/product";
import { ICategory } from "../../types/category";
import { MarketplaceTab } from "../../components/marketplace/Tab";
import { useAuth } from "../../contexts/AuthContext";

interface MarketplaceScreenProps {
  navigation: MainTabNavigationProp;
}

export default function MarketplaceScreen({
  navigation,
}: MarketplaceScreenProps) {
  const { user } = useAuth();
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState<IProductSummary[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [debouncedSearchText, setDebouncedSearchText] = useState<string>("");
  const [currentFilters, setCurrentFilters] = useState<ProductFilterOptions>({
    categoryIds: [],
    conditions: [],
    deliveryMethods: [],
  });
  const [activeTab, setActiveTab] = useState<"ALL" | "MY">("ALL");

  const getProducts = async () => {
    setLoading(true);
    const { ok, body } = await productService.getProducts({
      title: debouncedSearchText,
      conditions:
        currentFilters.conditions.length > 0
          ? currentFilters.conditions
          : undefined,
      deliveryMethods:
        currentFilters.deliveryMethods.length > 0
          ? currentFilters.deliveryMethods
          : undefined,
      categoryIds:
        currentFilters.categoryIds.length > 0
          ? currentFilters.categoryIds
          : undefined,
    });
    if (ok && body) {
      setProducts(body.items);
    }
    setLoading(false);
  };

  const getCategories = useCallback(async () => {
    const { ok, body } = await categoryService.getProductCategories();
    if (ok) {
      setCategories(body);
    }
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await getProducts();
    setRefreshing(false);
  };

  const handleFilterPress = () => {
    setShowFilterModal(true);
  };

  const handleFilterApply = (filters: ProductFilterOptions) => {
    setCurrentFilters(filters);
    console.log("Applied product filters:", filters);
  };

  const handleFilterClose = () => {
    setShowFilterModal(false);
  };

  const handleProductPress = (product: IProductSummary) => {
    navigation.navigate("ProductDetail", { productId: product.id });
  };

  const handleCreateProduct = () => {
    navigation.navigate("CreateProduct");
  };

  const filterProducts = useMemo(() => {
    if (activeTab === "ALL") {
      return products;
    }
    return products.filter((product) => product.seller.id === user?.id);
  }, [activeTab, products, user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  useFocusEffect(
    useCallback(() => {
      getProducts();
    }, [debouncedSearchText, currentFilters])
  );

  useFocusEffect(
    useCallback(() => {
      getCategories();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <SearchInput
        value={searchText}
        onChangeText={setSearchText}
        loading={loading}
        suggestions={[]}
        onFilterPress={handleFilterPress}
        placeholder="Tìm kiếm sản phẩm..."
      />

      <MarketplaceTab activeTab={activeTab} onTabChange={setActiveTab} />

      {loading ? (
        <Loading />
      ) : (
        <ProductList
          products={filterProducts}
          onProductPress={handleProductPress}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={handleCreateProduct}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <ProductFilterModal
        visible={showFilterModal}
        onClose={handleFilterClose}
        onApply={handleFilterApply}
        categories={categories}
        initialFilters={currentFilters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.gradient,
    paddingHorizontal: 16,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary.main || "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  fabIcon: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
