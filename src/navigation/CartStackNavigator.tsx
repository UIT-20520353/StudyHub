import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { MainTabParamList } from "../types/navigation";
import CartScreen from "../screens/main/CartScreen";
import CheckoutScreen from "../screens/main/market/CheckoutScreen";

const Stack = createStackNavigator<MainTabParamList>();

export default function CartStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
    </Stack.Navigator>
  );
}
