import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CommonHeader from "../../components/common/CommonHeader";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "../../hooks";
import { NAMESPACES } from "../../i18n";
import { RootStackNavigationProp } from "../../types/navigation";
import { colors } from "../../theme/colors";

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

          {/* <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {[1, 2, 3, 4, 5].map((item) => (
              <View key={item} style={styles.card}>
                <Text style={styles.cardText}>Card {item}</Text>
              </View>
            ))}
          </ScrollView> */}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  welcomeText: {
    fontFamily: "OpenSans_700Bold",
    fontSize: 16,
    color: colors.common.gray3,
  },
  scrollContent: {
    paddingVertical: 16,
  },
  card: {
    width: 200,
    height: 150,
    backgroundColor: colors.primary.main,
    marginRight: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "OpenSans_600SemiBold",
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
});

export default HomeScreen;
