import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Text,
  FlatList,
  Keyboard,
  ViewStyle,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchInputProps extends Omit<TextInputProps, "onChangeText"> {
  onSearch?: (text: string) => void;
  onChangeText?: (text: string) => void;
  onClear?: () => void;
  onFilterPress?: () => void;
  loading?: boolean;
  showFilter?: boolean;
  containerStyle?: ViewStyle;
  autoSearch?: boolean;
  searchDelay?: number;
  suggestions?: string[];
  onSuggestionPress?: (suggestion: string) => void;
  showSuggestions?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  onChangeText,
  onClear,
  onFilterPress,
  loading = false,
  showFilter = true,
  containerStyle,
  autoSearch = true,
  searchDelay = 500,
  suggestions = [],
  onSuggestionPress,
  showSuggestions = true,
  value,
  ...props
}) => {
  const [searchText, setSearchText] = useState(value || "");
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setSearchText(value || "");
  }, [value]);

  useEffect(() => {
    setShowSuggestionsList(
      showSuggestions &&
        isFocused &&
        suggestions.length > 0 &&
        searchText.length > 0
    );
  }, [isFocused, suggestions, searchText, showSuggestions]);

  const handleChangeText = (text: string) => {
    setSearchText(text);
    onChangeText?.(text);

    // Auto search with delay
    if (autoSearch && onSearch) {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }

      searchTimeout.current = setTimeout(() => {
        onSearch(text);
      }, searchDelay);
    }
  };

  const handleSearch = () => {
    Keyboard.dismiss();
    onSearch?.(searchText);
  };

  const handleClear = () => {
    setSearchText("");
    onChangeText?.("");
    onClear?.();
    onSearch?.("");
  };

  const handleFocus = () => {
    setIsFocused(true);
    Animated.spring(scaleAnimation, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.spring(scaleAnimation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleSuggestionPress = (suggestion: string) => {
    setSearchText(suggestion);
    onChangeText?.(suggestion);
    onSuggestionPress?.(suggestion);
    onSearch?.(suggestion);
    Keyboard.dismiss();
    setShowSuggestionsList(false);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.View
        style={[
          styles.searchContainer,
          isFocused && styles.searchContainerFocused,
          { transform: [{ scale: scaleAnimation }] },
        ]}
      >
        <Ionicons
          name="search"
          size={20}
          color={isFocused ? "#2563EB" : "#94A3B8"}
          style={styles.searchIcon}
        />

        <TextInput
          style={styles.input}
          placeholder="Tìm kiếm sách, tài liệu, bài viết..."
          placeholderTextColor="#94A3B8"
          value={searchText}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          {...props}
        />

        {loading && (
          <ActivityIndicator
            size="small"
            color="#2563EB"
            style={styles.loadingIcon}
          />
        )}

        {!loading && searchText.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            style={styles.clearButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close-circle" size={20} color="#94A3B8" />
          </TouchableOpacity>
        )}

        {showFilter && (
          <TouchableOpacity
            onPress={onFilterPress}
            style={styles.filterButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="options-outline"
              size={20}
              color={isFocused ? "#2563EB" : "#94A3B8"}
            />
          </TouchableOpacity>
        )}
      </Animated.View>

      {showSuggestionsList && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => `suggestion-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSuggestionPress(item)}
              >
                <Ionicons
                  name="search-outline"
                  size={16}
                  color="#94A3B8"
                  style={styles.suggestionIcon}
                />
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
            style={styles.suggestionsList}
          />
        </View>
      )}
    </View>
  );
};

interface SearchTag {
  id: string;
  label: string;
  value: string;
}

interface AdvancedSearchInputProps extends SearchInputProps {
  tags?: SearchTag[];
  onTagRemove?: (tagId: string) => void;
}

export const AdvancedSearchInput: React.FC<AdvancedSearchInputProps> = ({
  tags = [],
  onTagRemove,
  ...props
}) => {
  return (
    <View>
      <SearchInput {...props} />

      {tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {tags.map((tag) => (
            <View key={tag.id} style={styles.tag}>
              <Text style={styles.tagText}>{tag.label}</Text>
              <TouchableOpacity
                onPress={() => onTagRemove?.(tag.id)}
                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
              >
                <Ionicons name="close" size={16} color="#2563EB" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 16,
    height: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  searchContainerFocused: {
    borderColor: "#2563EB",
    borderWidth: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1E293B",
  },
  loadingIcon: {
    marginLeft: 8,
  },
  clearButton: {
    marginLeft: 8,
  },
  filterButton: {
    marginLeft: 12,
    padding: 4,
    borderLeftWidth: 1,
    borderLeftColor: "#E2E8F0",
    paddingLeft: 12,
  },
  suggestionsContainer: {
    position: "absolute",
    top: 58,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 999,
    maxHeight: 200,
  },
  suggestionsList: {
    borderRadius: 12,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  suggestionIcon: {
    marginRight: 12,
  },
  suggestionText: {
    fontSize: 16,
    color: "#1E293B",
    flex: 1,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    marginHorizontal: 4,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBF2FF",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  tagText: {
    fontSize: 14,
    color: "#2563EB",
    marginRight: 6,
  },
});

export default SearchInput;
