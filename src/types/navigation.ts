import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

// Auth Stack Types
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  OTPVerification: {
    email: string;
    userId: number;
  };
};

// Main Tab Types
export type MainTabParamList = {
  Home: undefined;
  Marketplace: undefined;
  Community: undefined;
  Settings: undefined;
};

// Settings Stack Types
export type SettingsStackParamList = {
  Settings: undefined;
  Profile: undefined;
  Language: undefined;
};

// Root Stack Types
export type RootStackParamList = {
  Main: undefined;
  Auth: undefined;
};

// Navigation Props
export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;
export type AuthStackNavigationProp = StackNavigationProp<AuthStackParamList>;
export type MainTabNavigationProp = StackNavigationProp<MainTabParamList>;
export type SettingsStackNavigationProp =
  StackNavigationProp<SettingsStackParamList>;

// Route Props
export type RootStackRouteProp<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>;
export type AuthStackRouteProp<T extends keyof AuthStackParamList> = RouteProp<
  AuthStackParamList,
  T
>;
export type MainTabRouteProp<T extends keyof MainTabParamList> = RouteProp<
  MainTabParamList,
  T
>;
export type SettingsStackRouteProp<T extends keyof SettingsStackParamList> =
  RouteProp<SettingsStackParamList, T>;
