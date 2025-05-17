// src/screens/main/MarketplaceScreen.tsx
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import BookCard from "../../components/book/BookCard";
import { Book } from "../../types";
import { NAMESPACES } from "../../i18n";
import LanguageSelector from "../../components/common/LanguageSelector";

export default function MarketplaceScreen({ navigation }: any) {
  const { t } = useTranslation(NAMESPACES.COMMON);

  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);

  const handleAddBook = () => {
    navigation.navigate("SellBook");
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm sách..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.filterButton}>
          <MaterialIcons name="filter-list" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Book List */}
      <ScrollView style={styles.content}>
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onPress={() =>
              navigation.navigate("BookDetail", { bookId: book.id })
            }
          />
        ))}
      </ScrollView>

      {/* Add Book Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddBook}>
        <MaterialIcons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      <LanguageSelector />
      <Text>{t("loading")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  searchContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  filterButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    backgroundColor: "#FF6B6B",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
