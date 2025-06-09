import React from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { ITopic } from "../../types/topic";
import { TopicItem } from "./TopicItem";
import { colors } from "../../theme/colors";

interface TopicListProps {
  topics: ITopic[];
  onTopicPress: (topic: ITopic) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
  navigation?: any;
}

export const TopicList: React.FC<TopicListProps> = ({
  topics,
  onTopicPress,
  refreshing = false,
  onRefresh,
  navigation,
}) => {
  const renderItem = ({ item }: { item: ITopic }) => (
    <TopicItem
      navigation={navigation}
      topic={item}
      onTopicPress={() => onTopicPress(item)}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={topics}
        keyExtractor={(item) => `topic-${item.id}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary.main]}
              tintColor={colors.primary.main}
            />
          ) : undefined
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    gap: 16,
  },
});
