import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ITopic } from "../../types/topic";
import { TopicItem } from "./TopicItem";

interface TopicListProps {
  topics: ITopic[];
  onTopicPress: (topic: ITopic) => void;
}

export const TopicList: React.FC<TopicListProps> = ({
  topics,
  onTopicPress,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {topics.map((topic) => (
          <TopicItem
            key={`topic-${topic.id}`}
            topic={topic}
            onTopicPress={() => onTopicPress(topic)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    gap: 16,
  },
});
