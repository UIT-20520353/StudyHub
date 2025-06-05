import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../../components/common/Button";
import { Form } from "../../../components/common/Form";
import { FormField } from "../../../components/common/FormField";
import { Loading } from "../../../components/common/Loading";
import MessageModal from "../../../components/common/MessageModal";
import { TextArea } from "../../../components/common/TextArea";
import { AttachmentUpload } from "../../../components/community/AttachmentUpload";
import { VisibilitySelector } from "../../../components/community/VisibilitySelector";
import { ETopicVisibility } from "../../../enums/topic";
import { NAMESPACES } from "../../../i18n";
import { categoryService } from "../../../services/category";
import { topicService } from "../../../services/topicService";
import { colors } from "../../../theme/colors";
import { fonts } from "../../../theme/fonts";
import { ICategory } from "../../../types/category";
import { ITopic } from "../../../types/topic";
import { MainTabNavigationProp } from "../../../types/navigation";
import { CreateTopicFormValues, CreateTopicSchema } from "./utils";

type EditTopicScreenProps = {
  route: {
    params: {
      topicId: number;
    };
  };
  navigation: MainTabNavigationProp;
};

// Multi-Category Selector Component
const CategoryMultiSelector = ({
  categories,
  selectedIds,
  onSelect,
  error,
  label,
  required = false,
}: {
  categories: ICategory[];
  selectedIds: number[];
  onSelect: (ids: number[]) => void;
  error?: string;
  label?: string;
  required?: boolean;
}) => {
  const toggleCategory = (categoryId: number) => {
    const newSelectedIds = selectedIds.includes(categoryId)
      ? selectedIds.filter((id) => id !== categoryId)
      : [...selectedIds, categoryId];
    onSelect(newSelectedIds);
  };

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
          const isSelected = selectedIds.includes(category.id);
          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                isSelected && styles.categoryChipSelected,
              ]}
              onPress={() => toggleCategory(category.id)}
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

