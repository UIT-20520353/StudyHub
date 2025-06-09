import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CommonHeader from "../../components/common/CommonHeader";
import { TopicItem } from "../../components/community";
import { ProductItem } from "../../components/marketplace";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "../../hooks";
import { NAMESPACES } from "../../i18n";
import { productService } from "../../services/productService";
import { topicService } from "../../services/topicService";
import { colors } from "../../theme/colors";
import { MainTabNavigationProp } from "../../types/navigation";
import { IProductSummary } from "../../types/product";
import { ITopic } from "../../types/topic";

const { width: screenWidth } = Dimensions.get("window");

interface HomeScreenProps {
  navigation: MainTabNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { signOut, user } = useAuth();
  const { t } = useTranslation(NAMESPACES.HOME);

  const [topics, setTopics] = useState<ITopic[]>([]);
  const [products, setProducts] = useState<IProductSummary[]>([]);

  const getTop10Topics = async () => {
    const { ok, body } = await topicService.getTop10Topics();
    if (ok) {
      setTopics(body);
    }
  };

  const getTopProducts = async () => {
    const { ok, body } = await productService.getTopProducts();
    if (ok) {
      setProducts(body);
    }
  };

  const handleProfilePress = (): void => {
    signOut();
  };

  const handleChatPress = (): void => {
    // Xử lý khi người dùng nhấn vào icon chat
    console.log("Chat pressed");
  };

  const handleNotificationPress = (): void => {
    navigation.navigate("Notification");
  };

  useFocusEffect(
    useCallback(() => {
      getTop10Topics();
      getTopProducts();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <CommonHeader
          onProfilePress={handleProfilePress}
          onChatPress={handleChatPress}
          onNotificationPress={handleNotificationPress}
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
              {topics.map((topic) => (
                <TopicItem
                  navigation={navigation}
                  key={topic.id}
                  topic={topic}
                  onTopicPress={() => {
                    navigation.navigate("TopicDetail", {
                      topicId: topic.id,
                    });
                  }}
                  cardStyle={{
                    width: screenWidth - 32,
                    marginRight: 16,
                  }}
                  hideCategories
                  hideAttachments
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.topProductsContainer}>
            <Text style={styles.topProductsTitle}>{t("top_products")}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {products.map((product) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  onProductPress={() => {
                    navigation.navigate("ProductDetail", {
                      productId: product.id,
                    });
                  }}
                  cardStyle={{
                    width: screenWidth - 32,
                    marginRight: 16,
                  }}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
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
