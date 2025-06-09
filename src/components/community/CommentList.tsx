import React, { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { IComment } from "../../types/comment";
import { CommentItem } from "./CommentItem";

interface CommentListProps {
  comments: IComment[];
  onDelete?: (commentId: number) => void;
  currentUserId?: number;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
  deleting?: boolean;
}

export const CommentList: React.FC<CommentListProps> = ({
  comments,
  onDelete,
  currentUserId,
  loading,
  refreshing = false,
  onRefresh,
  hasMore = false,
  onLoadMore,
  deleting,
}) => {
  const renderComment = ({ item }: { item: IComment }) => (
    <CommentItem
      comment={item}
      onDelete={onDelete}
      currentUserId={currentUserId}
      deleting={deleting}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Chưa có bình luận</Text>
      <Text style={styles.emptyMessage}>
        Hãy là người đầu tiên bình luận cho bài viết này!
      </Text>
    </View>
  );

  const renderLoadMore = () => {
    if (!hasMore) return null;

    return (
      <TouchableOpacity style={styles.loadMoreButton} onPress={onLoadMore}>
        <Text style={styles.loadMoreText}>Xem thêm bình luận</Text>
      </TouchableOpacity>
    );
  };

  if (comments.length === 0) {
    return renderEmptyState();
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary.main]}
            tintColor={colors.primary.main}
          />
        ) : undefined
      }
      scrollEventThrottle={16}
      nestedScrollEnabled={true}
    >
      {comments.map((comment) => (
        <View key={comment.id.toString()}>
          {renderComment({ item: comment })}
        </View>
      ))}
      {renderLoadMore()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: fonts.openSans.semiBold,
    color: colors.text.secondary,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyMessage: {
    fontSize: 14,
    fontFamily: fonts.openSans.regular,
    color: colors.text.hint,
    textAlign: "center",
    lineHeight: 20,
  },
  loadMoreButton: {
    backgroundColor: colors.background.paper,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
    alignItems: "center",
  },
  loadMoreText: {
    fontSize: 14,
    fontFamily: fonts.openSans.medium,
    color: colors.primary.main,
  },
});
