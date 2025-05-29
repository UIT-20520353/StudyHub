import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Loading } from "../../components/common/Loading";
import SearchInput from "../../components/common/SearchInput";
import { TopicList } from "../../components/community";
import { topicService } from "../../services/topicService";
import { colors } from "../../theme/colors";
import { ITopic } from "../../types/topic";

export default function CommunityScreen() {
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
    const { ok, body } = await topicService.getTopics();
    if (ok && body) {
      setTopics(body.items);
    }
  };

  const handleSearch = async (text: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    // Update search results
  };

  const handleFilterPress = () => {
    // Open filter modal
  };

  useEffect(() => {
    getTopics();
  }, []);

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

      <TopicList topics={topics} />

      <Loading />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.gradient,
    paddingHorizontal: 16,
  },
});
