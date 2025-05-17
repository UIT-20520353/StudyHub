import { useTranslation as useI18nTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY, NAMESPACES } from "./index";

export const useTranslation = (namespace = NAMESPACES.COMMON) => {
  const { t, i18n } = useI18nTranslation(namespace);

  const changeLanguage = async (language: string) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      await i18n.changeLanguage(language);
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  const getCurrentLanguage = () => {
    return i18n.language || DEFAULT_LANGUAGE;
  };

  return {
    t,
    i18n,
    changeLanguage,
    getCurrentLanguage,
  };
};
