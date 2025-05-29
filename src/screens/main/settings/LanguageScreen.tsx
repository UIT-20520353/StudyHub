import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../../components/common/Button";
import { StackNavigationHeader } from "../../../components/common/StackNavigationHeader";
import { useTranslation } from "../../../hooks";
import { LANGUAGES, NAMESPACES } from "../../../i18n";
import { colors } from "../../../theme/colors";
import { RootStackParamList } from "../../../types/navigation";

type LanguageScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Language"
>;

interface LanguageScreenProps {
  navigation: LanguageScreenNavigationProp;
}

const LanguageScreen: React.FC<LanguageScreenProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACES.SETTINGS);
  const { changeLanguage, getCurrentLanguage } = useTranslation(
    NAMESPACES.SETTINGS
  );
  const currentLanguage = getCurrentLanguage();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StackNavigationHeader
        title={t("language")}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <Button
          style={[
            styles.languageCard,
            currentLanguage === LANGUAGES.VI && styles.activeLanguageCard,
          ]}
          onPress={() => changeLanguage(LANGUAGES.VI)}
        >
          <Image
            source={require("../../../assets/images/flag/vietnam.png")}
            style={styles.languageFlag}
          />
          <Text style={styles.languageText}>Tiếng Việt</Text>
        </Button>
        <Button
          style={[
            styles.languageCard,
            currentLanguage === LANGUAGES.EN && styles.activeLanguageCard,
          ]}
          onPress={() => changeLanguage(LANGUAGES.EN)}
        >
          <Image
            source={require("../../../assets/images/flag/united-states.png")}
            style={styles.languageFlag}
          />
          <Text style={styles.languageText}>English</Text>
        </Button>
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
    padding: 16,
    flexDirection: "row",
    gap: 10,
  },
  languageCard: {
    flex: 1,
    backgroundColor: colors.common.white,
    padding: 16,
    borderRadius: 10,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border.light,
    height: "auto",
  },
  languageFlag: {
    width: 80,
    height: 80,
  },
  languageText: {
    fontFamily: "OpenSans_700Bold",
    fontSize: 14,
    color: colors.common.black,
  },
  activeLanguageCard: {
    borderColor: colors.common.red,
  },
});

export default LanguageScreen;
