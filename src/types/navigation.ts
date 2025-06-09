import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { IUser } from "./user";

// Auth Stack Types
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
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
  TopicList: undefined;
  CreateTopic: undefined;
  TopicDetail: {
    topicId: number;
  };
  ProductDetail: {
    productId: number;
  };
  ProductList: undefined;
  Cart: undefined;
  Checkout: {
    productIds: number[];
    seller: IUser;
  };
  CreateProduct: undefined;
  Notification: undefined;
  HomeMain: undefined;
};

// Settings Stack Types
export type SettingsStackParamList = {
  Settings: undefined;
  Profile: undefined;
  Language: undefined;
  HistoryMenu: undefined;
  History: undefined;
  SellerOrders: undefined;
  ChangePassword: undefined;
};

// Root Stack Types
export type RootStackParamList = {
  Main: undefined;
  Auth: undefined;
  UserProfile: {
    userId: number;
  };
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
