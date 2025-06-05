import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Loading } from "../../components/common/Loading";
import SearchInput from "../../components/common/SearchInput";
import { TopicList } from "../../components/community";
import { topicService } from "../../services/topicService";
import { colors } from "../../theme/colors";
import { MainTabNavigationProp } from "../../types/navigation";
import { ITopic } from "../../types/topic";

interface CommunityScreenProps {
  navigation: MainTabNavigationProp;
}

export default function CommunityScreen({ navigation }: CommunityScreenProps) {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([
    "Giải tích 1",
    "Giáo trình Vật lý đại cương",
    "Sách IELTS",
    "Kinh tế vĩ mô",
  ]);

  const [topics, setTopics] = useState<ITopic[]>([]);

  const getTopics = async () => {
    setLoading(true);
    const { ok, body } = await topicService.getTopics();
    if (ok && body) {
      setTopics(body.items);
    }
    setLoading(false);
  };

  const handleSearch = async (text: string) => {
    // setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // setLoading(false);
    // Update search results
  };

  const handleFilterPress = () => {
    // Open filter modal
  };

  const handleTopicPress = (topic: ITopic) => {
    navigation.navigate("TopicDetail", { topicId: topic.id });
  };

  const handleCreateTopic = () => {
    navigation.navigate("CreateTopic");
  };

  useFocusEffect(
    useCallback(() => {
      getTopics();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <SearchInput
        value={searchText}
        onChangeText={setSearchText}
        onSearch={handleSearch}
        loading={loading}
        suggestions={suggestions}
        onFilterPress={handleFilterPress}
      />

      {loading ? (
        <Loading />
      ) : (
        <TopicList topics={topics} onTopicPress={handleTopicPress} />
      )}

      {/* Floating Action Button for Create Topic */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleCreateTopic}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.gradient,
    paddingHorizontal: 16,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary.main || "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  fabIcon: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
