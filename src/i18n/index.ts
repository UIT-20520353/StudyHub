import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import enTranslation from "./locales/en.json";
import viTranslation from "./locales/vi.json";

export const LANGUAGES = {
  EN: "en",
  VI: "vi",
};

export const LANGUAGE_NAMES = {
  [LANGUAGES.EN]: "English",
  [LANGUAGES.VI]: "Tiếng Việt",
};

export const DEFAULT_LANGUAGE = LANGUAGES.VI;

export const NAMESPACES = {
  COMMON: "common",
  AUTH: "auth",
  HOME: "home",
  MARKETPLACE: "marketplace",
  COMMUNITY: "community",
  PROFILE: "profile",
  SETTINGS: "settings",
  TABS: "tabs",
};

export const LANGUAGE_STORAGE_KEY = "@studyhub/language";

const resources = {
  [LANGUAGES.EN]: enTranslation,
  [LANGUAGES.VI]: viTranslation,
};

const getStoredLanguage = async () => {
  try {
    const language = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    return language || DEFAULT_LANGUAGE;
  } catch (error) {
    console.error("Error reading language from storage:", error);
    return DEFAULT_LANGUAGE;
  }
};

const initI18n = async () => {
  const language = await getStoredLanguage();

  i18n.use(initReactI18next).init({
    lng: language,
    fallbackLng: DEFAULT_LANGUAGE,
    resources: resources,
    debug: __DEV__,
    defaultNS: NAMESPACES.COMMON,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

  return i18n;
};

export default initI18n;
