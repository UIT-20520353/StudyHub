import React from "react";
import { View, StyleSheet } from "react-native";
import CommonHeader from "../../components/common/CommonHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackNavigationProp } from "../../types/navigation";
import { useAuth } from "../../contexts/AuthContext";

interface HomeScreenProps {
  navigation: RootStackNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { signOut } = useAuth();

  const handleProfilePress = (): void => {
    signOut();
  };

  const handleChatPress = (): void => {
    // Xử lý khi người dùng nhấn vào icon chat
    console.log("Chat pressed");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <CommonHeader
          onProfilePress={handleProfilePress}
          onChatPress={handleChatPress}
        />
        {/* Nội dung màn hình của bạn ở đây */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default HomeScreen;
