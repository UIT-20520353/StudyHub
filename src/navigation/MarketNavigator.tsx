import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { MainTabParamList } from "../types/navigation";
import MarketplaceScreen from "../screens/main/MarketplaceScreen";
import ProductDetailScreen from "../screens/main/market/ProductDetailScreen";
import CreateProductScreen from "../screens/main/market/CreateProductScreen";
import CheckoutScreen from "../screens/main/market/CheckoutScreen";

const Stack = createStackNavigator<MainTabParamList>();

export default function MarketNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProductList" component={MarketplaceScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="CreateProduct" component={CreateProductScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
    </Stack.Navigator>
  );
}
