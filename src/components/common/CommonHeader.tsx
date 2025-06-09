import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";

interface CommonHeaderProps {
  onProfilePress?: () => void;
  onChatPress?: () => void;
  onNotificationPress?: () => void;
}

const CommonHeader: React.FC<CommonHeaderProps> = ({
  onProfilePress,
  onChatPress,
  onNotificationPress,
}) => {
  const navigation = useNavigation();
  const { user } = useAuth();

  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else {
      navigation.navigate("Profile" as never);
    }
  };

  const handleChatPress = () => {
    if (onChatPress) {
      onChatPress();
    } else {
      navigation.navigate("Chat" as never);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={
            user?.avatarUrl
              ? { uri: user.avatarUrl }
              : require("../../assets/images/default-avatar.jpg")
          }
          style={styles.avatar}
        />
      </View>

      <View style={styles.spacer} />

      <View style={styles.iconContainer}>
        <TouchableOpacity
          onPress={onNotificationPress}
          style={styles.iconContainer}
        >
          <Ionicons name="notifications-outline" size={26} color="#333" />
        </TouchableOpacity>
      </View>

      {/* <TouchableOpacity
        onPress={handleProfilePress}
        style={styles.iconContainer}
      >
        <Ionicons name="person-outline" size={24} color="#333" />
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  spacer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
});

export default CommonHeader;
