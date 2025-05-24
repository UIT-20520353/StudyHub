import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Profile: undefined;
  Chat: undefined;
  Language: undefined;
};

export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;
