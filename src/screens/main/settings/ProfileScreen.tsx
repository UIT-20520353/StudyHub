import { StackNavigationProp } from "@react-navigation/stack";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../contexts/AuthContext";
import { StackNavigationHeader } from "../../../components/common/StackNavigationHeader";
import { useTranslation } from "../../../hooks";
import { NAMESPACES } from "../../../i18n";
import { colors } from "../../../theme/colors";
import { RootStackParamList } from "../../../types/navigation";

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Profile"
>;

interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACES.SETTINGS);
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StackNavigationHeader
        title={t("profile")}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <Image
            source={
              user?.avatarUrl
                ? { uri: user.avatarUrl }
                : require("../../../assets/images/default-avatar.jpg")
            }
            style={styles.avatar}
          />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{user?.fullName}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>
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
  avatarContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 999,
  },
  nameContainer: {
    alignItems: "center",
  },
  name: {
    fontSize: 20,
    fontFamily: "OpenSans_700Bold",
    color: colors.common.black,
  },
  email: {
    fontSize: 13,
    fontFamily: "OpenSans_400Regular",
    color: colors.common.gray,
  },
});

export default ProfileScreen;
