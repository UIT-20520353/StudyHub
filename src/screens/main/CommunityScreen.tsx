import React, { useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput, {
  AdvancedSearchInput,
} from "../../components/common/SearchInput";

export default function CommunityScreen() {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([
    "Giải tích 1",
    "Giáo trình Vật lý đại cương",
    "Sách IELTS",
    "Kinh tế vĩ mô",
  ]);
  const [filterTags, setFilterTags] = useState([
    { id: "1", label: "Toán học", value: "math" },
    { id: "2", label: "Giá < 100k", value: "price_low" },
  ]);

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

  const handleTagRemove = (tagId: string) => {
    setFilterTags((prev) => prev.filter((tag) => tag.id !== tagId));
  };

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

      <AdvancedSearchInput
        value={searchText}
        onChangeText={setSearchText}
        onSearch={handleSearch}
        loading={loading}
        suggestions={suggestions}
        onFilterPress={handleFilterPress}
        tags={filterTags}
        onTagRemove={handleTagRemove}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  searchInput: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  topicCategoryItem: {
    width: "auto",
    borderRadius: 10,
    alignItems: "center",
  },
});
