import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "../../hooks";
import { NAMESPACES } from "../../i18n";
import { colors } from "../../theme/colors";
import { RootStackNavigationProp } from "../../types/navigation";
import { ArrowRightIcon, LanguageIcon, UserIcon } from "../../components/icons";
import { Button } from "../../components/common/Button";

interface HomeScreenProps {
  navigation: RootStackNavigationProp;
}

const SettingsScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { signOut } = useAuth();
  const { t } = useTranslation(NAMESPACES.SETTINGS);

  const handleLanguagePress = (): void => {
    navigation.navigate("Language");
  };

  const handleProfilePress = (): void => {
    navigation.navigate("Profile");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("title")}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.buttonContainer}>
            <Button onPress={handleLanguagePress} style={styles.button}>
              <View style={styles.buttonLeftContent}>
                <LanguageIcon size={28} />
                <Text style={styles.buttonText}>{t("language")}</Text>
              </View>
              <ArrowRightIcon size={28} />
            </Button>
            <Button onPress={handleProfilePress} style={styles.button}>
              <View style={styles.buttonLeftContent}>
                <UserIcon size={28} />
                <Text style={styles.buttonText}>{t("profile")}</Text>
              </View>
              <ArrowRightIcon size={28} />
            </Button>
          </View>

          <Button onPress={signOut} style={styles.buttonLogout}>
            <Text style={styles.buttonLogoutText}>{t("button.logout")}</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.common.gray2,
  },
  container: {
    flex: 1,
    backgroundColor: colors.common.gray2,
    padding: 16,
    gap: 10,
  },
  header: {
    alignItems: "center",
  },
  title: {
    fontFamily: "OpenSans_700Bold",
    fontSize: 20,
    color: colors.common.gray3,
  },
  content: {
    gap: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    backgroundColor: colors.common.transparent,
    height: 40,
  },
  buttonLeftContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  buttonText: {
    fontFamily: "OpenSans_400Regular",
    fontSize: 14,
    color: colors.common.gray3,
  },
  buttonContainer: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: colors.common.white,
    shadowColor: colors.common.gray3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    gap: 6,
  },
  buttonLogoutText: {
    color: colors.common.red,
    fontFamily: "OpenSans_700Bold",
  },
  buttonLogout: {
    borderColor: colors.common.red,
    borderWidth: 1,
    backgroundColor: colors.common.transparent,
  },
});

export default SettingsScreen;
