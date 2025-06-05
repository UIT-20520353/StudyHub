import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { CommentIcon, DislikeIcon, LikeIcon } from "../../components/icons";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { ITopic } from "../../types/topic";
import { ETopicReaction } from "../../enums/topic";

interface TopicItemProps {
  topic: ITopic;
  onTopicPress: (topic: ITopic) => void;
}

export const TopicItem: React.FunctionComponent<TopicItemProps> = ({
  topic,
  onTopicPress,
}) => {
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

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const renderCategories = () => {
    if (!topic.categories || topic.categories.length === 0) {
      return null;
    }

    return (
      <View style={styles.categoryScrollContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {topic.categories.map((cat) => (
            <View key={cat.id} style={styles.categoryTag}>
              <Text style={styles.categoryText}>{cat.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View key={topic.id} style={styles.topicCard}>
      {/* Header */}
      <View style={styles.topicHeader}>
        <View style={styles.authorInfo}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: topic.author.avatarUrl || "https://via.placeholder.com/44",
              }}
              style={styles.authorAvatar}
            />
          </View>
          <View style={styles.authorDetails}>
            <Text style={styles.authorName} numberOfLines={1}>
              {topic.author.fullName}
            </Text>
            <View style={styles.authorMetaRow}>
              <Text style={styles.authorMeta} numberOfLines={1}>
                {topic.author.major && `${topic.author.major} • `}
                {topic.author.university.shortName}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeAgo}>{formatTimeAgo(topic.createdAt)}</Text>
        </View>
      </View>
      {/* Content */}

      <TouchableOpacity
        style={styles.topicContentContainer}
        activeOpacity={0.8}
        onPress={() => onTopicPress(topic)}
      >
        <View style={styles.topicContent}>
          <Text style={styles.topicTitle} numberOfLines={2}>
            {topic.title}
          </Text>
          <Text style={styles.topicDescription} numberOfLines={3}>
            {topic.content}
          </Text>
        </View>
      </TouchableOpacity>
      {/* Categories */}
      {renderCategories()}
      {/* Attachments indicator */}
      {topic.attachments && topic.attachments.length > 0 && (
        <View style={styles.attachmentContainer}>
          <View style={styles.attachmentIndicator}>
            <Text style={styles.attachmentIcon}>📎</Text>
            <Text style={styles.attachmentText}>
              {topic.attachments.length} tệp đính kèm
            </Text>
          </View>
        </View>
      )}
      {/* Footer Stats */}
      <View style={styles.topicFooter}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <LikeIcon
              color={
                topic.userInteraction &&
                topic.userInteraction.userReaction === ETopicReaction.LIKE
                  ? colors.interaction.like
                  : colors.interaction.dislike
              }
              size={16}
            />
            <Text
              style={[
                styles.likeText,
                topic.userInteraction &&
                  topic.userInteraction.userReaction ===
                    ETopicReaction.LIKE && {
                    color: colors.interaction.like,
                  },
              ]}
            >
              {formatNumber(topic.likeCount)}
            </Text>
          </View>

          <View style={styles.statItem}>
            <DislikeIcon
              color={
                topic.userInteraction &&
                topic.userInteraction.userReaction === ETopicReaction.DISLIKE
                  ? colors.interaction.like
                  : colors.interaction.dislike
              }
              size={16}
            />
            <Text
              style={[
                styles.dislikeText,
                topic.userInteraction &&
                  topic.userInteraction.userReaction ===
                    ETopicReaction.DISLIKE && {
                    color: colors.interaction.like,
                  },
              ]}
            >
              {formatNumber(topic.dislikeCount)}
            </Text>
          </View>

          <View style={styles.statItem}>
            <CommentIcon color={colors.interaction.dislike} size={20} />
            <Text style={styles.commentText}>
              {formatNumber(topic.commentCount)}
            </Text>
          </View>
        </View>

        <Text style={styles.viewCount}>
          {formatNumber(topic.viewCount)} lượt xem
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topicCard: {
    backgroundColor: colors.card.background,
    borderRadius: 16,
    padding: 20,
    gap: 16,
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
  topicHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  avatarContainer: {
    position: "relative",
  },
  authorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.avatar.background,
    borderWidth: 2,
    borderColor: colors.avatar.border,
  },
  authorDetails: {
    flex: 1,
    gap: 4,
  },
  authorName: {
    fontFamily: fonts.openSans.semiBold,
    fontSize: 15,
    color: colors.text.primary,
    lineHeight: 20,
  },
  authorMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  authorMeta: {
    fontFamily: fonts.openSans.medium,
    fontSize: 12,
    color: colors.text.secondary,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.text.disabled,
  },
  universityText: {
    fontFamily: fonts.openSans.regular,
    fontSize: 12,
    color: colors.text.hint,
    flex: 1,
  },
  timeContainer: {
    backgroundColor: colors.common.gray1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeAgo: {
    fontFamily: fonts.openSans.medium,
    fontSize: 11,
    color: colors.text.hint,
  },
  topicContentContainer: {
    flex: 1,
  },
  topicContent: {
    gap: 8,
  },
  topicTitle: {
    fontFamily: fonts.openSans.bold,
    fontSize: 17,
    color: colors.text.primary,
    lineHeight: 24,
  },
  topicDescription: {
    fontFamily: fonts.openSans.regular,
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  categoryScrollContainer: {
    height: 36,
  },
  categoryScrollContent: {
    flexDirection: "row",
    gap: 8,
    paddingRight: 16,
  },
  categoryTag: {
    backgroundColor: colors.tag.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.tag.border,
    alignSelf: "flex-start",
  },
  categoryText: {
    fontFamily: fonts.openSans.semiBold,
    fontSize: 12,
    color: colors.tag.text,
  },
  attachmentContainer: {
    flexDirection: "row",
  },
  attachmentIndicator: {
    backgroundColor: colors.background.paper,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  attachmentIcon: {
    fontSize: 14,
  },
  attachmentText: {
    fontFamily: fonts.openSans.medium,
    fontSize: 12,
    color: colors.text.secondary,
  },
  topicFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  likeText: {
    fontFamily: fonts.openSans.semiBold,
    fontSize: 13,
    color: colors.interaction.dislike,
  },
  dislikeText: {
    fontFamily: fonts.openSans.medium,
    fontSize: 13,
    color: colors.interaction.dislike,
  },
  commentIcon: {
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  commentIconText: {
    fontSize: 14,
  },
  commentText: {
    fontFamily: fonts.openSans.medium,
    fontSize: 13,
    color: colors.interaction.dislike,
  },
  viewCount: {
    fontFamily: fonts.openSans.regular,
    fontSize: 12,
    color: colors.interaction.view,
  },
});
