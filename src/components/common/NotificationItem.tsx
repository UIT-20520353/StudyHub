import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { INotification } from "../../types/notification";
import { ENotificationType } from "../../enums/notification";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
// import { formatDistanceToNow } from "date-fns";
// import { vi } from "date-fns/locale";

interface NotificationItemProps {
  notification: INotification;
  onPress?: (notification: INotification) => void;
  onMarkAsRead?: (notificationId: number) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onPress,
  onMarkAsRead,
}) => {
  const getNotificationIcon = (type: ENotificationType) => {
    switch (type) {
      case ENotificationType.PRODUCT_ORDERED:
        return "receipt-outline";
      case ENotificationType.PRODUCT_COMMENTED:
        return "chatbubble-outline";
      case ENotificationType.TOPIC_LIKED:
        return "heart-outline";
      case ENotificationType.TOPIC_FOLLOWED:
        return "person-add-outline";
      case ENotificationType.TOPIC_COMMENTED:
        return "chatbubbles-outline";
      case ENotificationType.COMMENT_LIKED:
        return "thumbs-up-outline";
      default:
        return "notifications-outline";
    }
  };

  const getNotificationIconColor = (type: ENotificationType) => {
    switch (type) {
      case ENotificationType.PRODUCT_ORDERED:
        return colors.status.success;
      case ENotificationType.PRODUCT_COMMENTED:
        return colors.interaction.comment;
      case ENotificationType.TOPIC_LIKED:
        return colors.interaction.like;
      case ENotificationType.TOPIC_FOLLOWED:
        return colors.primary.main;
      case ENotificationType.TOPIC_COMMENTED:
        return colors.interaction.comment;
      case ENotificationType.COMMENT_LIKED:
        return colors.interaction.like;
      default:
        return colors.primary.main;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffDays > 0) {
        return `${diffDays} ngày trước`;
      } else if (diffHours > 0) {
        return `${diffHours} giờ trước`;
      } else {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return diffMinutes > 0 ? `${diffMinutes} phút trước` : "Vừa xong";
      }
    } catch {
      return "Vừa xong";
    }
  };

  const handlePress = () => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    if (onPress) {
      onPress(notification);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, !notification.read && styles.unreadContainer]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor:
                  getNotificationIconColor(notification.type) + "20",
              },
            ]}
          >
            <Ionicons
              name={getNotificationIcon(notification.type) as any}
              size={20}
              color={getNotificationIconColor(notification.type)}
            />
          </View>

          {notification.sender?.avatarUrl && (
            <Image
              source={{ uri: notification.sender.avatarUrl }}
              style={styles.senderAvatar}
            />
          )}
        </View>

        <View style={styles.textSection}>
          <Text
            style={[styles.title, !notification.read && styles.unreadTitle]}
          >
            {notification.title}
          </Text>

          <Text style={styles.content} numberOfLines={2}>
            {notification.content}
          </Text>

          <View style={styles.metaRow}>
            <Text style={styles.timeText}>
              {formatTime(notification.createdAt)}
            </Text>
          </View>

          {notification.topic && (
            <View style={styles.topicContainer}>
              <Text style={styles.topicText}>{notification.topic}</Text>
            </View>
          )}
        </View>

        {!notification.read && <View style={styles.unreadDot} />}
      </View>

      {notification.product && (
        <View style={styles.productPreview}>
          <Image
            source={{
              uri:
                notification.product.images?.[0]?.imageUrl ||
                notification.product.primaryImageUrl,
            }}
            style={styles.productImage}
          />
          <Text style={styles.productName} numberOfLines={1}>
            {notification.product.title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card.background,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.card.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  unreadContainer: {
    backgroundColor: colors.primary.light + "10",
    borderLeftWidth: 3,
    borderLeftColor: colors.primary.main,
  },
  content: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  leftSection: {
    marginRight: 12,
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  senderAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.card.background,
    marginTop: -8,
  },
  textSection: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontFamily: fonts.openSans.bold,
    color: colors.text.primary,
    marginBottom: 4,
  },
  unreadTitle: {
    fontFamily: fonts.openSans.bold,
  },
  contentText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  senderName: {
    fontSize: 12,
    color: colors.primary.main,
    fontFamily: fonts.openSans.medium,
  },
  timeText: {
    fontSize: 12,
    color: colors.text.hint,
  },
  topicContainer: {
    backgroundColor: colors.tag.background,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  topicText: {
    fontSize: 11,
    color: colors.tag.text,
    fontFamily: fonts.openSans.medium,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary.main,
    marginLeft: 8,
    marginTop: 4,
  },
  productPreview: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  productImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: colors.background.disabled,
  },
  productName: {
    flex: 1,
    fontSize: 13,
    color: colors.text.secondary,
    fontFamily: fonts.openSans.medium,
  },
});
