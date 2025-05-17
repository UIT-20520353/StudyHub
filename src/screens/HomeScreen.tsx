import React from "react";
import { View, StyleSheet } from "react-native";
import CommonHeader from "../components/common/CommonHeader";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <CommonHeader
          onProfilePress={() => {
            // Xử lý khi người dùng nhấn vào icon profile
            console.log("Profile pressed");
          }}
          onChatPress={() => {
            // Xử lý khi người dùng nhấn vào icon chat
            console.log("Chat pressed");
          }}
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
