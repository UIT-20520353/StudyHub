import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "../../hooks";
import { LANGUAGES, NAMESPACES } from "../../i18n";
import { colors, withOpacity } from "../../theme/colors";
import { fonts } from "../../theme/fonts";

interface LanguageSelectorProps {
  style?: any;
  isDarkBackground?: boolean;
}

interface LanguageOption {
  code: string;
  name: string;
  flag: any;
}

const languageOptions: LanguageOption[] = [
  {
    code: LANGUAGES.VI,
    name: "Tiếng Việt",
    flag: require("../../assets/images/flag/vietnam.png"),
  },
  {
    code: LANGUAGES.EN,
    name: "English",
    flag: require("../../assets/images/flag/united-states.png"),
  },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  style,
  isDarkBackground = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { changeLanguage, getCurrentLanguage } = useTranslation(
    NAMESPACES.SETTINGS
  );
  const currentLanguage = getCurrentLanguage();

  const currentLanguageOption =
    languageOptions.find((option) => option.code === currentLanguage) ||
    languageOptions[0];

  const handleLanguageChange = (languageCode: string) => {
    changeLanguage(languageCode);
    setModalVisible(false);
  };

  const textColor = isDarkBackground
    ? colors.common.white
    : colors.text.primary;
  const iconColor = isDarkBackground
    ? colors.common.white
    : colors.text.secondary;

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.selector, isDarkBackground && styles.selectorDark]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Image source={currentLanguageOption.flag} style={styles.flag} />
        <Text style={[styles.languageCode, { color: textColor }]}>
          {currentLanguageOption.code.toUpperCase()}
        </Text>
        <Ionicons name="chevron-down" size={16} color={iconColor} />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Chọn ngôn ngữ / Select Language
              </Text>
            </View>

            {languageOptions.map((option) => (
              <TouchableOpacity
                key={option.code}
                style={[
                  styles.languageOption,
                  currentLanguage === option.code &&
                    styles.activeLanguageOption,
                ]}
                onPress={() => handleLanguageChange(option.code)}
              >
                <Image source={option.flag} style={styles.optionFlag} />
                <Text style={styles.optionText}>{option.name}</Text>
                {currentLanguage === option.code && (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={colors.primary.main}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: withOpacity(colors.common.white, 0.2),
    borderWidth: 1,
    borderColor: withOpacity(colors.common.white, 0.3),
  },
  selectorDark: {
    backgroundColor: withOpacity(colors.common.white, 0.1),
    borderColor: withOpacity(colors.common.white, 0.2),
  },
  flag: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  languageCode: {
    fontSize: 12,
    fontFamily: fonts.openSans.semiBold,
    marginRight: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: colors.common.white,
    borderRadius: 16,
    padding: 20,
    margin: 20,
    maxWidth: 300,
    width: "80%",
    shadowColor: colors.common.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: fonts.openSans.semiBold,
    color: colors.text.primary,
    textAlign: "center",
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 4,
  },
  activeLanguageOption: {
    backgroundColor: colors.background.paper,
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  optionFlag: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.openSans.medium,
    color: colors.text.primary,
  },
});
