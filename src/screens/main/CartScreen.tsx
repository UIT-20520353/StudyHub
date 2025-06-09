import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "../../components/common/Avatar";
import MessageModal from "../../components/common/MessageModal";
import { RootState } from "../../store";
import { removeFromCart } from "../../store/slices/cartSlice";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { MainTabNavigationProp } from "../../types/navigation";
import { IProduct } from "../../types/product";

interface CartScreenProps {
  navigation: MainTabNavigationProp;
}

interface ProductImageProps {
  product: IProduct;
}

interface SellerGroup {
  sellerId: number;
  sellerName: string;
  sellerAvatar: string;
  products: IProduct[];
  totalPrice: number;
}

function ProductImage({ product }: ProductImageProps) {
  const [imageError, setImageError] = useState<boolean>(false);

  if (product.primaryImageUrl && !imageError) {
    return (
      <Image
        source={{ uri: product.primaryImageUrl }}
        style={styles.productImage}
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <View style={styles.imagePlaceholder}>
      <Image
        source={require("../../assets/images/unavailable.png")}
        style={styles.placeholderIcon}
      />
    </View>
  );
}

export default function CartScreen({ navigation }: CartScreenProps) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [removeModalVisible, setRemoveModalVisible] = useState<boolean>(false);
  const [productToRemove, setProductToRemove] = useState<IProduct | null>(null);

  const sellerGroups = React.useMemo(() => {
    const groups: { [key: number]: SellerGroup } = {};

    cartItems.forEach((product) => {
      const sellerId = product.seller.id;
      if (!groups[sellerId]) {
        groups[sellerId] = {
          sellerId,
          sellerName: product.seller.fullName,
          sellerAvatar: product.seller.avatarUrl,
          products: [],
          totalPrice: 0,
        };
      }
      groups[sellerId].products.push(product);
      groups[sellerId].totalPrice += product.price;
    });

    return Object.values(groups);
  }, [cartItems]);

  const handleRemoveItem = (product: IProduct) => {
    setProductToRemove(product);
    setRemoveModalVisible(true);
  };

  const handleConfirmRemove = () => {
    if (productToRemove) {
      dispatch(removeFromCart(productToRemove.id));
      setRemoveModalVisible(false);
      setProductToRemove(null);
    }
  };

  const handleCheckout = (sellerGroup: SellerGroup) => {
    navigation.navigate("Checkout", {
      productIds: sellerGroup.products.map((product) => product.id),
      seller: sellerGroup.products[0].seller,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Giỏ hàng trống</Text>
          <Text style={styles.emptyDescription}>
            Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
          </Text>
          <TouchableOpacity
            style={styles.continueShoppingButton}
            onPress={() => navigation.navigate("Marketplace")}
          >
            <Text style={styles.continueShoppingText}>Tiếp tục mua sắm</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {sellerGroups.map((sellerGroup) => (
          <View key={sellerGroup.sellerId} style={styles.sellerSection}>
            <View style={styles.sellerHeader}>
              <Avatar source={sellerGroup.sellerAvatar} size={40} />
              <Text style={styles.sellerName} numberOfLines={1}>
                {sellerGroup.sellerName}
              </Text>
            </View>

            {sellerGroup.products.map((product, index) => (
              <View
                key={product.id}
                style={[
                  styles.productItem,
                  index === sellerGroup.products.length - 1 && {
                    borderBottomWidth: 0,
                  },
                ]}
              >
                <ProductImage product={product} />

                <View style={styles.productInfo}>
                  <Text style={styles.productTitle} numberOfLines={2}>
                    {product.title}
                  </Text>
                  <Text style={styles.productPrice}>
                    {formatPrice(product.price)}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveItem(product)}
                >
                  <Ionicons name="trash" size={24} color={colors.error.main} />
                </TouchableOpacity>
              </View>
            ))}

            {/* Seller Total and Checkout */}
            <View style={styles.sellerFooter}>
              <View style={styles.totalSection}>
                <Text style={styles.totalLabel}>
                  Tổng cộng ({sellerGroup.products.length} sản phẩm):
                </Text>
                <Text style={styles.totalPrice}>
                  {formatPrice(sellerGroup.totalPrice)}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={() => handleCheckout(sellerGroup)}
              >
                <Text style={styles.checkoutButtonText}>Đặt hàng</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <MessageModal
        visible={removeModalVisible}
        type="warning"
        title="Xóa sản phẩm"
        message={
          <Text style={{ fontFamily: fonts.openSans.regular, fontSize: 13 }}>
            Bạn có chắc chắn muốn xóa sản phẩm{" "}
            <Text style={{ fontFamily: fonts.openSans.bold }}>
              {productToRemove?.title}
            </Text>{" "}
            khỏi giỏ hàng?
          </Text>
        }
        showOkButton={false}
        showConfirmButton={true}
        showCancelButton={true}
        confirmText="Xóa"
        onConfirm={handleConfirmRemove}
        onCancel={() => {
          setRemoveModalVisible(false);
          setProductToRemove(null);
        }}
      />
    </SafeAreaView>
  );
}

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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    backgroundColor: colors.background.default,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: colors.text.primary,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.openSans.semiBold,
    color: colors.text.primary,
  },
  placeholder: {
    width: 32,
  },
  clearButton: {
    fontSize: 14,
    color: colors.error.main,
    fontFamily: fonts.openSans.medium,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background.gradient,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: fonts.openSans.semiBold,
    color: colors.text.primary,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  continueShoppingButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  continueShoppingText: {
    fontSize: 16,
    fontFamily: fonts.openSans.medium,
    color: colors.common.white,
  },
  sellerSection: {
    backgroundColor: colors.background.default,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.card.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sellerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    marginBottom: 12,
  },
  sellerName: {
    fontSize: 14,
    fontFamily: fonts.openSans.semiBold,
    color: colors.text.primary,
  },
  productItem: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
    gap: 10,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: colors.background.paper,
    borderWidth: 2,
    borderColor: colors.border.subtle,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
    marginRight: 12,
  },
  placeholderIcon: {
    width: "90%",
    height: "90%",
    resizeMode: "contain",
  },
  productInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  productTitle: {
    fontSize: 14,
    fontFamily: fonts.openSans.bold,
    color: colors.text.primary,
    lineHeight: 18,
  },
  productConditionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  productConditionLabel: {
    fontSize: 12,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
  },
  productCondition: {
    fontSize: 12,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
    marginTop: 4,
  },
  productPrice: {
    fontSize: 14,
    fontFamily: fonts.openSans.medium,
    color: colors.primary.main,
    marginTop: 4,
  },
  removeButton: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  sellerFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: fonts.openSans.medium,
    color: colors.text.primary,
  },
  totalPrice: {
    fontSize: 18,
    fontFamily: fonts.openSans.bold,
    color: colors.primary.main,
  },
  checkoutButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutButtonText: {
    fontSize: 16,
    fontFamily: fonts.openSans.semiBold,
    color: colors.common.white,
  },
  bottomSpacing: {
    height: 24,
  },
});
