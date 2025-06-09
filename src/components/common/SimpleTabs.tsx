import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from "react-native";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";

interface TabItem {
  key: string;
  title: string;
  count?: number;
}

interface SimpleTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabKey: string) => void;
  style?: object;
}

const SimpleTabs: React.FC<SimpleTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  style,
}) => {
  const [indicatorWidth] = useState(new Animated.Value(0));
  const [indicatorLeft] = useState(new Animated.Value(0));

  const onTabLayout = (event: any, index: number) => {
    if (tabs[index].key === activeTab) {
      const { width, x } = event.nativeEvent.layout;
      Animated.parallel([
        Animated.timing(indicatorWidth, {
          toValue: width,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(indicatorLeft, {
          toValue: x,
          duration: 250,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabContainer}
      >
        {tabs.map((tab, index) => {
          const isActive = tab.key === activeTab;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => onTabChange(tab.key)}
              onLayout={(event) => onTabLayout(event, index)}
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
      <Animated.View
        style={[
          styles.indicator,
          {
            width: indicatorWidth,
            left: indicatorLeft,
          },
        ]}
      />
    </View>
  );
};

// Example usage component
const TopicsTabExample = () => {
  const [activeTab, setActiveTab] = useState("all");

  const tabs: TabItem[] = [
    { key: "all", title: "Tất cả", count: 125 },
    { key: "my-topics", title: "Topics của tôi", count: 8 },
    { key: "following", title: "Đang theo dõi", count: 23 },
    { key: "liked", title: "Đã thích", count: 45 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "all":
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.contentTitle}>📋 Tất cả Topics</Text>
            <Text style={styles.contentText}>
              Hiển thị tất cả các topics từ cộng đồng StudyHub
            </Text>
            <View style={styles.mockList}>
              {[1, 2, 3, 4, 5].map((item) => (
                <View key={item} style={styles.mockItem}>
                  <Text style={styles.mockItemTitle}>
                    Topic {item}: Kinh nghiệm học môn Toán cao cấp
                  </Text>
                  <Text style={styles.mockItemMeta}>
                    👤 Nguyễn Văn A • 🏫 ĐH Bách Khoa • ⏰ 2 giờ trước
                  </Text>
                </View>
              ))}
            </View>
          </View>
        );
      case "my-topics":
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.contentTitle}>✍️ Topics của tôi</Text>
            <Text style={styles.contentText}>
              Các topics bạn đã tạo và chia sẻ với cộng đồng
            </Text>
            <View style={styles.mockList}>
              {[1, 2, 3].map((item) => (
                <View key={item} style={styles.mockItem}>
                  <Text style={styles.mockItemTitle}>
                    Topic của tôi {item}: Chia sẻ tài liệu Lập trình Java
                  </Text>
                  <Text style={styles.mockItemMeta}>
                    👁️ 45 lượt xem • 💬 12 bình luận • ❤️ 8 lượt thích
                  </Text>
                </View>
              ))}
            </View>
          </View>
        );
      case "following":
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.contentTitle}>🔔 Đang theo dõi</Text>
            <Text style={styles.contentText}>
              Topics bạn đang theo dõi để nhận thông báo mới
            </Text>
          </View>
        );
      case "liked":
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.contentTitle}>❤️ Đã thích</Text>
            <Text style={styles.contentText}>
              Topics mà bạn đã bày tỏ sự yêu thích
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.exampleContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community Topics</Text>
      </View>

      <SimpleTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        style={styles.tabsWrapper}
      />

      <ScrollView style={styles.content}>{renderContent()}</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.default,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  tabContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: colors.background.light,
    minWidth: 80,
    justifyContent: "center",
  },
  activeTab: {
    backgroundColor: colors.primary.light,
  },
  tabText: {
    fontSize: 14,
    fontFamily: fonts.openSans.medium,
    color: colors.text.secondary,
  },
  activeTabText: {
    color: colors.primary.dark,
    fontFamily: fonts.openSans.semiBold,
  },
  countBadge: {
    backgroundColor: colors.text.disabled,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
    minWidth: 18,
    alignItems: "center",
  },
  activeCountBadge: {
    backgroundColor: colors.primary.main,
  },
  countText: {
    fontSize: 11,
    fontFamily: fonts.openSans.bold,
    color: colors.common.white,
  },
  activeCountText: {
    color: colors.common.white,
  },
  indicator: {
    height: 3,
    backgroundColor: colors.primary.main,
    borderRadius: 2,
    position: "absolute",
    bottom: 0,
  },

  // Example component styles
  exampleContainer: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    backgroundColor: colors.background.paper,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: fonts.openSans.bold,
    color: colors.text.primary,
  },
  tabsWrapper: {
    marginBottom: 0,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  contentTitle: {
    fontSize: 18,
    fontFamily: fonts.openSans.semiBold,
    color: colors.text.primary,
    marginBottom: 8,
  },
  contentText: {
    fontSize: 14,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  mockList: {
    gap: 12,
  },
  mockItem: {
    backgroundColor: colors.background.paper,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  mockItemTitle: {
    fontSize: 16,
    fontFamily: fonts.openSans.semiBold,
    color: colors.text.primary,
    marginBottom: 8,
  },
  mockItemMeta: {
    fontSize: 12,
    fontFamily: fonts.openSans.regular,
    color: colors.text.disabled,
  },
});

export default TopicsTabExample;
