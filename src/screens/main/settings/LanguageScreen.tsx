import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "../../../hooks";
import { LANGUAGES, NAMESPACES } from "../../../i18n";
import { colors } from "../../../theme/colors";
import { Button } from "../../../components/common/Button";

const LanguageScreen: React.FC = () => {
  const { changeLanguage, getCurrentLanguage } = useTranslation(
    NAMESPACES.SETTINGS
  );
  const currentLanguage = getCurrentLanguage();

  return (
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
  );
};

const styles = StyleSheet.create({
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
