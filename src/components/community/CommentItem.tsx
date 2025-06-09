import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { IComment } from "../../types/comment";
import { useFormatters } from "../../utils/formatters";
import { Avatar } from "../common/Avatar";
import DeleteCommentModal from "./DeleteCommentModal";

interface CommentItemProps {
  comment: IComment;
  onDelete?: (commentId: number) => void;
  currentUserId?: number;
  deleting?: boolean;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onDelete,
  currentUserId,
  deleting,
}) => {
  const { formatTimeAgo } = useFormatters();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeletePress = () => {
    if (deleting) return;
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = (commentId: number) => {
    onDelete?.(commentId);
    setShowDeleteModal(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar source={comment.author.avatarUrl} size={36} />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{comment.author.fullName}</Text>
          <Text style={styles.timeAgo}>{formatTimeAgo(comment.createdAt)}</Text>
        </View>

        {currentUserId === comment.author.id && (
          <TouchableOpacity
            style={styles.moreButton}
            onPress={handleDeletePress}
          >
            <Ionicons name="trash" size={20} color={colors.error.main} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.content}>{comment.content}</Text>
      </View>

      <DeleteCommentModal
        visible={showDeleteModal}
        comment={comment}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.default,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.avatar.background,
    borderWidth: 1,
    borderColor: colors.avatar.border,
  },
  authorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  authorName: {
    fontSize: 14,
    fontFamily: fonts.openSans.semiBold,
    color: colors.text.primary,
    marginBottom: 2,
  },
  authorMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  authorDetails: {
    fontSize: 12,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
  },
  timeAgo: {
    fontSize: 12,
    fontFamily: fonts.openSans.regular,
    color: colors.text.hint,
  },
  moreButton: {
    padding: 4,
  },
  contentContainer: {
    marginLeft: 48,
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    fontFamily: fonts.openSans.regular,
    color: colors.text.primary,
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 48,
    gap: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  actionActive: {
    backgroundColor: colors.background.surface,
  },
  actionText: {
    fontSize: 12,
    fontFamily: fonts.openSans.medium,
    color: colors.text.secondary,
  },
});
