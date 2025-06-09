import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationHeader } from "../../../components/common/StackNavigationHeader";
import { useAuth } from "../../../contexts/AuthContext";
import { useQuickToast, useTranslation } from "../../../hooks";
import { NAMESPACES } from "../../../i18n";
import { colors } from "../../../theme/colors";
import { fonts } from "../../../theme/fonts";
import { useFocusEffect } from "@react-navigation/native";
import { userService } from "../../../services/user";

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACES.PROFILE);
  const { user, getProfile } = useAuth();
  const toast = useQuickToast();
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChangeAvatar = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          t("avatar.permission_library"),
          t("avatar.permission_library_message")
        );
        return;
      }

      Alert.alert(t("change_avatar"), "Chọn cách thay đổi ảnh đại diện", [
        {
          text: t("avatar.choose_from_library"),
          onPress: () => handlePickFromLibrary(),
        },
        {
          text: t("avatar.cancel"),
          style: "cancel",
        },
      ]);
    } catch (error) {
      console.error("Error changing avatar:", error);
      Alert.alert(t("avatar.error_title"), t("avatar.error_change"));
    }
  };

  const handlePickFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        await handleImageSelected(result.assets[0]);
      }
    } catch (error) {
      toast.error(t("avatar.error_pick_library"));
    }
  };

  const handleImageSelected = async (asset: ImagePicker.ImagePickerAsset) => {
    if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
      toast.error(t("avatar.file_too_large"));
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("avatar", {
      uri: asset.uri,
      type: "image/jpeg",
      name: `avatar_${Date.now()}.jpg`,
    } as any);

    const { ok } = await userService.updateAvatar(formData);

    if (ok) {
      toast.success(t("avatar.upload_success"));
      getProfile();
    } else {
      toast.error(t("avatar.error_upload"));
    }

    setIsUploading(false);
  };

  useFocusEffect(
    useCallback(() => {
      getProfile();
    }, [])
  );

  const InfoItem = ({
    icon,
    label,
    value,
  }: {
    icon: string;
    label: string;
    value: string;
  }) => (
    <View style={styles.infoItem}>
      <View style={styles.infoItemLeft}>
        <Ionicons name={icon as any} size={20} color={colors.text.secondary} />
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  const ActionButton = ({
    icon,
    label,
    onPress,
    color = colors.primary.main,
  }: {
    icon: string;
    label: string;
    onPress: () => void;
    color?: string;
  }) => (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <Ionicons name={icon as any} size={20} color={color} />
      <Text style={[styles.actionButtonText, { color }]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StackNavigationHeader
        title={t("user_profile_title")}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                selectedAvatar
                  ? { uri: selectedAvatar }
                  : user?.avatarUrl
                  ? { uri: user.avatarUrl }
                  : require("../../../assets/images/default-avatar.jpg")
              }
              style={[styles.avatar, isUploading && styles.avatarUploading]}
            />

            {isUploading && (
              <View style={styles.uploadingOverlay}>
                <View style={styles.uploadingIndicator}>
                  <Text style={styles.uploadingText}>
                    {t("avatar.uploading")}
                  </Text>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.changeAvatarButton,
                isUploading && styles.changeAvatarButtonDisabled,
              ]}
              onPress={handleChangeAvatar}
              accessibilityLabel={t("change_avatar")}
              accessibilityHint="Tap to change your profile picture"
              disabled={isUploading}
            >
              <Ionicons
                name={isUploading ? "hourglass" : "camera"}
                size={16}
                color={colors.common.white}
              />
            </TouchableOpacity>
            <View style={styles.avatarBadge}>
              {user?.isVerified && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={colors.status.success}
                />
              )}
            </View>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user?.fullName}</Text>
            <Text style={styles.email}>{user?.email}</Text>
            {user?.bio && (
              <Text style={styles.bio} numberOfLines={3}>
                {user.bio}
              </Text>
            )}
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("personal_info")}</Text>
          <View style={styles.infoCard}>
            <InfoItem
              icon="person-outline"
              label={t("full_name")}
              value={user?.fullName || ""}
            />
            <InfoItem
              icon="mail-outline"
              label={t("email")}
              value={user?.email || ""}
            />
            <InfoItem
              icon="call-outline"
              label={t("phone")}
              value={user?.phone || t("not_updated")}
            />
            <InfoItem
              icon="card-outline"
              label={t("student_id")}
              value={user?.studentId || t("not_updated")}
            />
          </View>
        </View>

        {/* Academic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("academic_info")}</Text>
          <View style={styles.infoCard}>
            <InfoItem
              icon="school-outline"
              label={t("university")}
              value={user?.university?.name || ""}
            />
            <InfoItem
              icon="book-outline"
              label={t("major")}
              value={user?.major || t("not_updated")}
            />
            <InfoItem
              icon="calendar-outline"
              label={t("year")}
              value={
                user?.year
                  ? t("year_format", { year: user.year })
                  : t("not_updated")
              }
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("actions")}</Text>
          <View style={styles.actionCard}>
            <ActionButton
              icon="create-outline"
              label={t("edit_info")}
              onPress={() => {
                /* TODO: Navigate to edit profile */
              }}
            />
            <ActionButton
              icon="key-outline"
              label={t("change_password")}
              onPress={() => navigation.navigate("ChangePassword")}
            />
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: colors.background.default,
    padding: 24,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.background.default,
    shadowColor: colors.card.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: colors.background.default,
    borderRadius: 12,
  },
  changeAvatarButton: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: colors.primary.main,
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.card.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  changeAvatarButtonDisabled: {
    opacity: 0.6,
  },
  avatarUploading: {
    opacity: 0.7,
  },
  uploadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 60,
  },
  uploadingIndicator: {
    backgroundColor: colors.background.default,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: colors.card.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  uploadingText: {
    fontSize: 12,
    fontFamily: fonts.openSans.medium,
    color: colors.text.primary,
  },
  profileInfo: {
    alignItems: "center",
    gap: 4,
  },
  name: {
    fontSize: 24,
    fontFamily: fonts.openSans.bold,
    color: colors.text.primary,
    textAlign: "center",
  },
  email: {
    fontSize: 14,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
    textAlign: "center",
  },
  bio: {
    fontSize: 13,
    fontFamily: fonts.openSans.regular,
    color: colors.text.hint,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background.default,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: colors.card.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: fonts.openSans.bold,
    color: colors.primary.main,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.openSans.semiBold,
    color: colors.text.primary,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: colors.background.default,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.card.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  infoItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: fonts.openSans.medium,
    color: colors.text.secondary,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: fonts.openSans.regular,
    color: colors.text.primary,
    textAlign: "right",
    flex: 1,
  },
  actionCard: {
    backgroundColor: colors.background.default,
    borderRadius: 12,
    padding: 8,
    shadowColor: colors.card.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: fonts.openSans.medium,
    flex: 1,
  },
  bottomSpacing: {
    height: 24,
  },
});

export default ProfileScreen;
