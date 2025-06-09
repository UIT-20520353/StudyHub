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
import { MainTabNavigationProp } from "../../../types/navigation";
import { CreateTopicFormValues, CreateTopicSchema } from "./utils";
import { useQuickToast } from "../../../hooks";
import { useAuth } from "../../../contexts/AuthContext";

type CreateTopicScreenProps = {
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

export default function CreateTopicScreen({
  navigation,
}: CreateTopicScreenProps) {
  const { t: commonT } = useTranslation(NAMESPACES.COMMON);
  const { t: apiT } = useTranslation(NAMESPACES.API);
  const { user } = useAuth();
  const toast = useQuickToast();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const getCategories = useCallback(async () => {
    const { ok, body } = await categoryService.getTopicCategories();
    if (ok) {
      setCategories(body);
    }
  }, []);

  const handleCreateTopic = async (
    values: CreateTopicFormValues,
    helpers: any
  ): Promise<void> => {
    setIsLoading(true);

    const formData = new FormData();

    formData.append("title", values.title.trim());
    formData.append("content", values.content.trim());
    formData.append("visibility", values.visibility);

    if (values.visibility === ETopicVisibility.UNIVERSITY_ONLY) {
      formData.append(
        "universityId",
        user ? user.university.id.toString() : ""
      );
    }

    values.categoryIds.forEach((id) => {
      formData.append("categoryIds", id.toString());
    });

    if (values.attachments && values.attachments.length > 0) {
      values.attachments.forEach((attachment) => {
        formData.append("attachments", {
          uri: attachment.uri,
          type: attachment.type,
          name: attachment.name,
        } as any);
      });
    }

    const { ok, body, errors } = await topicService.createTopic(formData);

    if (ok) {
      setSuccessModal(true);
      helpers.resetForm();
      toast.success(commonT("success"));
    } else {
      toast.error(apiT(errors.message));
    }

    setIsLoading(false);
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

          <Text style={styles.headerTitle}>Tạo bài viết mới</Text>

          <View style={styles.headerRight}></View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Form<CreateTopicFormValues>
            initialValues={{
              title: "",
              content: "",
              categoryIds: [], // Changed from categoryId to empty array
              visibility: ETopicVisibility.PUBLIC,
              attachments: [],
            }}
            validationSchema={CreateTopicSchema}
            onSubmit={handleCreateTopic}
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
                    editable={!isLoading}
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
                    editable={!isLoading}
                    error={
                      touched.content && errors.content ? errors.content : ""
                    }
                    leftIcon="chatbubbles"
                    label="Nội dung"
                    required
                    minHeight={120}
                    maxHeight={400}
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
                        {isLoading ? "Đang tạo bài viết..." : "Đăng bài viết"}
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
          message="Bài viết của bạn đã được tạo thành công và đang chờ duyệt."
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
  sectionDescription: {
    fontSize: 14,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  contentInput: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  universityContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
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
  checkIcon: {
    marginLeft: 2,
  },
  errorText: {
    fontSize: 12,
    fontFamily: fonts.openSans.regular,
    color: colors.error.main,
    marginTop: 4,
  },
});
