import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../../components/common/Button";
import { Form } from "../../../components/common/Form";
import { FormField } from "../../../components/common/FormField";
import MessageModal from "../../../components/common/MessageModal";
import { TextArea } from "../../../components/common/TextArea";
import { NAMESPACES } from "../../../i18n";
import { categoryService } from "../../../services/category";
import { productService } from "../../../services/productService";
import { colors } from "../../../theme/colors";
import { fonts } from "../../../theme/fonts";
import { ICategory } from "../../../types/category";
import { MainTabNavigationProp } from "../../../types/navigation";
import * as Yup from "yup";
import { EDeliveryMethod, EProductCondition } from "../../../enums/product";

// Types
interface CreateProductFormValues {
  title: string;
  description: string;
  price: string;
  condition: EProductCondition;
  address: string;
  deliveryMethod: EDeliveryMethod;
  categoryId: number;
  primaryImage?: {
    uri: string;
    name: string;
    type: string;
  };
  additionalImages: Array<{
    uri: string;
    name: string;
    type: string;
  }>;
}

const CreateProductSchema = Yup.object().shape({
  title: Yup.string()
    .required("Tiêu đề sản phẩm là bắt buộc")
    .max(255, "Tiêu đề không được vượt quá 255 ký tự"),
  description: Yup.string()
    .max(2000, "Mô tả không được vượt quá 2000 ký tự")
    .required("Mô tả sản phẩm là bắt buộc"),
  price: Yup.string()
    .required("Giá sản phẩm là bắt buộc")
    .test("valid-price", "Giá phải từ 1,000 đến 50,000,000 VNĐ", (value) => {
      if (!value) return false;
      const numValue = parseInt(value.replace(/,/g, ""));
      return numValue >= 1000 && numValue <= 50000000;
    }),
  condition: Yup.string()
    .oneOf(Object.values(EProductCondition))
    .required("Tình trạng sản phẩm là bắt buộc"),
  categoryId: Yup.number().required("Danh mục sản phẩm là bắt buộc"),
  deliveryMethod: Yup.string()
    .oneOf(Object.values(EDeliveryMethod))
    .required("Phương thức giao hàng là bắt buộc"),
  address: Yup.string().required("Địa chỉ là bắt buộc"),
  primaryImage: Yup.object()
    .shape({
      uri: Yup.string().required(),
      name: Yup.string().required(),
      type: Yup.string().required(),
    })
    .required("Ảnh đại diện là bắt buộc"),
  additionalImages: Yup.array()
    .of(
      Yup.object().shape({
        uri: Yup.string().required(),
        name: Yup.string().required(),
        type: Yup.string().required(),
      })
    )
    .default([]),
});

type CreateProductScreenProps = {
  navigation: MainTabNavigationProp;
};

const conditionOptions = [
  { value: EProductCondition.NEW, label: "Mới", description: "Chưa sử dụng" },
  {
    value: EProductCondition.LIKE_NEW,
    label: "Như mới",
    description: "Sử dụng ít, không có dấu hiệu hư hỏng",
  },
  {
    value: EProductCondition.GOOD,
    label: "Tốt",
    description: "Có dấu hiệu sử dụng nhẹ",
  },
  {
    value: EProductCondition.FAIR,
    label: "Khá",
    description: "Có dấu hiệu sử dụng rõ ràng",
  },
  {
    value: EProductCondition.POOR,
    label: "Cũ",
    description: "Có nhiều dấu hiệu hư hỏng",
  },
];

const deliveryOptions = [
  {
    value: EDeliveryMethod.HAND_DELIVERY,
    label: "Giao tận tay",
    description: "Gặp mặt trực tiếp",
  },
  {
    value: EDeliveryMethod.SHIPPER,
    label: "Giao hàng",
    description: "Gửi qua đơn vị vận chuyển",
  },
  {
    value: EDeliveryMethod.BOTH,
    label: "Cả hai",
    description: "Linh hoạt theo yêu cầu",
  },
];

