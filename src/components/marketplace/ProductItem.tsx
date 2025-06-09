import React, { useState } from "react";
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useTranslation } from "../../hooks";
import { NAMESPACES } from "../../i18n";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { IProductSummary } from "../../types/product";
import { useFormatters } from "../../utils/formatters";
import { Avatar } from "../common/Avatar";
import { ProductConditionBadge } from "../market/ProductConditionBadge";

interface ProductItemProps {
  product: IProductSummary;
  onProductPress: (product: IProductSummary) => void;
  cardStyle?: StyleProp<ViewStyle>;
}

export const ProductItem: React.FunctionComponent<ProductItemProps> = ({
  product,
  onProductPress,
  cardStyle,
}) => {
  const { t } = useTranslation(NAMESPACES.MARKETPLACE);
  const { formatTimeAgo } = useFormatters();

  const [imageError, setImageError] = useState<boolean>(false);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("vi-VN").format(price) + t("currency");
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const renderProductImage = () => {
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
        <Text style={styles.placeholderText}>{t("no_image")}</Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[styles.productCard, cardStyle]}
      activeOpacity={0.8}
      onPress={() => onProductPress(product)}
    >
      <View style={styles.imageContainer}>
        {renderProductImage()}
        <ProductConditionBadge condition={product.condition} />
      </View>

      <View style={styles.productInfo}>
        <View style={styles.productHeader}>
          <Text style={styles.productTitle} numberOfLines={2}>
            {product.title}
          </Text>
          <Text style={styles.categoryName}>{product.categoryName}</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
        </View>

        <View style={styles.sellerInfo}>
          <View style={styles.sellerDetails}>
            <Avatar source={product.seller.avatarUrl} size={32} />
            <View style={styles.sellerTextInfo}>
              <Text style={styles.sellerName} numberOfLines={1}>
                {product.seller.fullName}
              </Text>
              <Text style={styles.sellerMeta} numberOfLines={1}>
                {product.seller.major && `${product.seller.major} • `}
                {product.seller.university.shortName}
              </Text>
            </View>
          </View>

          <View style={styles.timeContainer}>
            <Text style={styles.timeAgo}>
              {formatTimeAgo(product.createdAt)}
            </Text>
          </View>
        </View>

        <View style={styles.productFooter}>
          <Text style={styles.viewCount}>
            {formatNumber(product.viewCount)}
            {t("views")}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: colors.card.background,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.card.border,
    shadowColor: colors.card.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  imageContainer: {
    position: "relative",
    alignItems: "center",
    gap: 8,
  },
  productImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    backgroundColor: colors.background.paper,
  },
  productInfo: {
    gap: 8,
  },
  productHeader: {
    gap: 4,
  },
  productTitle: {
    fontFamily: fonts.openSans.bold,
    fontSize: 16,
    color: colors.text.primary,
    lineHeight: 22,
  },
  categoryName: {
    fontFamily: fonts.openSans.medium,
    fontSize: 12,
    color: colors.text.hint,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontFamily: fonts.openSans.bold,
    fontSize: 18,
    color: colors.primary.main || "#2196F3",
  },
  sellerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sellerDetails: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 8,
  },
  sellerTextInfo: {
    flex: 1,
    gap: 2,
  },
  sellerName: {
    fontFamily: fonts.openSans.semiBold,
    fontSize: 13,
    color: colors.text.primary,
  },
  sellerMeta: {
    fontFamily: fonts.openSans.regular,
    fontSize: 11,
    color: colors.text.secondary,
  },
  timeContainer: {
    backgroundColor: colors.common.gray1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  timeAgo: {
    fontFamily: fonts.openSans.medium,
    fontSize: 10,
    color: colors.text.hint,
  },
  productFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
  },
  viewCount: {
    fontFamily: fonts.openSans.regular,
    fontSize: 11,
    color: colors.interaction.view,
  },
  imagePlaceholder: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    backgroundColor: colors.background.paper,
    borderWidth: 2,
    borderColor: colors.border.subtle,
    borderStyle: "dashed",
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
});
