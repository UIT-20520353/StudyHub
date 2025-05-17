// src/components/book/BookCard.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Book } from "../../types";

interface BookCardProps {
  book: Book;
  onPress: () => void;
}

export default function BookCard({ book, onPress }: BookCardProps) {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "new":
        return "#4CAF50";
      case "like-new":
        return "#8BC34A";
      case "good":
        return "#FFC107";
      case "fair":
        return "#FF5722";
      default:
        return "#666";
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case "new":
        return "Mới";
      case "like-new":
        return "Như mới";
      case "good":
        return "Cũ";
      case "fair":
        return "Rất cũ";
      default:
        return "";
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={{ uri: book.images[0] || "https://via.placeholder.com/150" }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={styles.author}>{book.author}</Text>
        <Text style={styles.subject}>{book.subject}</Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>{book.price.toLocaleString("vi")}đ</Text>
          {book.originalPrice && (
            <Text style={styles.originalPrice}>
              {book.originalPrice.toLocaleString("vi")}đ
            </Text>
          )}
        </View>

        <View style={styles.statusContainer}>
          <Text
            style={[
              styles.condition,
              { color: getConditionColor(book.condition) },
            ]}
          >
            {getConditionText(book.condition)}
          </Text>
          <View style={styles.location}>
            <MaterialIcons name="location-on" size={12} color="#666" />
            <Text style={styles.locationText}>{book.university}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    margin: 8,
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  image: {
    width: 100,
    height: 140,
    resizeMode: "cover",
  },
  content: {
    flex: 1,
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  subject: {
    fontSize: 12,
    color: "#999",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF6B6B",
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  condition: {
    fontSize: 12,
    fontWeight: "bold",
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 2,
  },
});
