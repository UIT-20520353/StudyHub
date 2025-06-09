import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { colors } from "../../theme/colors";
import { EOrderStatus } from "../../enums/order";

interface TabItem {
  key: EOrderStatus;
  title: string;
  count?: number;
}

interface OrderTabsProps {
  activeTab: EOrderStatus;
  onTabChange: (tabKey: EOrderStatus) => void;
  orderCounts: Record<string, number>;
}

const OrderTabs: React.FC<OrderTabsProps> = ({
  activeTab,
  onTabChange,
  orderCounts,
}) => {
  const tabs: TabItem[] = [
    {
      key: EOrderStatus.PENDING,
      title: "Chờ xác nhận",
      count: orderCounts[EOrderStatus.PENDING] || 0,
    },
    {
      key: EOrderStatus.CONFIRMED,
      title: "Đã xác nhận",
      count: orderCounts[EOrderStatus.CONFIRMED] || 0,
    },
    {
      key: EOrderStatus.SHIPPING,
      title: "Đang giao",
      count: orderCounts[EOrderStatus.SHIPPING] || 0,
    },
    {
      key: EOrderStatus.DELIVERED,
      title: "Đã giao",
      count: orderCounts[EOrderStatus.DELIVERED] || 0,
    },
    {
      key: EOrderStatus.COMPLETED,
      title: "Hoàn thành",
      count: orderCounts[EOrderStatus.COMPLETED] || 0,
    },
    {
      key: EOrderStatus.CANCELLED,
      title: "Đã hủy",
      count: orderCounts[EOrderStatus.CANCELLED] || 0,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => onTabChange(tab.key)}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab.title}
              </Text>
              {tab.count !== undefined && tab.count > 0 && (
                <View
                  style={[
                    styles.countBadge,
                    isActive && styles.activeCountBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.countText,
                      isActive && styles.activeCountText,
                    ]}
                  >
                    {tab.count > 99 ? "99+" : tab.count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.common.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.common.gray1,
    paddingVertical: 12,
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: colors.background.light,
    gap: 8,
  },
  activeTab: {
    backgroundColor: colors.primary.main,
  },
  tabText: {
    fontFamily: "OpenSans_600SemiBold",
    fontSize: 14,
    color: colors.text.secondary,
  },
  activeTabText: {
    color: colors.common.white,
  },
  countBadge: {
    backgroundColor: colors.text.secondary,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: "center",
  },
  activeCountBadge: {
    backgroundColor: colors.common.white,
  },
  countText: {
    fontFamily: "OpenSans_600SemiBold",
    fontSize: 10,
    color: colors.common.white,
  },
  activeCountText: {
    color: colors.primary.main,
  },
});

export default OrderTabs;
