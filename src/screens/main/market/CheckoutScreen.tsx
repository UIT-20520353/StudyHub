import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { Avatar } from "../../../components/common/Avatar";
import { Form } from "../../../components/common/Form";
import { FormField } from "../../../components/common/FormField";
import { Loading } from "../../../components/common/Loading";
import MessageModal from "../../../components/common/MessageModal";
import { EDeliveryMethod } from "../../../enums/product";
import { useTranslation } from "../../../hooks";
import { NAMESPACES } from "../../../i18n";
import { orderService } from "../../../services/orderService";
import { RootState } from "../../../store";
import { useAppDispatch } from "../../../store/hooks";
import { removeMultipleFromCart } from "../../../store/slices/cartSlice";
import { colors } from "../../../theme/colors";
import { fonts } from "../../../theme/fonts";
import { IProduct } from "../../../types/product";
import { IUser } from "../../../types/user";
import { useFormatters } from "../../../utils/formatters";

interface CheckoutScreenProps {
  navigation: any;
  route: {
    params: {
      productIds: number[];
      seller: IUser;
    };
  };
}

interface CheckoutFormValues {
  deliveryAddress: string;
  deliveryPhone: string;
  deliveryNotes: string;
}

interface DeliveryMethodOption {
  value: EDeliveryMethod;
  label: string;
  icon: any;
  description: string;
}

interface ProductImageProps {
  product: IProduct;
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
        source={require("../../../assets/images/unavailable.png")}
        style={styles.placeholderIcon}
      />
    </View>
  );
}

