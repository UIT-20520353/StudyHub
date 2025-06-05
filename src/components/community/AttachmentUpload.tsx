import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
} from "react-native";
import {
  DocumentIcon,
  ImageIcon,
  VideoIcon,
  PlusIcon,
  TrashIcon,
} from "../icons";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { MAX_FILE_SIZE } from "../../screens/main/community/utils";

interface AttachmentFile {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

interface AttachmentUploadProps {
  attachments: AttachmentFile[];
  onPickAttachment: () => void;
  onRemoveAttachment: (index: number) => void;
  disabled?: boolean;
  maxFiles?: number;
}

export const AttachmentUpload: React.FC<AttachmentUploadProps> = ({
  attachments,
  onPickAttachment,
  onRemoveAttachment,
  disabled = false,
  maxFiles = 5,
}) => {
  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return <ImageIcon size={24} color={colors.file.image} />;
    } else if (type.startsWith("video/")) {
      return <VideoIcon size={24} color={colors.file.video} />;
    } else {
      return <DocumentIcon size={24} color={colors.file.document} />;
    }
  };

  const formatFileSize = (size?: number): string => {
    if (!size) return "";

    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  const handlePickAttachment = () => {
    if (attachments.length >= maxFiles) {
      Alert.alert(
        "Giới hạn tệp",
        `Bạn chỉ có thể đính kèm tối đa ${maxFiles} tệp.`
      );
      return;
    }
    onPickAttachment();
  };

  const handleRemoveAttachment = (index: number) => {
    Alert.alert(
      "Xóa tệp đính kèm",
      "Bạn có chắc chắn muốn xóa tệp này không?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => onRemoveAttachment(index),
        },
      ]
    );
  };

  const renderAttachmentItem = ({
    item,
    index,
  }: {
    item: AttachmentFile;
    index: number;
  }) => (
    <View style={styles.attachmentItem}>
      <View style={styles.attachmentContent}>
        <View style={styles.fileIconContainer}>{getFileIcon(item.type)}</View>

        <View style={styles.fileInfo}>
          <Text style={styles.fileName} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.fileMetaContainer}>
            <Text style={styles.fileType}>
              {item.type.split("/")[1]?.toUpperCase() || "FILE"}
            </Text>
            {item.size && (
              <>
                <View style={styles.dot} />
                <Text style={styles.fileSize}>{formatFileSize(item.size)}</Text>
              </>
            )}
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveAttachment(index)}
        disabled={disabled}
      >
        <TrashIcon size={20} color={colors.error.main} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Upload Button */}
      <TouchableOpacity
        style={[
          styles.uploadButton,
          disabled && styles.uploadButtonDisabled,
          attachments.length >= maxFiles && styles.uploadButtonMaxed,
        ]}
        onPress={handlePickAttachment}
        disabled={disabled || attachments.length >= maxFiles}
        activeOpacity={0.7}
      >
        <View style={styles.uploadContent}>
          <View
            style={[
              styles.uploadIcon,
              disabled && styles.uploadIconDisabled,
              attachments.length >= maxFiles && styles.uploadIconMaxed,
            ]}
          >
            <PlusIcon
              size={24}
              color={
                disabled || attachments.length >= maxFiles
                  ? colors.text.disabled
                  : colors.text.primary
              }
            />
          </View>

          <View style={styles.uploadTextContainer}>
            <Text
              style={[
                styles.uploadTitle,
                disabled && styles.uploadTitleDisabled,
                attachments.length >= maxFiles && styles.uploadTitleMaxed,
              ]}
            >
              {attachments.length >= maxFiles
                ? "Đã đạt giới hạn"
                : "Thêm tệp đính kèm"}
            </Text>
            <Text
              style={[
                styles.uploadDescription,
                disabled && styles.uploadDescriptionDisabled,
              ]}
            >
              {attachments.length >= maxFiles
                ? `Tối đa ${maxFiles} tệp`
                : `Chọn hình ảnh, tài liệu hoặc video (${attachments.length}/${maxFiles})`}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Attachments List */}
      {attachments.length > 0 && (
        <View style={styles.attachmentsList}>
          <FlatList
            data={attachments}
            renderItem={renderAttachmentItem}
            keyExtractor={(item, index) => `${item.name}-${index}`}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      )}

      {/* File Guidelines */}
      <View style={styles.guidelines}>
        <Text style={styles.guidelinesText}>
          • Hỗ trợ: PDF, DOC, DOCX, JPG, PNG, MP4
        </Text>
        <Text style={styles.guidelinesText}>
          • Kích thước tối đa: {MAX_FILE_SIZE / 1024 / 1024}MB mỗi tệp
        </Text>
        <Text style={styles.guidelinesText}>
          • Tối đa {maxFiles} tệp đính kèm
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  uploadButton: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary.main,
    borderStyle: "dashed",
    backgroundColor: colors.background.surface,
  },
  uploadButtonDisabled: {
    borderColor: colors.border.light,
    backgroundColor: colors.background.paper,
  },
  uploadButtonMaxed: {
    borderColor: colors.warning.main,
    backgroundColor: colors.warning.background,
  },
  uploadContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  uploadIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary.main,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadIconDisabled: {
    backgroundColor: colors.background.disabled,
  },
  uploadIconMaxed: {
    backgroundColor: colors.warning.main,
  },
  uploadTextContainer: {
    flex: 1,
  },
  uploadTitle: {
    fontSize: 16,
    fontFamily: fonts.openSans.semiBold,
    color: colors.text.primary,
    marginBottom: 4,
  },
  uploadTitleDisabled: {
    color: colors.text.disabled,
  },
  uploadTitleMaxed: {
    color: colors.warning.dark,
  },
  uploadDescription: {
    fontSize: 13,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  uploadDescriptionDisabled: {
    color: colors.text.disabled,
  },
  attachmentsList: {
    backgroundColor: colors.background.paper,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  attachmentItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  attachmentContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  fileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.background.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontFamily: fonts.openSans.semiBold,
    color: colors.text.primary,
    marginBottom: 2,
  },
  fileMetaContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  fileType: {
    fontSize: 12,
    fontFamily: fonts.openSans.medium,
    color: colors.text.hint,
    textTransform: "uppercase",
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.text.disabled,
  },
  fileSize: {
    fontSize: 12,
    fontFamily: fonts.openSans.regular,
    color: colors.text.hint,
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.error.background,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: 8,
  },
  guidelines: {
    padding: 12,
    backgroundColor: colors.background.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  guidelinesText: {
    fontSize: 12,
    fontFamily: fonts.openSans.regular,
    color: colors.text.hint,
    lineHeight: 16,
    marginBottom: 2,
  },
});
