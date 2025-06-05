import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import CommunityScreen from "../screens/main/CommunityScreen";
import TopicDetailScreen from "../screens/main/community/TopicDetailScreen";
import { MainTabParamList } from "../types/navigation";
import CreateTopicScreen from "../screens/main/community/CreateTopicScreen";

const Stack = createStackNavigator<MainTabParamList>();

export default function CommunityStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TopicList" component={CommunityScreen} />
      <Stack.Screen name="TopicDetail" component={TopicDetailScreen} />
      <Stack.Screen name="CreateTopic" component={CreateTopicScreen} />
    </Stack.Navigator>
  );
}