export default function CheckoutScreen({
  navigation,
  route,
}: CheckoutScreenProps) {
  const { productIds, seller } = route.params;
  const { t: tApi } = useTranslation(NAMESPACES.API);
  const { formatPrice } = useFormatters();
  const dispatch = useAppDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const checkoutProducts = cartItems.filter(
    (product) =>
      productIds.includes(product.id) && product.seller.id === seller.id
  );

  const [deliveryMethod, setDeliveryMethod] = useState<EDeliveryMethod>(
    EDeliveryMethod.SHIPPER
  );
  const [loadingOverlay, setLoadingOverlay] = useState<boolean>(false);
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    type: "success" as "success" | "error",
    title: "",
    message: "",
    onOk: () => {},
  });

  const CheckoutSchema = Yup.object().shape({
    deliveryAddress: Yup.string()
      .required("Vui lòng nhập địa chỉ giao hàng")
      .min(10, "Địa chỉ phải có ít nhất 10 ký tự"),
    deliveryPhone: Yup.string()
      .required("Vui lòng nhập số điện thoại")
      .matches(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ"),
    deliveryNotes: Yup.string().default(""),
  });

  const availableDeliveryMethods = React.useMemo(() => {
    const methods = new Set<EDeliveryMethod>();

    checkoutProducts.forEach((product) => {
      if (product.deliveryMethod === EDeliveryMethod.BOTH) {
        methods.add(EDeliveryMethod.SHIPPER);
        methods.add(EDeliveryMethod.HAND_DELIVERY);
      } else {
        methods.add(product.deliveryMethod);
      }
    });

    return Array.from(methods);
  }, [checkoutProducts]);

  const allDeliveryOptions: DeliveryMethodOption[] = [
    {
      value: EDeliveryMethod.SHIPPER,
      label: "Giao hàng tận nơi",
      icon: require("../../../assets/images/shipping.png"),
      description: "Giao hàng qua đơn vị vận chuyển",
    },
    {
      value: EDeliveryMethod.HAND_DELIVERY,
      label: "Giao tay trực tiếp",
      icon: require("../../../assets/images/hand-shake.png"),
      description: "Gặp mặt trực tiếp để giao hàng",
    },
  ];

  const deliveryOptions = allDeliveryOptions.filter((option) =>
    availableDeliveryMethods.includes(option.value)
  );

  const totalPrice = checkoutProducts.reduce(
    (sum, product) => sum + product.price,
    0
  );

  useEffect(() => {
    if (availableDeliveryMethods.length === 1) {
      setDeliveryMethod(availableDeliveryMethods[0]);
    } else if (
      availableDeliveryMethods.length > 0 &&
      !availableDeliveryMethods.includes(deliveryMethod)
    ) {
      setDeliveryMethod(availableDeliveryMethods[0]);
    }
  }, [availableDeliveryMethods]);

  const handleCheckout = async (
    values: CheckoutFormValues,
    helpers: any
  ): Promise<void> => {
    setLoadingOverlay(true);

    const orderData = {
      productIds,
      deliveryMethod,
      deliveryAddress: values.deliveryAddress.trim(),
      deliveryPhone: values.deliveryPhone.trim(),
      deliveryNotes: values.deliveryNotes.trim() || undefined,
    };

    const { ok, errors } = await orderService.createOrder(orderData);

    setLoadingOverlay(false);

    if (ok) {
      dispatch(removeMultipleFromCart(productIds));

      setModalConfig({
        visible: true,
        type: "success",
        title: "Đặt hàng thành công!",
        message:
          "Đơn hàng của bạn đã được gửi đến người bán. Họ sẽ liên hệ với bạn sớm nhất.",
        onOk: () => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Cart" }],
          });
        },
      });
    } else {
      const errorMessage =
        errors?.message ||
        (Array.isArray(errors)
          ? errors.join(", ")
          : "Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.");

      setModalConfig({
        visible: true,
        type: "error",
        title: "Đặt hàng thất bại",
        message: tApi(errorMessage),
        onOk: () => {},
      });
    }

    helpers.setSubmitting(false);
  };

  const handleModalClose = () => {
    setModalConfig({ ...modalConfig, visible: false, onOk: () => {} });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đặt hàng</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Seller Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Người bán</Text>
          <View style={styles.sellerCard}>
            <Avatar source={seller.avatarUrl} size={40} />
            <Text style={styles.sellerName}>{seller.fullName}</Text>
          </View>
        </View>

        {/* Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Sản phẩm ({checkoutProducts.length})
          </Text>
          {checkoutProducts.map((product) => (
            <View key={product.id} style={styles.productItem}>
              <ProductImage product={product} />
              <View style={styles.productInfo}>
                <Text style={styles.productTitle} numberOfLines={2}>
                  {product.title}
                </Text>
                <Text style={styles.productPrice}>
                  {formatPrice(product.price)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Delivery Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức giao hàng</Text>
          {deliveryOptions.length === 1 && (
            <View style={styles.singleMethodNotice}>
              <Ionicons
                name="information-circle"
                size={16}
                color={colors.status.info}
              />
              <Text style={styles.singleMethodText}>
                Chỉ có một phương thức giao hàng khả dụng cho các sản phẩm này
              </Text>
            </View>
          )}
          {deliveryOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.deliveryOption,
                deliveryMethod === option.value &&
                  styles.deliveryOptionSelected,
                deliveryOptions.length === 1 && styles.deliveryOptionDisabled,
              ]}
              onPress={() =>
                deliveryOptions.length > 1 && setDeliveryMethod(option.value)
              }
              disabled={deliveryOptions.length === 1}
            >
              <View style={styles.deliveryOptionContent}>
                <Image source={option.icon} style={styles.deliveryIcon} />
                <View style={styles.deliveryInfo}>
                  <Text style={styles.deliveryLabel}>{option.label}</Text>
                  <Text style={styles.deliveryDescription}>
                    {option.description}
                  </Text>
                </View>
                <View style={styles.radioButton}>
                  {deliveryMethod === option.value && (
                    <View style={styles.radioButtonSelected} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Delivery Information */}
        <Form<CheckoutFormValues>
          initialValues={{
            deliveryAddress: "",
            deliveryPhone: "",
            deliveryNotes: "",
          }}
          validationSchema={CheckoutSchema}
          onSubmit={handleCheckout}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Thông tin giao hàng</Text>

              <FormField
                label="Địa chỉ giao hàng"
                placeholder="Nhập địa chỉ nhận hàng"
                value={values.deliveryAddress}
                onChangeText={handleChange("deliveryAddress")}
                onBlur={handleBlur("deliveryAddress")}
                leftIcon="location-outline"
                error={
                  touched.deliveryAddress && errors.deliveryAddress
                    ? errors.deliveryAddress
                    : ""
                }
                required
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                editable={!isSubmitting}
              />

              <FormField
                label="Số điện thoại"
                placeholder="Nhập số điện thoại liên hệ"
                value={values.deliveryPhone}
                onChangeText={handleChange("deliveryPhone")}
                onBlur={handleBlur("deliveryPhone")}
                leftIcon="call-outline"
                error={
                  touched.deliveryPhone && errors.deliveryPhone
                    ? errors.deliveryPhone
                    : ""
                }
                keyboardType="phone-pad"
                required
                editable={!isSubmitting}
              />

              <FormField
                label="Ghi chú (không bắt buộc)"
                placeholder="Ghi chú thêm cho người bán"
                value={values.deliveryNotes}
                onChangeText={handleChange("deliveryNotes")}
                onBlur={handleBlur("deliveryNotes")}
                leftIcon="document-text-outline"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                editable={!isSubmitting}
              />

              {/* Order Summary */}
              <View style={styles.summarySection}>
                <Text style={styles.sectionTitle}>Tóm tắt đơn hàng</Text>
                <View style={styles.summaryCard}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Tạm tính:</Text>
                    <Text style={styles.summaryValue}>
                      {formatPrice(totalPrice)}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Phí vận chuyển:</Text>
                    <Text style={styles.summaryValue}>
                      {deliveryMethod === EDeliveryMethod.SHIPPER
                        ? "Tính sau"
                        : "Miễn phí"}
                    </Text>
                  </View>
                  <View style={[styles.summaryRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Tổng cộng:</Text>
                    <Text style={styles.totalValue}>
                      {formatPrice(totalPrice)}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.bottomSpacing} />

              {/* Checkout Button */}
              <View style={styles.bottomActions}>
                <TouchableOpacity
                  style={[
                    styles.checkoutButton,
                    (isSubmitting || loadingOverlay) &&
                      styles.checkoutButtonDisabled,
                  ]}
                  onPress={() => handleSubmit()}
                  disabled={isSubmitting || loadingOverlay}
                >
                  <Text style={styles.checkoutButtonText}>
                    {isSubmitting || loadingOverlay
                      ? "Đang xử lý..."
                      : `Đặt hàng • ${formatPrice(totalPrice)}`}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Form>
      </ScrollView>

      {loadingOverlay && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <Loading text="Đang xử lý đơn hàng..." />
          </View>
        </View>
      )}

      <MessageModal
        visible={modalConfig.visible}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={handleModalClose}
        okText={modalConfig.type === "success" ? "Về giỏ hàng" : "Đóng"}
        onOk={modalConfig.onOk}
        backdropDismissible={false}
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
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.openSans.semiBold,
    color: colors.text.primary,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background.gradient,
  },
  section: {
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
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.openSans.semiBold,
    color: colors.text.primary,
    marginBottom: 12,
  },
  sellerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sellerName: {
    fontSize: 14,
    fontFamily: fonts.openSans.medium,
    color: colors.text.primary,
  },
  productItem: {
    flexDirection: "row",
    paddingVertical: 8,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
    marginBottom: 8,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.background.paper,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderIcon: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  productInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  productTitle: {
    fontSize: 13,
    fontFamily: fonts.openSans.medium,
    color: colors.text.primary,
    lineHeight: 18,
  },
  productPrice: {
    fontSize: 14,
    fontFamily: fonts.openSans.semiBold,
    color: colors.primary.main,
    marginTop: 4,
  },
  deliveryOption: {
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 12,
    marginBottom: 8,
    overflow: "hidden",
  },
  deliveryOptionSelected: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.light + "10",
  },
  deliveryOptionDisabled: {
    opacity: 0.8,
  },
  singleMethodNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.status.info + "10",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  singleMethodText: {
    fontSize: 12,
    fontFamily: fonts.openSans.regular,
    color: colors.status.info,
    flex: 1,
  },
  deliveryOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  deliveryIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryLabel: {
    fontSize: 14,
    fontFamily: fonts.openSans.semiBold,
    color: colors.text.primary,
  },
  deliveryDescription: {
    fontSize: 12,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
    marginTop: 2,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border.light,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary.main,
  },
  summarySection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  summaryCard: {
    gap: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: fonts.openSans.medium,
    color: colors.text.primary,
  },
  totalRow: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: fonts.openSans.semiBold,
    color: colors.text.primary,
  },
  totalValue: {
    fontSize: 18,
    fontFamily: fonts.openSans.bold,
    color: colors.primary.main,
  },
  bottomSpacing: {
    height: 100,
  },
  bottomActions: {
    padding: 16,
    backgroundColor: colors.background.default,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  checkoutButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: colors.primary.main,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontFamily: fonts.openSans.semiBold,
    color: colors.common.white,
  },
  checkoutButtonDisabled: {
    opacity: 0.7,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingContainer: {
    backgroundColor: colors.background.default,
    padding: 24,
    borderRadius: 16,
    minWidth: 200,
    alignItems: "center",
  },
});