export default function EditTopicScreen({
  route,
  navigation,
}: EditTopicScreenProps) {
  const { topicId } = route.params;
  const { t: commonT } = useTranslation(NAMESPACES.COMMON);

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [topic, setTopic] = useState<ITopic | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [successModal, setSuccessModal] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);

  // Convert topic attachments to form format
  const convertAttachmentsToFormFormat = (attachments: any[]) => {
    return attachments.map((attachment) => ({
      id: attachment.id,
      uri: attachment.fileUrl,
      name: attachment.fileName,
      type: attachment.fileType,
      size: attachment.fileSize,
      isExisting: true, // Flag to identify existing attachments
    }));
  };

  const loadTopicDetail = async () => {
    setInitialLoading(true);
    const { ok, body } = await topicService.getTopicDetail(topicId);
    if (ok) {
      setTopic(body);
    } else {
      Alert.alert("Lỗi", "Không thể tải thông tin bài viết");
      navigation.goBack();
    }
    setInitialLoading(false);
  };

  const getCategories = useCallback(async () => {
    const { ok, body } = await categoryService.getTopicCategories();
    if (ok) {
      setCategories(body);
    }
  }, []);

  const handleUpdateTopic = async (
    values: CreateTopicFormValues,
    helpers: any
  ): Promise<void> => {
    setIsUpdating(true);

    const formData = new FormData();

    formData.append("title", values.title.trim());
    formData.append("content", values.content.trim());
    formData.append("visibility", values.visibility);

    values.categoryIds.forEach((id) => {
      formData.append("categoryIds", id.toString());
    });

    // Handle attachments
    // if (values.attachments && values.attachments.length > 0) {
    //   // Separate existing and new attachments
    //   const existingAttachments = values.attachments.filter(
    //     (attachment) => attachment.isExisting
    //   );
    //   const newAttachments = values.attachments.filter(
    //     (attachment) => !attachment.isExisting
    //   );

    //   // Add existing attachment IDs to keep
    //   existingAttachments.forEach((attachment) => {
    //     formData.append("keepAttachmentIds", attachment.id.toString());
    //   });

    //   // Add new attachments
    //   newAttachments.forEach((attachment) => {
    //     formData.append("attachments", {
    //       uri: attachment.uri,
    //       type: attachment.type,
    //       name: attachment.name,
    //     } as any);
    //   });
    // }

    // const { ok, body, errors } = await topicService.updateTopic(topicId, formData);

    // if (ok) {
    //   setSuccessModal(true);
    // } else {
    //   const errorMessage = errors?.message || "Có lỗi xảy ra khi cập nhật bài viết";
    //   Alert.alert("Lỗi", errorMessage);
    // }

    setIsUpdating(false);
    helpers.setSubmitting(false);
  };

  const handlePickAttachment = async (
    setFieldValue: any,
    currentAttachments: any[]
  ) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets) {
        const newAttachments = result.assets.map((asset) => ({
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType || "application/octet-stream",
          size: asset.size,
          isExisting: false, // New attachment
        }));

        setFieldValue("attachments", [
          ...currentAttachments,
          ...newAttachments,
        ]);
      }
    } catch (error) {
      console.error("Error picking attachment:", error);
      Alert.alert("Lỗi", "Không thể chọn tệp đính kèm");
    }
  };

  const handleRemoveAttachment = (
    setFieldValue: any,
    attachments: any[],
    index: number
  ) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    setFieldValue("attachments", newAttachments);
  };

  const handleDeletePress = () => {
    setDeleteConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteConfirmModal(false);
    const { ok, errors } = await topicService.deleteTopic(topicId);
    if (ok) {
      navigation.goBack();
    } else {
      Alert.alert("Lỗi", errors?.message || "Có lỗi xảy ra khi xóa bài viết");
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmModal(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadTopicDetail();
      getCategories();
    }, [getCategories])
  );

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Loading />
          <Text style={styles.loadingText}>Đang tải thông tin bài viết...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!topic) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Không tìm thấy bài viết</Text>
      </SafeAreaView>
    );
  }

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

          <Text style={styles.headerTitle}>Chỉnh sửa bài viết</Text>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeletePress}
              activeOpacity={0.7}
            >
              <Ionicons
                name="trash-outline"
                size={22}
                color={colors.error.main}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Form<CreateTopicFormValues>
            initialValues={{
              title: topic.title,
              content: topic.content,
              categoryIds: topic.categories.map((cat) => cat.id),
              visibility: topic.visibility,
              attachments: convertAttachmentsToFormFormat(topic.attachments),
            }}
            validationSchema={CreateTopicSchema}
            onSubmit={handleUpdateTopic}
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
                    placeholder="Nhập tiêu đề bài viết..."
                    value={values.title}
                    onChangeText={handleChange("title")}
                    onBlur={handleBlur("title")}
                    editable={!isUpdating}
                    error={touched.title && errors.title ? errors.title : ""}
                    leftIcon="document-text"
                    label="Tiêu đề"
                    required
                    multiline={false}
                  />

                  <TextArea
                    placeholder="Chia sẻ kiến thức, kinh nghiệm hoặc đặt câu hỏi của bạn..."
                    value={values.content}
                    onChangeText={handleChange("content")}
                    onBlur={handleBlur("content")}
                    editable={!isUpdating}
                    error={
                      touched.content && errors.content ? errors.content : ""
                    }
                    leftIcon="chatbubbles"
                    label="Nội dung"
                    required
                    minHeight={120}
                    maxHeight={200}
                    showCharacterCount={true}
                    maxLength={5000}
                  />
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Phân loại</Text>

                  <CategoryMultiSelector
                    categories={categories}
                    selectedIds={values.categoryIds}
                    onSelect={(categoryIds) =>
                      setFieldValue("categoryIds", categoryIds)
                    }
                    error={
                      touched.categoryIds && errors.categoryIds
                        ? Array.isArray(errors.categoryIds)
                          ? errors.categoryIds[0]
                          : errors.categoryIds
                        : ""
                    }
                    label="Danh mục"
                    required
                  />
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Chế độ hiển thị</Text>

                  <VisibilitySelector
                    value={values.visibility}
                    onSelect={(visibility) => {
                      setFieldValue("visibility", visibility);
                      if (visibility === ETopicVisibility.PUBLIC) {
                        setFieldValue("universityId", undefined);
                      }
                    }}
                    error={
                      touched.visibility && errors.visibility
                        ? errors.visibility
                        : ""
                    }
                    label="Ai có thể xem bài viết này?"
                    required
                  />
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Tệp đính kèm</Text>
                  <Text style={styles.sectionDescription}>
                    Đính kèm tài liệu, hình ảnh hoặc file hỗ trợ (tùy chọn)
                  </Text>

                  <AttachmentUpload
                    attachments={values.attachments}
                    onPickAttachment={() =>
                      handlePickAttachment(setFieldValue, values.attachments)
                    }
                    onRemoveAttachment={(index) =>
                      handleRemoveAttachment(
                        setFieldValue,
                        values.attachments,
                        index
                      )
                    }
                    disabled={isUpdating}
                    showExistingLabel={true}
                  />
                </View>

                <View style={styles.buttonContainer}>
                  <Button
                    onPress={() => handleSubmit()}
                    disabled={isUpdating}
                    style={styles.submitButton}
                  >
                    <View style={styles.buttonContent}>
                      {isUpdating && <View style={styles.loadingIndicator} />}
                      <Text style={styles.buttonText}>
                        {isUpdating ? "Đang cập nhật..." : "Cập nhật bài viết"}
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
          message="Bài viết của bạn đã được cập nhật thành công."
          okText="Tuyệt vời"
          backdropDismissible={false}
        />

        {/* Delete Confirmation Modal */}
        <MessageModal
          visible={deleteConfirmModal}
          onClose={handleCancelDelete}
          type="warning"
          title="Xác nhận xóa"
          message="Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác."
          showOkButton={false}
          showConfirmButton={true}
          showCancelButton={true}
          confirmText="Xóa"
          cancelText="Hủy"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          backdropDismissible={true}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: fonts.openSans.medium,
    color: colors.text.secondary,
  },
  errorText: {
    fontSize: 16,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
    textAlign: "center",
    marginTop: 50,
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
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.background.light,
    alignItems: "center",
    justifyContent: "center",
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
  sectionDescription: {
    fontSize: 14,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
    marginBottom: 8,
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
  categoryContainer: {
    gap: 12,
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
});
