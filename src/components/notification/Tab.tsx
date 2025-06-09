import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../theme/colors";

interface TabItem {
  key: "ALL" | "UNREAD";
  title: string;
}

interface NotificationTabsProps {
  activeTab: "ALL" | "UNREAD";
  onTabChange: (tabKey: "ALL" | "UNREAD") => void;
}

export const NotificationTab: React.FC<NotificationTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs: TabItem[] = [
    {
      key: "ALL",
      title: "Tất cả",
    },
    {
      key: "UNREAD",
      title: "Chưa đọc",
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
});
