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
                  title: "Lập trình Frontend",
                  description:
                    "Khám phá thế giới phát triển giao diện web với HTML, CSS, JavaScript và các framework hiện đại. Từ cơ bản đến nâng cao, từ responsive design đến animation.",
                },
                {
                  title: "Tiếng Anh Giao Tiếp",
                  description:
                    "Luyện tập kỹ năng giao tiếp tiếng Anh hàng ngày. Các tình huống thực tế, phát âm chuẩn và ngữ pháp cơ bản.",
                },
                {
                  title: "Marketing Digital",
                  description:
                    "Chiến lược marketing online hiệu quả. SEO, Social Media Marketing, Content Marketing và Email Marketing. Học cách xây dựng thương hiệu và tăng doanh số bán hàng.",
                },
                {
                  title: "Thiết Kế Đồ Họa",
                  description:
                    "Sáng tạo với Photoshop, Illustrator và các công cụ thiết kế chuyên nghiệp. Từ concept đến sản phẩm hoàn chỉnh.",
                },
                {
                  title: "Kỹ Năng Mềm",
                  description:
                    "Phát triển kỹ năng giao tiếp, làm việc nhóm, quản lý thời gian và giải quyết vấn đề. Những kỹ năng cần thiết cho sự thành công trong công việc.",
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
