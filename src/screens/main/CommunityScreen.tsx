import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Loading } from "../../components/common/Loading";
import SearchInput from "../../components/common/SearchInput";
import { CommunityTab, TopicList } from "../../components/community";
import {
  FilterModal,
  FilterOptions,
} from "../../components/community/FilterModal";
import { topicService } from "../../services/topicService";
import { colors } from "../../theme/colors";
import { MainTabNavigationProp } from "../../types/navigation";
import { ITopic } from "../../types/topic";
import { useAuth } from "../../contexts/AuthContext";
import { ICategory } from "../../types/category";
import { categoryService } from "../../services/category";
import { ETopicVisibility } from "../../enums/topic";

interface CommunityScreenProps {
  navigation: MainTabNavigationProp;
}

export default function CommunityScreen({ navigation }: CommunityScreenProps) {
  const { user } = useAuth();

  const [searchText, setSearchText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"ALL" | "MY">("ALL");
  const [topics, setTopics] = useState<ITopic[]>([]);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [debouncedSearchText, setDebouncedSearchText] = useState<string>("");

  const [currentFilters, setCurrentFilters] = useState<FilterOptions>({
    categoryIds: [],
  });

  const getCategories = useCallback(async () => {
    const { ok, body } = await categoryService.getTopicCategories();
    if (ok) {
      setCategories(body);
    }
  }, []);

  const getTopics = async () => {
    setLoading(true);
    const { ok, body } = await topicService.getTopics({
      title: debouncedSearchText || undefined,
      categoryIds:
        currentFilters.categoryIds.length > 0
          ? currentFilters.categoryIds
          : undefined,
    });
    if (ok && body) {
      setTopics(body.items);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getTopics();
    setRefreshing(false);
  };

  const handleFilterPress = () => {
    setShowFilterModal(true);
  };

  const handleFilterApply = (filters: FilterOptions) => {
    setCurrentFilters(filters);
    // Trong thực tế sẽ call API với filters
    console.log("Applied filters:", filters);
  };

  const handleFilterClose = () => {
    setShowFilterModal(false);
  };

  const handleTopicPress = (topic: ITopic) => {
    navigation.navigate("TopicDetail", { topicId: topic.id });
  };

  const handleCreateTopic = () => {
    navigation.navigate("CreateTopic");
  };

  const filteredTopics = useMemo(
    () =>
      topics.filter((topic) => {
        if (activeTab === "ALL")
          return (
            topic.visibility === ETopicVisibility.PUBLIC ||
            (topic.visibility === ETopicVisibility.UNIVERSITY_ONLY &&
              topic.university?.id === user?.university?.id)
          );
        return topic.author.id === user?.id;
      }),
    [topics, activeTab]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  useFocusEffect(
    useCallback(() => {
      getTopics();
    }, [debouncedSearchText, currentFilters])
  );
  useFocusEffect(
    useCallback(() => {
      getCategories();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <SearchInput
        value={searchText}
        onChangeText={setSearchText}
        loading={loading}
        suggestions={[]}
        onFilterPress={handleFilterPress}
        placeholder="Tìm kiếm bài viết..."
      />

      <CommunityTab activeTab={activeTab} onTabChange={setActiveTab} />

      {loading ? (
        <Loading />
      ) : (
        <TopicList
          topics={filteredTopics}
          onTopicPress={handleTopicPress}
          refreshing={refreshing}
          onRefresh={onRefresh}
          navigation={navigation}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={handleCreateTopic}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <FilterModal
        visible={showFilterModal}
        onClose={handleFilterClose}
        onApply={handleFilterApply}
        categories={categories}
        initialFilters={currentFilters}
      />
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
