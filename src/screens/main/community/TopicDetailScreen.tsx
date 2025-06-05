import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Loading } from "../../../components/common/Loading";
import MessageModal from "../../../components/common/MessageModal";
import { DislikeIcon, LikeIcon } from "../../../components/icons";
import { useAuth } from "../../../contexts/AuthContext";
import { ETopicReaction } from "../../../enums/topic";
import { topicService } from "../../../services/topicService";
import { colors } from "../../../theme/colors";
import { fonts } from "../../../theme/fonts";
import { ITopic } from "../../../types/topic";

interface TopicDetailScreenProps {
  route: {
    params: {
      topicId: number;
    };
  };
  navigation: any;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Image Viewer Modal Component
interface ImageViewerModalProps {
  visible: boolean;
  imageUrl: string;
  onClose: () => void;
}

const ImageViewerModal = ({
  visible,
  imageUrl,
  onClose,
}: ImageViewerModalProps) => {
  return (
    <Modal visible={visible} transparent onRequestClose={onClose}>
      <View style={styles.imageModalBackdrop}>
        <SafeAreaView style={styles.imageModalContainer}>
          {/* Header */}
          <View style={styles.imageModalHeader}>
            <TouchableOpacity
              style={styles.imageModalCloseButton}
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color={colors.common.white} />
            </TouchableOpacity>
          </View>

          {/* Image */}
          <View style={styles.imageModalContent}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default function TopicDetailScreen({
  route,
  navigation,
}: TopicDetailScreenProps) {
  const { topicId } = route.params;
  const { user } = useAuth();
  const [topic, setTopic] = useState<ITopic | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isReacting, setIsReacting] = useState<boolean>(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<boolean>(false);
  const [imageViewerModal, setImageViewerModal] = useState<boolean>(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");

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

  const handleImagePress = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    setImageViewerModal(true);
  };

  const handleCloseImageViewer = () => {
    setImageViewerModal(false);
    setSelectedImageUrl("");
  };

  const loadTopicDetail = async () => {
    setLoading(true);

    const { ok, body } = await topicService.getTopicDetail(topicId);

    if (ok) {
      setTopic(body);
      console.log(body);
    }

    setLoading(false);
  };

  const handleReaction = async (type: ETopicReaction) => {
    if (isReacting) return;
    setIsReacting(true);
    const { ok, body } = await topicService.reactToTopic(topicId, type);
    if (ok) {
      setTopic(body);
    }
    setIsReacting(false);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes}p`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w`;

    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}m`;
  };

  const isImageFile = (fileType: string, fileName: string): boolean => {
    const imageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

    // Check by MIME type
    if (imageTypes.includes(fileType.toLowerCase())) {
      return true;
    }

    // Check by file extension
    const extension = fileName
      .toLowerCase()
      .substring(fileName.lastIndexOf("."));
    return imageExtensions.includes(extension);
  };

  const getFileIcon = (fileType: string): keyof typeof Ionicons.glyphMap => {
    if (fileType.includes("pdf")) return "document-text-outline";
    if (fileType.includes("word")) return "document-outline";
    if (fileType.includes("excel") || fileType.includes("spreadsheet"))
      return "grid-outline";
    if (fileType.includes("powerpoint") || fileType.includes("presentation"))
      return "easel-outline";
    if (fileType.includes("video")) return "videocam-outline";
    if (fileType.includes("audio")) return "musical-notes-outline";
    return "document-outline";
  };

  useFocusEffect(
    useCallback(() => {
      loadTopicDetail();
    }, [])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Loading />
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
      <MessageModal
        visible={deleteConfirmModal}
        onClose={handleCancelDelete}
        type="warning"
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa bài viết này?"
        showOkButton={false}
        showConfirmButton={true}
        showCancelButton={true}
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        backdropDismissible={true}
      />

      <ImageViewerModal
        visible={imageViewerModal}
        imageUrl={selectedImageUrl}
        onClose={handleCloseImageViewer}
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Chi tiết bài viết</Text>

        <View style={styles.headerActions}>
          {user?.id !== topic.author.id && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleFollow}
            >
              <Ionicons
                name={isFollowing ? "notifications" : "notifications-outline"}
                size={22}
                color={
                  isFollowing ? colors.primary.main : colors.text.secondary
                }
              />
            </TouchableOpacity>
          )}

          {user && user.id === topic.author.id && (
            <>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleFollow}
              >
                <Ionicons name="pencil" size={22} color={colors.text.primary} />
              </TouchableOpacity>
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
            </>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Topic Title */}
        <View style={styles.titleSection}>
          <Text style={styles.topicTitle}>{topic.title}</Text>

          {/* Categories */}
          <View style={styles.categoriesContainer}>
            {topic.categories.map((category) => (
              <View key={category.id} style={styles.categoryTag}>
                <Text style={styles.categoryText}>{category.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.authorSection}>
          <Image
            source={{ uri: topic.author.avatarUrl }}
            style={styles.authorAvatar}
          />
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{topic.author.fullName}</Text>
            <Text style={styles.authorDetails}>
              {topic.author.major && `${topic.author.major} • `}
              {topic.author.year && `Năm ${topic.author.year} • `}
              {topic.author.university.shortName}
            </Text>
            <Text style={styles.postTime}>
              {formatTimeAgo(topic.createdAt)}
            </Text>
          </View>
        </View>

        {/* Topic Content */}
        <View style={styles.contentSection}>
          <Text style={styles.topicContent}>{topic.content}</Text>
        </View>

        {/* Attachments */}
        {topic.attachments.length > 0 && (
          <View style={styles.attachmentsSection}>
            <Text style={styles.sectionTitle}>File đính kèm</Text>

            {/* Separate images and other files */}
            {topic.attachments.map((attachment) => {
              const isImage = isImageFile(
                attachment.fileType,
                attachment.fileName
              );

              if (isImage) {
                return (
                  <TouchableOpacity
                    key={attachment.id}
                    style={styles.imageAttachmentContainer}
                    onPress={() => handleImagePress(attachment.fileUrl)}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: attachment.fileUrl }}
                      style={styles.attachmentImage}
                      resizeMode="cover"
                    />
                    <View style={styles.imageOverlay}>
                      <View style={styles.imageInfo}>
                        <Text style={styles.imageFileName} numberOfLines={1}>
                          {attachment.fileName}
                        </Text>
                        <Text style={styles.imageFileSize}>
                          {formatFileSize(attachment.fileSize)}
                        </Text>
                      </View>
                      <Ionicons
                        name="expand-outline"
                        size={20}
                        color={colors.common.white}
                      />
                    </View>
                  </TouchableOpacity>
                );
              } else {
                return (
                  <TouchableOpacity
                    key={attachment.id}
                    style={styles.attachmentItem}
                  >
                    <View style={styles.attachmentIcon}>
                      <Ionicons
                        name={getFileIcon(attachment.fileType)}
                        size={20}
                        color={colors.file.document}
                      />
                    </View>
                    <View style={styles.attachmentInfo}>
                      <Text style={styles.attachmentName}>
                        {attachment.fileName}
                      </Text>
                      <Text style={styles.attachmentSize}>
                        {formatFileSize(attachment.fileSize)}
                      </Text>
                    </View>
                    <Ionicons
                      name="download-outline"
                      size={20}
                      color={colors.text.secondary}
                    />
                  </TouchableOpacity>
                );
              }
            })}
          </View>
        )}

        {/* Stats and Actions */}
        <View style={styles.statsSection}>
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Ionicons
                name="eye-outline"
                size={16}
                color={colors.interaction.view}
              />
              <Text style={styles.statText}>{topic.viewCount}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons
                name="chatbubble-outline"
                size={16}
                color={colors.interaction.comment}
              />
              <Text style={styles.statText}>{topic.commentCount}</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.actionItem,
                topic.userInteraction &&
                  topic.userInteraction.userReaction === ETopicReaction.LIKE &&
                  styles.actionActive,
              ]}
              onPress={() => handleReaction(ETopicReaction.LIKE)}
            >
              <LikeIcon
                color={
                  topic.userInteraction &&
                  topic.userInteraction.userReaction === ETopicReaction.LIKE
                    ? colors.interaction.like
                    : colors.text.secondary
                }
                size={16}
              />

              <Text
                style={[
                  styles.actionText,
                  topic.userInteraction &&
                    topic.userInteraction.userReaction ===
                      ETopicReaction.LIKE && {
                      color: colors.interaction.like,
                    },
                ]}
              >
                {topic.likeCount}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionItem,
                topic.userInteraction &&
                  topic.userInteraction.userReaction ===
                    ETopicReaction.DISLIKE &&
                  styles.actionActive,
              ]}
              onPress={() => handleReaction(ETopicReaction.DISLIKE)}
            >
              <DislikeIcon
                color={
                  topic.userInteraction &&
                  topic.userInteraction.userReaction === ETopicReaction.DISLIKE
                    ? colors.interaction.like
                    : colors.text.secondary
                }
                size={16}
              />
              <Text
                style={[
                  styles.actionText,
                  topic.userInteraction &&
                    topic.userInteraction.userReaction ===
                      ETopicReaction.DISLIKE && {
                      color: colors.interaction.like,
                    },
                ]}
              >
                {topic.dislikeCount}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem}>
              <Ionicons
                name="chatbubble-outline"
                size={18}
                color={colors.interaction.comment}
              />
              <Text style={styles.actionText}>Bình luận</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Comments Section Placeholder */}
        <View style={styles.commentsSection}>
          <Text style={styles.sectionTitle}>
            Bình luận ({topic.commentCount})
          </Text>
          <TouchableOpacity style={styles.writeCommentButton}>
            <Text style={styles.writeCommentText}>Viết bình luận...</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    marginLeft: 4,
  },
  content: {
    flex: 1,
  },
  titleSection: {
    padding: 16,
    backgroundColor: colors.background.default,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  topicTitle: {
    fontSize: 20,
    fontFamily: fonts.openSans.bold,
    color: colors.text.primary,
    lineHeight: 28,
    marginBottom: 12,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryTag: {
    backgroundColor: colors.tag.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.tag.border,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: fonts.openSans.medium,
    color: colors.tag.text,
  },
  authorSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.background.default,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  authorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.avatar.background,
    borderWidth: 2,
    borderColor: colors.avatar.border,
  },
  authorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  authorName: {
    fontSize: 16,
    fontFamily: fonts.openSans.semiBold,
    color: colors.text.primary,
    marginBottom: 2,
  },
  authorDetails: {
    fontSize: 13,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  postTime: {
    fontSize: 12,
    fontFamily: fonts.openSans.regular,
    color: colors.text.hint,
  },
  contentSection: {
    padding: 16,
    backgroundColor: colors.background.default,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  topicContent: {
    fontSize: 15,
    fontFamily: fonts.openSans.regular,
    color: colors.text.primary,
    lineHeight: 22,
  },
  attachmentsSection: {
    padding: 16,
    backgroundColor: colors.background.default,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.openSans.semiBold,
    color: colors.text.primary,
    marginBottom: 12,
  },
  // Regular file attachment styles
  attachmentItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: colors.background.paper,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border.light,
    marginBottom: 8,
  },
  attachmentIcon: {
    width: 36,
    height: 36,
    backgroundColor: colors.background.surface,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  attachmentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  attachmentName: {
    fontSize: 14,
    fontFamily: fonts.openSans.medium,
    color: colors.text.primary,
    marginBottom: 2,
  },
  attachmentSize: {
    fontSize: 12,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
  },
  // Image attachment styles
  imageAttachmentContainer: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.background.paper,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  attachmentImage: {
    width: "100%",
    height: 200,
    backgroundColor: colors.background.surface,
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },
  imageInfo: {
    flex: 1,
  },
  imageFileName: {
    fontSize: 14,
    fontFamily: fonts.openSans.medium,
    color: colors.common.white,
    marginBottom: 2,
  },
  imageFileSize: {
    fontSize: 12,
    fontFamily: fonts.openSans.regular,
    color: colors.common.white,
    opacity: 0.8,
  },
  // Image viewer modal styles
  imageModalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
  },
  imageModalContainer: {
    flex: 1,
  },
  imageModalHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  imageModalCloseButton: {
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
  },
  imageModalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  fullscreenImage: {
    width: screenWidth - 32,
    height: screenHeight - 200,
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.background.default,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  statText: {
    fontSize: 13,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 8,
    backgroundColor: colors.background.paper,
  },
  actionActive: {
    backgroundColor: colors.background.surface,
  },
  actionText: {
    fontSize: 13,
    fontFamily: fonts.openSans.medium,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  commentsSection: {
    padding: 16,
    backgroundColor: colors.background.default,
  },
  writeCommentButton: {
    padding: 16,
    backgroundColor: colors.background.paper,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  writeCommentText: {
    fontSize: 14,
    fontFamily: fonts.openSans.regular,
    color: colors.text.placeholder,
  },
  errorText: {
    fontSize: 16,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
    textAlign: "center",
    marginTop: 50,
  },
});
