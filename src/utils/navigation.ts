import { CommonActions } from "@react-navigation/native";

export const navigateToUserProfile = (navigation: any, userId: number) => {
  navigation.dispatch(CommonActions.navigate("UserProfile", { userId }));
};

// Alternative method for nested navigators
export const navigateToUserProfileFromTab = (
  navigation: any,
  userId: number
) => {
  navigation?.getParent()?.navigate("UserProfile", { userId });
};
