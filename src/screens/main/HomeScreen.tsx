import React from "react";
import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CommonHeader from "../../components/common/CommonHeader";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "../../hooks";
import { NAMESPACES } from "../../i18n";
import { RootStackNavigationProp } from "../../types/navigation";
import { colors } from "../../theme/colors";
import { DislikeIcon, LikeIcon } from "../../components/icons";

interface HomeScreenProps {
  navigation: RootStackNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { signOut, user } = useAuth();
  const { t } = useTranslation(NAMESPACES.HOME);

  const handleProfilePress = (): void => {
    signOut();
  };

  const handleChatPress = (): void => {
    // Xử lý khi người dùng nhấn vào icon chat
    console.log("Chat pressed");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <CommonHeader
          onProfilePress={handleProfilePress}
          onChatPress={handleChatPress}
        />

        <View style={styles.content}>
          <View style={styles.introduceContainer}>
            <Text style={styles.welcomeText}>
              {t("hello", { name: user?.fullName })}
            </Text>
            <Text style={styles.introduceText}>{t("introduce")}</Text>
          </View>

          <View style={styles.topTopicsContainer}>
            <Text style={styles.topTopicsTitle}>{t("top_topics")}</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[
                {
                  title: "Lập trình Web",
                  description:
                    "Học cách xây dựng website hiện đại với React, Node.js và các công nghệ web mới nhất. Khóa học này sẽ giúp bạn trở thành một web developer chuyên nghiệp.",
                },
                {
                  title: "Machine Learning",
                  description:
                    "Tìm hiểu về AI và ML. Các thuật toán cơ bản và ứng dụng thực tế.",
                },
                {
                  title: "Thiết kế UI/UX",
                  description:
                    "Khóa học toàn diện về thiết kế giao diện người dùng và trải nghiệm người dùng. Học cách tạo ra các sản phẩm số đẹp mắt và dễ sử dụng. Từ wireframe đến prototype, từ research đến testing.",
                },
                {
                  title: "Mobile Development",
                  description:
                    "Phát triển ứng dụng di động với React Native. Xây dựng app cho cả iOS và Android.",
                },
                {
                  title: "Data Science",
                  description:
                    "Phân tích dữ liệu, trực quan hóa và machine learning. Sử dụng Python, R và các công cụ phân tích dữ liệu hiện đại. Tìm hiểu cách xử lý big data và đưa ra quyết định dựa trên dữ liệu.",
                },
              ].map((item, index) => (
                <View key={`topic-${index}`} style={styles.topicCard}>
                  <View style={styles.topicContent}>
                    <Text style={styles.topicTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text numberOfLines={4} style={styles.topicDescription}>
                      {item.description}
                    </Text>
                  </View>

                  <View style={styles.topicFooter}>
                    <View style={styles.topicFooterItem}>
                      <LikeIcon color={colors.common.white} size={16} />
                      <Text style={styles.topicFooterText}>100</Text>
                    </View>
                    <View style={styles.topicFooterItem}>
                      <DislikeIcon color={colors.common.white} size={16} />
                      <Text style={styles.topicFooterText}>18</Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.topProductsContainer}>
            <Text style={styles.topProductsTitle}>{t("top_products")}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[1, 2, 3, 4, 5].map((item) => (
                <View key={item} style={styles.productCard}>
                  <Image
                    source={{
                      uri: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2098&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    }}
                    style={styles.productImage}
                  />

                  <View style={styles.productInfo}>
                    <Text style={styles.productTitle} numberOfLines={2}>
                      Giáo trình Lịch sử Đảng Cộng sản Việt Nam
                    </Text>
                    <Text style={styles.productPrice}>100.000 VNĐ</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 20,
  },
  welcomeText: {
    fontFamily: "OpenSans_700Bold",
    fontSize: 16,
    color: colors.common.gray3,
  },
  productCard: {
    width: 300,
    marginRight: 16,
    flexDirection: "column",
    gap: 10,
  },
  productImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    resizeMode: "cover",
  },
  productInfo: {
    flexDirection: "column",
    gap: 4,
  },
  productTitle: {
    fontFamily: "OpenSans_600SemiBold",
    fontSize: 14,
    color: colors.common.black,
  },
  productPrice: {
    fontFamily: "OpenSans_400Regular",
    fontSize: 12,
    color: colors.text.secondary,
  },
  introduceText: {
    fontFamily: "OpenSans_400Regular",
    fontSize: 12,
    color: colors.text.secondary,
  },
  introduceContainer: {
    backgroundColor: colors.common.gray2,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 6,
  },
  topProductsContainer: {
    gap: 8,
  },
  topProductsTitle: {
    fontFamily: "OpenSans_700Bold",
    fontSize: 18,
    color: colors.common.gray3,
  },
  topTopicsContainer: {
    gap: 8,
  },
  topTopicsTitle: {
    fontFamily: "OpenSans_700Bold",
    fontSize: 18,
    color: colors.common.gray3,
  },
  topicCard: {
    width: 300,
    height: 165,
    marginRight: 16,
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.primary.light,
    justifyContent: "space-between",
  },
  topicContent: {
    flex: 1,
    gap: 4,
  },
  topicTitle: {
    fontFamily: "OpenSans_600SemiBold",
    fontSize: 14,
    color: colors.common.black,
  },
  topicDescription: {
    fontFamily: "OpenSans_400Regular",
    fontSize: 12,
    color: colors.text.secondary,
  },
  topicFooter: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
    flexDirection: "row",
    gap: 10,
    backgroundColor: colors.primary.dark,
    alignSelf: "flex-start",
  },
  topicFooterItem: {
    flexDirection: "row",
    gap: 4,
  },
  topicFooterText: {
    fontFamily: "OpenSans_400Regular",
    fontSize: 10,
    color: colors.common.white,
  },
});

export default HomeScreen;
