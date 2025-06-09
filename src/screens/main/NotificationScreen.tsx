import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Loading } from "../../components/common/Loading";
import { NotificationItem } from "../../components/common/NotificationItem";
import { NotificationTab } from "../../components/notification/Tab";
import { notificationService } from "../../services/notification";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { MainTabNavigationProp } from "../../types/navigation";
import { INotification } from "../../types/notification";

interface NotificationScreenProps {
  navigation: MainTabNavigationProp;
}

export const NotificationScreen: React.FC<NotificationScreenProps> = ({
  navigation,
}) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"ALL" | "UNREAD">("ALL");

  const loadNotifications = async () => {
    setLoading(true);
    const { ok, body } = await notificationService.getNotifications();

    if (ok) {
      setNotifications(body);
    }

    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const markAsRead = async (notificationId: number) => {
    try {
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      Alert.alert("Lỗi", "Không thể đánh dấu đã đọc");
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );
    } catch (error) {
      Alert.alert("Lỗi", "Không thể đánh dấu tất cả đã đọc");
    }
  };

  const handleNotificationPress = (notification: INotification) => {
    // Navigate based on notification type
    // switch (notification.type) {
    //   case ENotificationType.PRODUCT_ORDERED:
    //     if (notification.order) {
    //       navigation.navigate("OrderDetail", {
    //         orderId: notification.order.id,
    //       });
    //     }
    //     break;
    //   case ENotificationType.PRODUCT_COMMENTED:
    //     if (notification.product) {
    //       navigation.navigate("ProductDetail", {
    //         productId: notification.product.id,
    //       });
    //     }
    //     break;
    //   default:
    //     // For other notifications
    //     break;
    // }
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) =>
      activeTab === "ALL" ? true : !notification.read
    );
  }, [notifications, activeTab]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [])
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="notifications-outline"
        size={80}
        color={colors.text.disabled}
      />
      <Text style={styles.emptyTitle}>
        {activeTab === "UNREAD"
          ? "Không có thông báo chưa đọc"
          : "Không có thông báo"}
      </Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === "UNREAD"
          ? "Tất cả thông báo đã được đọc"
          : "Bạn sẽ nhận được thông báo về đơn hàng, tin nhắn và cập nhật hệ thống tại đây"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Thông báo</Text>

        <TouchableOpacity
          style={styles.headerRight}
          onPress={markAllAsRead}
          disabled={unreadCount === 0}
        >
          <Ionicons
            name="checkmark-done-outline"
            size={24}
            color={unreadCount > 0 ? colors.primary.main : colors.text.disabled}
          />
        </TouchableOpacity>
      </View>

      <NotificationTab activeTab={activeTab} onTabChange={setActiveTab} />

      {loading ? (
        <Loading />
      ) : (
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <NotificationItem
              notification={item}
              onPress={handleNotificationPress}
              onMarkAsRead={markAsRead}
            />
          )}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary.main]}
              tintColor={colors.primary.main}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.contentContainer,
            filteredNotifications.length === 0 && styles.emptyContentContainer,
          ]}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  emptyContentContainer: {
    flexGrow: 1,
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
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.primary.light,
  },
  markAllText: {
    fontSize: 12,
    color: colors.primary.dark,
    fontWeight: "600",
  },
  filterContainer: {
    flexDirection: "row",
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background.light,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  filterButtonActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  filterText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: "500",
  },
  filterTextActive: {
    color: colors.common.white,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default NotificationScreen;
