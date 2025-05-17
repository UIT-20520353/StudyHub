import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");

export default function SplashScreen() {
  return (
    <LinearGradient
      colors={["#e0c3fc", "#8ec5fc", "#f9f9f9"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.card}>
        <LottieView
          source={require("../assets/lottie/splash-screen.json")}
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: width * 0.8,
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  lottie: {
    width: 350,
    height: 350,
    marginTop: 8,
  },
});
