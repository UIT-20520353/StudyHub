// Updated ProductDetailScreen.tsx

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar } from "../../../components/common/Avatar";
import { Loading } from "../../../components/common/Loading";
import { EDeliveryMethod, EProductCondition } from "../../../enums/product";
import { useQuickToast, useTranslation } from "../../../hooks";
import { NAMESPACES } from "../../../i18n";
import { productService } from "../../../services/productService";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { addToCart, removeFromCart } from "../../../store/slices/cartSlice";
import { colors } from "../../../theme/colors";
import { fonts } from "../../../theme/fonts";
import { IProduct } from "../../../types/product";
import { useFormatters } from "../../../utils/formatters";
import { ProductConditionBadge } from "../../../components/market/ProductConditionBadge";
import { MainTabNavigationProp } from "../../../types/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import DeleteProductModal from "../../../components/market/DeleteProductModal";

const { width: screenWidth } = Dimensions.get("window");

interface ProductDetailScreenProps {
  navigation: MainTabNavigationProp;
  route: {
    params: {
      productId: number;
    };
  };
}

export default function ProductDetailScreen({
  navigation,
  route,
}: ProductDetailScreenProps) {
  const { user } = useAuth();
  const { t } = useTranslation(NAMESPACES.MARKETPLACE);
  const toast = useQuickToast();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const { formatPrice, formatNumber } = useFormatters();
  const { productId } = route.params;

  const isInCart = cartItems.some((item) => item.id === productId);

  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const handleAddToCart = () => {
    if (product && !isInCart) {
      dispatch(addToCart(product));
      toast.success(
        t("cart.added_success_message", {
          productName: product.title,
        })
      );
    } else if (product && isInCart) {
      dispatch(removeFromCart(product.id));
      toast.success(
        t("cart.removed_success_message", {
          productName: product.title,
        })
      );
    }
  };

  const getProduct = async () => {
    setLoading(true);
    const { ok, body } = await productService.getProductById(productId);
    if (ok && body) {
      setProduct(body);
    }
    setLoading(false);
  };

  const getDeliveryMethodLabel = (method: EDeliveryMethod): string => {
    switch (method) {
      case EDeliveryMethod.SHIPPER:
        return t("delivery.shipper");
      case EDeliveryMethod.HAND_DELIVERY:
        return t("delivery.hand_delivery");
      case EDeliveryMethod.BOTH:
        return t("delivery.both");
      default:
        return method;
    }
  };

  const renderDeliveryIcon = (method: EDeliveryMethod) => {
    switch (method) {
      case EDeliveryMethod.SHIPPER:
        return (
          <Image
            source={require("../../../assets/images/shipping.png")}
            style={styles.deliveryIconImage}
          />
        );
      case EDeliveryMethod.HAND_DELIVERY:
        return (
          <Image
            source={require("../../../assets/images/hand-shake.png")}
            style={styles.deliveryIconImage}
          />
        );
      case EDeliveryMethod.BOTH:
        return (
          <View style={styles.bothIconsContainer}>
            <Image
              source={require("../../../assets/images/shipping.png")}
              style={styles.deliveryIconImageSmall}
            />
            <Image
              source={require("../../../assets/images/hand-shake.png")}
              style={styles.deliveryIconImageSmall}
            />
          </View>
        );
      default:
        return (
          <Image
            source={require("../../../assets/images/shipping.png")}
            style={styles.deliveryIconImage}
          />
        );
    }
  };

  const renderDeliveryMethods = () => {
    if (product?.deliveryMethod === EDeliveryMethod.BOTH) {
      return (
        <View style={styles.deliveryTags}>
          <View style={[styles.deliveryTag, styles.shipperTag]}>
            <Image
              source={require("../../../assets/images/shipping.png")}
              style={styles.deliveryIconImage}
            />
            <Text style={styles.deliveryTagText}>{t("delivery.shipper")}</Text>
          </View>
          <View style={[styles.deliveryTag, styles.handDeliveryTag]}>
            <Image
              source={require("../../../assets/images/hand-shake.png")}
              style={styles.deliveryIconImage}
            />
            <Text style={styles.deliveryTagText}>
              {t("delivery.hand_delivery")}
            </Text>
          </View>
        </View>
      );
    }

    const tagStyle =
      product?.deliveryMethod === EDeliveryMethod.SHIPPER
        ? styles.shipperTag
        : styles.handDeliveryTag;

    return (
      <View style={styles.deliveryTags}>
        <View style={[styles.deliveryTag, tagStyle]}>
          {renderDeliveryIcon(product?.deliveryMethod!)}
          <Text style={styles.deliveryTagText}>
            {getDeliveryMethodLabel(product?.deliveryMethod!)}
          </Text>
        </View>
      </View>
    );
  };

  const handleImageScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const imageIndex = Math.round(contentOffset.x / screenWidth);
    setCurrentImageIndex(imageIndex);
  };

  const handleBuyNow = () => {
    if (product) {
      dispatch(addToCart(product));
      navigation.navigate("Checkout", {
        productIds: [product.id],
        seller: product.seller,
      });
    }
  };

  const handleDeletePress = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteConfirm = async (productId: number) => {
    if (deleting) return;
    setDeleting(true);
    const { ok } = await productService.deleteProduct(productId);
    if (ok) {
      setShowDeleteModal(false);
      toast.success(t("product.delete_success"));
      navigation.goBack();
    } else {
      setShowDeleteModal(false);
      toast.error(t("product.delete_error"));
    }
    setDeleting(false);
  };

  useFocusEffect(
    useCallback(() => {
      getProduct();
    }, [productId])
  );

  if (loading || !product) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Loading />
      </SafeAreaView>
    );
  }

  const hasShipperOption =
    product.deliveryMethod === EDeliveryMethod.SHIPPER ||
    product.deliveryMethod === EDeliveryMethod.BOTH;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background.default}
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {product.title}
        </Text>

        <View style={styles.headerActions}>
          {user && user.id === product.seller.id && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleDeletePress}
            >
              <Ionicons
                name="trash-outline"
                size={22}
                color={colors.error.main}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Image Carousel */}
        <View style={styles.imageSection}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleImageScroll}
            style={styles.imageCarousel}
          >
            {product.images?.length > 0 ? (
              product.images.map((image, index) => (
                <Image
                  key={`image-${index}`}
                  source={{ uri: image.imageUrl }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
              ))
            ) : (
              <View style={styles.imagePlaceholder}>
                <Image
                  source={require("../../../assets/images/unavailable.png")}
                  style={styles.placeholderIcon}
                />
                <Text style={styles.placeholderText}>{t("no_image")}</Text>
              </View>
            )}
          </ScrollView>

          {/* Image Indicator */}
          {product.images?.length > 1 && (
            <View style={styles.imageIndicator}>
              {product.images.map((_, index) => (
                <View
                  key={`indicator-${index}`}
                  style={[
                    styles.indicatorDot,
                    index === currentImageIndex && styles.indicatorDotActive,
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.productInfo}>
          <View style={styles.titleSection}>
            <Text style={styles.productTitle}>{product.title}</Text>
            <Text style={styles.categoryName}>{product.category.name}</Text>
          </View>

          <View style={styles.priceSection}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{formatPrice(product.price)}</Text>
              {hasShipperOption && (
                <Text style={styles.priceNote}>{t("price_note")}</Text>
              )}
            </View>
            <ProductConditionBadge
              condition={product.condition}
              style={{
                paddingHorizontal: 0,
                paddingVertical: 0,
                marginLeft: 8,
              }}
            />
          </View>

          <View style={styles.statsSection}>
            <Text style={styles.viewCount}>
              {formatNumber(product.viewCount)} {t("views")}
            </Text>
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>{t("description")}</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          <View style={styles.deliverySection}>
            <Text style={styles.sectionTitle}>{t("delivery_info")}</Text>

            <View style={styles.deliveryMethodContainer}>
              <Text style={styles.deliveryLabel}>{t("delivery_method")}:</Text>
              {renderDeliveryMethods()}
            </View>

            <View style={styles.deliveryNotes}>
              <View style={styles.noteItem}>
                <Text style={styles.noteText}>
                  {t("delivery.hand_delivery_note")}: {product.address}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.sellerSection}>
            <Text style={styles.sectionTitle}>{t("seller_info")}</Text>
            <View style={styles.sellerCard}>
              <View style={styles.sellerHeader}>
                <Avatar
                  source={product.seller.avatarUrl}
                  size={48}
                  borderColor={colors.avatar.border}
                />
                <View style={styles.sellerDetails}>
                  <Text style={styles.sellerName}>
                    {product.seller.fullName}
                  </Text>
                  <Text style={styles.sellerMeta}>
                    {product.seller.major && `${product.seller.major} • `}
                    {product.seller.university.shortName}
                  </Text>
                  {product.seller.bio && (
                    <Text style={styles.sellerBio} numberOfLines={2}>
                      {product.seller.bio}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {user?.id !== product.seller.id && (
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}
            activeOpacity={0.8}
          >
            <Text style={styles.addToCartText}>
              {isInCart ? t("remove_from_cart") : t("add_to_cart")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buyButton}
            onPress={handleBuyNow}
            activeOpacity={0.8}
          >
            <Text style={styles.buyButtonText}>{t("buy_now")}</Text>
          </TouchableOpacity>
        </View>
      )}

      <DeleteProductModal
        visible={showDeleteModal}
        product={product}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... existing styles ...

  deliveryIconImage: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  deliveryIconImageSmall: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
  bothIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  noteIcon: {
    width: 16,
    height: 16,
    resizeMode: "contain",
    marginTop: 1,
  },

  // ... rest of existing styles
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background.default,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background.default,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.openSans.semiBold,
    color: colors.text.primary,
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageSection: {
    position: "relative",
  },
  imageCarousel: {
    height: 300,
  },
  productImage: {
    width: screenWidth,
    height: 300,
    backgroundColor: colors.background.paper,
  },
  imagePlaceholder: {
    width: screenWidth,
    height: 300,
    borderRadius: 12,
    backgroundColor: colors.background.paper,
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },
  placeholderIcon: {
    width: 80,
    height: 80,
    marginBottom: 4,
    resizeMode: "contain",
  },
  placeholderText: {
    fontFamily: fonts.openSans.medium,
    fontSize: 12,
    color: colors.text.disabled,
    textAlign: "center",
  },
  imageIndicator: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.background.default + "60",
  },
  indicatorDotActive: {
    backgroundColor: colors.background.default,
  },
  productInfo: {
    padding: 20,
    gap: 24,
  },
  titleSection: {
    gap: 8,
  },
  productTitle: {
    fontFamily: fonts.openSans.bold,
    fontSize: 24,
    color: colors.text.primary,
    lineHeight: 32,
  },
  categoryName: {
    fontFamily: fonts.openSans.medium,
    fontSize: 14,
    color: colors.text.hint,
  },
  priceSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontFamily: fonts.openSans.bold,
    fontSize: 28,
    color: colors.primary.main,
  },
  priceNote: {
    fontFamily: fonts.openSans.regular,
    fontSize: 11,
    color: colors.text.hint,
    fontStyle: "italic",
    marginTop: 2,
  },
  statsSection: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
  },
  viewCount: {
    fontFamily: fonts.openSans.regular,
    fontSize: 13,
    color: colors.interaction.view,
  },
  descriptionSection: {
    gap: 12,
  },
  sectionTitle: {
    fontFamily: fonts.openSans.semiBold,
    fontSize: 16,
    color: colors.text.primary,
  },
  description: {
    fontFamily: fonts.openSans.regular,
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  deliverySection: {
    gap: 12,
  },
  deliveryMethodContainer: {
    gap: 8,
  },
  deliveryLabel: {
    fontFamily: fonts.openSans.medium,
    fontSize: 14,
    color: colors.text.secondary,
  },
  deliveryTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  deliveryTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  shipperTag: {
    backgroundColor: colors.status.info + "20",
    borderWidth: 1,
    borderColor: colors.status.info,
  },
  handDeliveryTag: {
    backgroundColor: colors.status.success + "20",
    borderWidth: 1,
    borderColor: colors.status.success,
  },
  deliveryTagText: {
    fontFamily: fonts.openSans.semiBold,
    fontSize: 12,
    color: colors.text.primary,
  },
  deliveryNotes: {
    gap: 8,
    marginTop: 8,
  },
  noteItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: colors.background.light,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary.light,
  },
  noteText: {
    fontFamily: fonts.openSans.regular,
    fontSize: 12,
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 18,
  },
  sellerSection: {
    gap: 12,
  },
  sellerCard: {
    backgroundColor: colors.card.background,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.card.border,
  },
  sellerHeader: {
    flexDirection: "row",
    gap: 12,
  },
  sellerDetails: {
    flex: 1,
    gap: 4,
  },
  sellerName: {
    fontFamily: fonts.openSans.semiBold,
    fontSize: 16,
    color: colors.text.primary,
  },
  sellerMeta: {
    fontFamily: fonts.openSans.regular,
    fontSize: 13,
    color: colors.text.secondary,
  },
  sellerBio: {
    fontFamily: fonts.openSans.regular,
    fontSize: 12,
    color: colors.text.hint,
    marginTop: 4,
  },
  bottomActions: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 16,
    backgroundColor: colors.background.default,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    gap: 12,
  },
  addToCartButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary.main,
    justifyContent: "center",
    alignItems: "center",
  },
  addToCartText: {
    fontFamily: fonts.openSans.semiBold,
    fontSize: 13,
    color: colors.primary.main,
  },
  buyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.primary.main,
    justifyContent: "center",
    alignItems: "center",
  },
  buyButtonText: {
    fontFamily: fonts.openSans.semiBold,
    fontSize: 13,
    color: colors.background.default,
  },
});