const SingleSelector = ({
  options,
  selectedValue,
  onSelect,
  error,
  label,
  required = false,
}: {
  options: Array<{ value: string; label: string; description?: string }>;
  selectedValue: string;
  onSelect: (value: string) => void;
  error?: string;
  label?: string;
  required?: boolean;
}) => {
  return (
    <View style={styles.selectorContainer}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        </View>
      )}

      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionCard,
                isSelected && styles.optionCardSelected,
              ]}
              onPress={() => onSelect(option.value)}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionHeader}>
                  <Text
                    style={[
                      styles.optionLabel,
                      isSelected && styles.optionLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </View>
                {option.description && (
                  <Text
                    style={[
                      styles.optionDescription,
                      isSelected && styles.optionDescriptionSelected,
                    ]}
                  >
                    {option.description}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const CategorySelector = ({
  categories,
  selectedId,
  onSelect,
  error,
  label,
  required = false,
}: {
  categories: ICategory[];
  selectedId: number | "";
  onSelect: (id: number) => void;
  error?: string;
  label?: string;
  required?: boolean;
}) => {
  return (
    <View style={styles.categoryContainer}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        </View>
      )}

      <View style={styles.categoriesGrid}>
        {categories.map((category) => {
          const isSelected = selectedId === category.id;
          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                isSelected && styles.categoryChipSelected,
              ]}
              onPress={() => onSelect(category.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  isSelected && styles.categoryChipTextSelected,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const PrimaryImageUpload = ({
  primaryImage,
  onPickPrimaryImage,
  onRemovePrimaryImage,
  disabled = false,
}: {
  primaryImage?: { uri: string; name: string; type: string };
  onPickPrimaryImage: () => void;
  onRemovePrimaryImage: () => void;
  disabled?: boolean;
}) => {
  return (
    <View style={styles.primaryImageContainer}>
      <Text style={styles.label}>
        Ảnh đại diện
        <Text style={styles.required}> *</Text>
      </Text>
      <Text style={styles.imageUploadDescription}>
        Ảnh chính sẽ hiển thị đầu tiên khi người mua xem sản phẩm
      </Text>

      <View style={styles.primaryImageWrapper}>
        {primaryImage ? (
          <View style={styles.primaryImageItem}>
            <Image
              source={{ uri: primaryImage.uri }}
              style={styles.primaryImage}
            />
            <TouchableOpacity
              style={styles.removePrimaryImageButton}
              onPress={onRemovePrimaryImage}
              disabled={disabled}
            >
              <Ionicons
                name="close-circle"
                size={28}
                color={colors.error.main}
              />
            </TouchableOpacity>
            <View style={styles.primaryBadge}>
              <Text style={styles.primaryBadgeText}>Ảnh chính</Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addPrimaryImageButton}
            onPress={onPickPrimaryImage}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <Ionicons name="camera" size={48} color={colors.text.secondary} />
            <Text style={styles.addPrimaryImageText}>Thêm ảnh đại diện</Text>
            <Text style={styles.addPrimaryImageSubtext}>Tối đa 10MB</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const AdditionalImagesUpload = ({
  images,
  onPickImages,
  onRemoveImage,
  disabled = false,
}: {
  images: Array<{ uri: string; name: string; type: string }>;
  onPickImages: () => void;
  onRemoveImage: (index: number) => void;
  disabled?: boolean;
}) => {
  return (
    <View style={styles.additionalImagesContainer}>
      <Text style={styles.label}>
        Ảnh chi tiết
        <Text style={styles.optional}> (Tùy chọn)</Text>
      </Text>
      <Text style={styles.imageUploadDescription}>
        Thêm tối đa 5 ảnh chi tiết để người mua hiểu rõ hơn về sản phẩm
      </Text>

      <View style={styles.imagesGrid}>
        {images.map((image, index) => (
          <View key={index} style={styles.imageItem}>
            <Image source={{ uri: image.uri }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => onRemoveImage(index)}
              disabled={disabled}
            >
              <Ionicons
                name="close-circle"
                size={24}
                color={colors.error.main}
              />
            </TouchableOpacity>
          </View>
        ))}

        {images.length < 5 && (
          <TouchableOpacity
            style={styles.addImageButton}
            onPress={onPickImages}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={32} color={colors.text.secondary} />
            <Text style={styles.addImageText}>Thêm ảnh</Text>
            <Text style={styles.addImageSubtext}>Tối đa 10MB</Text>
          </TouchableOpacity>
        )}
      </View>

      {images.length >= 5 && (
        <Text style={styles.maxImagesText}>Đã đạt giới hạn 5 ảnh chi tiết</Text>
      )}

      <View style={styles.imageUploadInfo}>
        <Text style={styles.imageUploadInfoText}>
          {images.length}/5 ảnh chi tiết • Mỗi ảnh tối đa 10MB
        </Text>
      </View>
    </View>
  );
};

const PriceInput = ({
  value,
  onChangeText,
  onBlur,
  error,
  editable = true,
}: {
  value: string;
  onChangeText: (text: string) => void;
  onBlur: (e: any) => void;
  error?: string;
  editable?: boolean;
}) => {
  const formatPrice = (text: string) => {
    const digits = text.replace(/\D/g, "");
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleChangeText = (text: string) => {
    const formatted = formatPrice(text);
    onChangeText(formatted);
  };

  return (
    <FormField
      placeholder="Nhập giá sản phẩm..."
      value={value}
      onChangeText={handleChangeText}
      onBlur={onBlur}
      editable={editable}
      error={error}
      leftIcon="cash"
      label="Giá bán"
      required
      keyboardType="numeric"
    />
  );
};

export default function CreateProductScreen({
  navigation,
}: CreateProductScreenProps) {
  const { t: commonT } = useTranslation(NAMESPACES.COMMON);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const getCategories = useCallback(async () => {
    const { ok, body } = await categoryService.getProductCategories();
    if (ok) {
      setCategories(body);
    }
  }, []);

  const handleCreateProduct = async (
    values: CreateProductFormValues,
    helpers: any
  ): Promise<void> => {
    setIsLoading(true);

    const formData = new FormData();

    formData.append("title", values.title.trim());
    formData.append("description", values.description.trim());
    const priceNumber = parseInt(values.price.replace(/,/g, ""));
    formData.append("price", priceNumber.toString());
    formData.append("condition", values.condition);
    formData.append("categoryId", values.categoryId.toString());
    formData.append("address", values.address.trim());
    formData.append("deliveryMethod", values.deliveryMethod as string);
    formData.append("images", {
      uri: values.primaryImage?.uri,
      type: values.primaryImage?.type,
      name: values.primaryImage?.name,
    } as any);

    if (values.additionalImages && values.additionalImages.length > 0) {
      values.additionalImages.forEach((image) => {
        formData.append("images", {
          uri: image.uri,
          type: image.type,
          name: image.name,
        } as any);
      });
    }

    const { ok, body, errors } = await productService.createProduct(formData);

    if (ok) {
      setSuccessModal(true);
      helpers.resetForm();
      navigation.navigate("Marketplace");
    } else {
      const errorMessage = errors?.message || "Có lỗi xảy ra khi tạo sản phẩm";
      Alert.alert("Lỗi", errorMessage);
    }

    setIsLoading(false);
    helpers.setSubmitting(false);
  };

  const handlePickPrimaryImage = async (setFieldValue: any) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsMultipleSelection: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];

        // Check file size (10MB = 10 * 1024 * 1024 bytes)
        if (asset.fileSize && asset.fileSize > 10 * 1024 * 1024) {
          Alert.alert("Lỗi", "Ảnh không được vượt quá 10MB");
          return;
        }

        const primaryImage = {
          uri: asset.uri,
          name: `primary_image_${Date.now()}.jpg`,
          type: "image/jpeg",
        };

        setFieldValue("primaryImage", primaryImage);
      }
    } catch (error) {
      console.error("Error picking primary image:", error);
      Alert.alert("Lỗi", "Không thể chọn ảnh đại diện");
    }
  };

  const handlePickAdditionalImages = async (
    setFieldValue: any,
    currentImages: any[]
  ) => {
    try {
      const remainingSlots = 5 - currentImages.length;
      if (remainingSlots <= 0) {
        Alert.alert("Thông báo", "Bạn đã đạt giới hạn 5 ảnh chi tiết");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: remainingSlots,
      });

      if (!result.canceled && result.assets) {
        // Check file sizes
        const oversizedFiles = result.assets.filter(
          (asset) => asset.fileSize && asset.fileSize > 10 * 1024 * 1024
        );

        if (oversizedFiles.length > 0) {
          Alert.alert(
            "Lỗi",
            "Một hoặc nhiều ảnh vượt quá 10MB. Vui lòng chọn ảnh nhỏ hơn."
          );
          return;
        }

        const newImages = result.assets.map((asset, index) => ({
          uri: asset.uri,
          name: `additional_image_${Date.now()}_${index}.jpg`,
          type: "image/jpeg",
        }));

        setFieldValue("additionalImages", [...currentImages, ...newImages]);
      }
    } catch (error) {
      console.error("Error picking additional images:", error);
      Alert.alert("Lỗi", "Không thể chọn ảnh chi tiết");
    }
  };

  const handleRemovePrimaryImage = (setFieldValue: any) => {
    setFieldValue("primaryImage", undefined);
  };

  const handleRemoveAdditionalImage = (
    setFieldValue: any,
    images: any[],
    index: number
  ) => {
    const newImages = images.filter((_, i) => i !== index);
    setFieldValue("additionalImages", newImages);
  };

  useFocusEffect(
    useCallback(() => {
      getCategories();
    }, [getCategories])
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Đăng bán sản phẩm</Text>

          <View style={styles.headerRight}></View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Form<CreateProductFormValues>
            initialValues={{
              title: "",
              description: "",
              price: "",
              condition: EProductCondition.NEW,
              address: "",
              deliveryMethod: EDeliveryMethod.HAND_DELIVERY,
              categoryId: 0,
              primaryImage: undefined,
              additionalImages: [],
            }}
            validationSchema={CreateProductSchema}
            onSubmit={handleCreateProduct}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              setFieldValue,
            }) => (
              <View style={styles.formContainer}>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>

                  <FormField
                    placeholder="VD: Sách Toán Cao Cấp A1"
                    value={values.title}
                    onChangeText={handleChange("title")}
                    onBlur={handleBlur("title")}
                    editable={!isLoading}
                    error={touched.title && errors.title ? errors.title : ""}
                    leftIcon="document-text"
                    label="Tên sản phẩm"
                    required
                    multiline={false}
                  />

                  <TextArea
                    placeholder="Mô tả chi tiết về tình trạng, độ mới, lý do bán..."
                    value={values.description}
                    onChangeText={handleChange("description")}
                    onBlur={handleBlur("description")}
                    editable={!isLoading}
                    error={
                      touched.description && errors.description
                        ? errors.description
                        : ""
                    }
                    leftIcon="chatbubbles"
                    label="Mô tả sản phẩm"
                    minHeight={100}
                    maxHeight={150}
                    showCharacterCount={true}
                    maxLength={2000}
                    required
                  />

                  <PriceInput
                    value={values.price}
                    onChangeText={handleChange("price")}
                    onBlur={handleBlur("price")}
                    error={touched.price && errors.price ? errors.price : ""}
                    editable={!isLoading}
                  />
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Tình trạng sản phẩm</Text>

                  <SingleSelector
                    options={conditionOptions}
                    selectedValue={values.condition}
                    onSelect={(condition) =>
                      setFieldValue("condition", condition)
                    }
                    error={
                      touched.condition && errors.condition
                        ? errors.condition
                        : ""
                    }
                    label="Chọn tình trạng"
                    required
                  />
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Phân loại</Text>

                  <CategorySelector
                    categories={categories}
                    selectedId={values.categoryId}
                    onSelect={(categoryId) =>
                      setFieldValue("categoryId", categoryId)
                    }
                    error={
                      touched.categoryId && errors.categoryId
                        ? errors.categoryId
                        : ""
                    }
                    label="Danh mục sản phẩm"
                    required
                  />
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Thông tin giao hàng</Text>

                  <FormField
                    placeholder="VD: Quận 1, TP.HCM"
                    value={values.address}
                    onChangeText={handleChange("address")}
                    onBlur={handleBlur("address")}
                    editable={!isLoading}
                    error={
                      touched.address && errors.address ? errors.address : ""
                    }
                    leftIcon="location"
                    label="Địa chỉ"
                    multiline={false}
                  />

                  <SingleSelector
                    options={deliveryOptions}
                    selectedValue={values.deliveryMethod}
                    onSelect={(method) =>
                      setFieldValue("deliveryMethod", method)
                    }
                    error={
                      touched.deliveryMethod && errors.deliveryMethod
                        ? errors.deliveryMethod
                        : ""
                    }
                    label="Phương thức giao hàng"
                  />
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Hình ảnh sản phẩm</Text>

                  <PrimaryImageUpload
                    primaryImage={values.primaryImage}
                    onPickPrimaryImage={() =>
                      handlePickPrimaryImage(setFieldValue)
                    }
                    onRemovePrimaryImage={() =>
                      handleRemovePrimaryImage(setFieldValue)
                    }
                    disabled={isLoading}
                  />

                  {touched.primaryImage && errors.primaryImage && (
                    <Text style={styles.errorText}>
                      {typeof errors.primaryImage === "string"
                        ? errors.primaryImage
                        : "Ảnh đại diện là bắt buộc"}
                    </Text>
                  )}
                </View>

                <View style={styles.section}>
                  <AdditionalImagesUpload
                    images={values.additionalImages}
                    onPickImages={() =>
                      handlePickAdditionalImages(
                        setFieldValue,
                        values.additionalImages
                      )
                    }
                    onRemoveImage={(index) =>
                      handleRemoveAdditionalImage(
                        setFieldValue,
                        values.additionalImages,
                        index
                      )
                    }
                    disabled={isLoading}
                  />
                </View>

                <View style={styles.buttonContainer}>
                  <Button
                    onPress={() => handleSubmit()}
                    disabled={isLoading}
                    style={styles.submitButton}
                  >
                    <View style={styles.buttonContent}>
                      {isLoading && <View style={styles.loadingIndicator} />}
                      <Text style={styles.buttonText}>
                        {isLoading ? "Đang đăng sản phẩm..." : "Đăng bán"}
                      </Text>
                    </View>
                  </Button>
                </View>
              </View>
            )}
          </Form>
        </ScrollView>

        {/* Success Modal */}
        <MessageModal
          visible={successModal}
          onClose={() => {
            setSuccessModal(false);
            navigation.goBack();
          }}
          type="success"
          title="Thành công!"
          message="Sản phẩm của bạn đã được đăng thành công và sẵn sàng để bán."
          okText="Tuyệt vời"
          backdropDismissible={false}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.gradient,
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
  },
  headerRight: {
    width: 40,
    alignItems: "flex-end",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  formContainer: {
    gap: 24,
  },
  section: {
    backgroundColor: colors.common.white,
    borderRadius: 16,
    padding: 20,
    gap: 16,
    shadowColor: colors.common.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.openSans.semiBold,
    color: colors.text.primary,
    marginBottom: 4,
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
  submitButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary.main,
    shadowColor: colors.primary.main,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.common.white,
    borderTopColor: "transparent",
    marginRight: 12,
  },
  buttonText: {
    color: colors.common.white,
    fontSize: 16,
    fontFamily: fonts.openSans.semiBold,
    letterSpacing: 0.5,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.openSans.medium,
    color: colors.text.primary,
  },
  required: {
    color: colors.error.main,
  },
  optional: {
    color: colors.text.secondary,
    fontFamily: fonts.openSans.regular,
  },
  errorText: {
    fontSize: 12,
    fontFamily: fonts.openSans.regular,
    color: colors.error.main,
    marginTop: 4,
  },

  // Selector styles
  selectorContainer: {
    gap: 12,
  },
  optionsContainer: {
    gap: 8,
  },
  optionCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  optionCardSelected: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  optionContent: {
    gap: 4,
  },
  optionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionLabel: {
    fontSize: 14,
    fontFamily: fonts.openSans.semiBold,
    color: colors.text.primary,
  },
  optionLabelSelected: {
    color: colors.common.white,
  },
  optionDescription: {
    fontSize: 12,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
  },
  optionDescriptionSelected: {
    color: colors.common.white,
    opacity: 0.9,
  },

  // Category styles
  categoryContainer: {
    gap: 12,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background.light,
    borderWidth: 1,
    borderColor: colors.border.light,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  categoryChipSelected: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  categoryChipText: {
    fontSize: 14,
    fontFamily: fonts.openSans.medium,
    color: colors.text.secondary,
  },
  categoryChipTextSelected: {
    color: colors.common.white,
  },

  // Primary Image styles
  primaryImageContainer: {
    gap: 12,
  },
  primaryImageWrapper: {
    alignItems: "center",
  },
  primaryImageItem: {
    position: "relative",
    width: 160,
    height: 160,
  },
  primaryImage: {
    width: 160,
    height: 160,
    borderRadius: 12,
    backgroundColor: colors.background.surface,
  },
  removePrimaryImageButton: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: colors.common.white,
    borderRadius: 14,
  },
  primaryBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: colors.primary.main,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  primaryBadgeText: {
    fontSize: 10,
    fontFamily: fonts.openSans.semiBold,
    color: colors.common.white,
  },
  addPrimaryImageButton: {
    width: 160,
    height: 160,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border.light,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.surface,
    gap: 8,
  },
  addPrimaryImageText: {
    fontSize: 14,
    fontFamily: fonts.openSans.semiBold,
    color: colors.text.secondary,
  },
  addPrimaryImageSubtext: {
    fontSize: 12,
    fontFamily: fonts.openSans.regular,
    color: colors.text.hint,
  },

  // Additional Images styles
  additionalImagesContainer: {
    gap: 12,
  },
  imageUploadContainer: {
    gap: 12,
  },
  imageUploadDescription: {
    fontSize: 14,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
    marginTop: -8,
  },
  imagesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  imageItem: {
    position: "relative",
    width: 100,
    height: 100,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: colors.background.surface,
  },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: colors.common.white,
    borderRadius: 12,
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border.light,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.surface,
    gap: 4,
  },
  addImageText: {
    fontSize: 12,
    fontFamily: fonts.openSans.medium,
    color: colors.text.secondary,
  },
  addImageSubtext: {
    fontSize: 10,
    fontFamily: fonts.openSans.regular,
    color: colors.text.hint,
  },
  maxImagesText: {
    fontSize: 12,
    fontFamily: fonts.openSans.regular,
    color: colors.text.hint,
    textAlign: "center",
    marginTop: 8,
  },
  imageUploadInfo: {
    backgroundColor: colors.background.light,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  imageUploadInfoText: {
    fontSize: 12,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
    textAlign: "center",
  },

  // Price input styles
  currencyText: {
    fontSize: 14,
    fontFamily: fonts.openSans.medium,
    color: colors.text.secondary,
    marginRight: 8,
  },
});
