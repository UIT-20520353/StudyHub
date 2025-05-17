import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "../../hooks/useTranslation";
import { LANGUAGES, LANGUAGE_NAMES } from "../../i18n";

const LanguageSelector = () => {
  const { t, changeLanguage, getCurrentLanguage } = useTranslation("settings");
  const currentLanguage = getCurrentLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("language")}</Text>
      <View style={styles.buttonContainer}>
        {Object.entries(LANGUAGES).map(([key, value]) => (
          <TouchableOpacity
            key={value}
            style={[
              styles.languageButton,
              currentLanguage === value && styles.activeLanguage,
            ]}
            onPress={() => changeLanguage(value)}
          >
            <Text
              style={[
                styles.languageText,
                currentLanguage === value && styles.activeLanguageText,
              ]}
            >
              {LANGUAGE_NAMES[value]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  languageButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginRight: 10,
  },
  activeLanguage: {
    backgroundColor: "#1976D2",
    borderColor: "#1976D2",
  },
  languageText: {
    fontSize: 16,
    color: "#333",
  },
  activeLanguageText: {
    color: "#fff",
  },
});

export default LanguageSelector;
