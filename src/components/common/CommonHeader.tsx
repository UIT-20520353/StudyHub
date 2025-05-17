import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface CommonHeaderProps {
  onProfilePress?: () => void;
  onChatPress?: () => void;
}

const CommonHeader: React.FC<CommonHeaderProps> = ({
  onProfilePress,
  onChatPress,
}) => {
  const navigation = useNavigation();

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
      <TouchableOpacity onPress={handleChatPress} style={styles.iconContainer}>
        <Ionicons name="chatbubble-outline" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.spacer} />

      <TouchableOpacity
        onPress={handleProfilePress}
        style={styles.iconContainer}
      >
        <Ionicons name="person-outline" size={24} color="#333" />
      </TouchableOpacity>
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
    padding: 8,
  },
  spacer: {
    flex: 1,
  },
});

export default CommonHeader;
