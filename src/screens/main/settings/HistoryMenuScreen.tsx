import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../../components/common/Button";
import { StackNavigationHeader } from "../../../components/common/StackNavigationHeader";
import { ArrowRightIcon, BuyIcon, SellIcon } from "../../../components/icons";
import { colors } from "../../../theme/colors";
import { SettingsStackNavigationProp } from "../../../types/navigation";

interface HistoryMenuScreenProps {
  navigation: SettingsStackNavigationProp;
}

const HistoryMenuScreen: React.FC<HistoryMenuScreenProps> = ({
  navigation,
}) => {
  const handleBuyHistoryPress = (): void => {
    navigation.navigate("History");
  };

  const handleSellHistoryPress = (): void => {
    navigation.navigate("SellerOrders");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StackNavigationHeader
          title="Lịch sử"
          onBackPress={() => navigation.goBack()}
        />

        <View style={styles.content}>
          <View style={styles.buttonContainer}>
            <Button onPress={handleBuyHistoryPress} style={styles.button}>
              <View style={styles.buttonLeftContent}>
                <BuyIcon size={28} />
                <Text style={styles.buttonText}>Đơn hàng mua</Text>
              </View>
              <ArrowRightIcon size={28} />
            </Button>

            <Button onPress={handleSellHistoryPress} style={styles.button}>
              <View style={styles.buttonLeftContent}>
                <SellIcon size={28} />
                <Text style={styles.buttonText}>Đơn hàng bán</Text>
              </View>
              <ArrowRightIcon size={28} />
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.common.gray2,
  },
  container: {
    flex: 1,
    backgroundColor: colors.common.gray2,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  buttonContainer: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: colors.common.white,
    shadowColor: colors.common.gray3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    gap: 6,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    backgroundColor: colors.common.transparent,
    height: 40,
  },
  buttonLeftContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  buttonText: {
    fontFamily: "OpenSans_400Regular",
    fontSize: 14,
    color: colors.common.gray3,
  },
});

export default HistoryMenuScreen;
