import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { StackNavigationHeader } from "../../components/common/StackNavigationHeader";
import { Loading } from "../../components/common/Loading";
import { useTranslation } from "../../hooks";
import { NAMESPACES } from "../../i18n";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { IUser } from "../../types/user";
import { userService } from "../../services/user";

interface UserProfileScreenProps {
  navigation: any;
  route: {
    params: {
      userId: number;
    };
  };
}

const UserProfileScreen: React.FC<UserProfileScreenProps> = ({
  navigation,
  route,
}) => {
  const { userId } = route.params;
  const { t } = useTranslation(NAMESPACES.PROFILE);
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

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

  const getUserProfile = async () => {
    setLoading(true);
    const { ok, body } = await userService.getUserDetail(userId);
    if (ok) {
      setUser(body);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      getUserProfile();
    }, [userId])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StackNavigationHeader
          title={t("user_profile_title")}
          onBackPress={() => navigation.goBack()}
        />
        <Loading />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StackNavigationHeader
          title={t("user_profile_title")}
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{t("user_not_found")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StackNavigationHeader
        title={user.fullName}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                user.avatarUrl
                  ? { uri: user.avatarUrl }
                  : require("../../assets/images/default-avatar.jpg")
              }
              style={styles.avatar}
            />
            <View style={styles.avatarBadge}>
              {user.isVerified && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={colors.status.success}
                />
              )}
            </View>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user.fullName}</Text>
            <Text style={styles.email}>{user.email}</Text>
            {user.bio && (
              <Text style={styles.bio} numberOfLines={3}>
                {user.bio}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("personal_info")}</Text>
          <View style={styles.infoCard}>
            <InfoItem
              icon="person-outline"
              label={t("full_name")}
              value={user.fullName}
            />
            <InfoItem
              icon="mail-outline"
              label={t("email")}
              value={user.email}
            />
            <InfoItem
              icon="call-outline"
              label={t("phone")}
              value={user.phone || t("not_public")}
            />
            <InfoItem
              icon="card-outline"
              label={t("student_id")}
              value={user.studentId || t("not_public")}
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
              value={user.university?.name || t("not_public")}
            />
            <InfoItem
              icon="book-outline"
              label={t("major")}
              value={user.major || t("not_public")}
            />
            <InfoItem
              icon="calendar-outline"
              label={t("year")}
              value={
                user.year
                  ? t("year_format", { year: user.year })
                  : t("not_public")
              }
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
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
    textAlign: "center",
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
  actionsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.default,
    borderWidth: 1,
    borderColor: colors.primary.main,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
    shadowColor: colors.card.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: fonts.openSans.semiBold,
    color: colors.primary.main,
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
  bottomSpacing: {
    height: 24,
  },
});

export default UserProfileScreen;
