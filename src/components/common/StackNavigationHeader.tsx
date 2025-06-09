import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";

interface StackNavigationHeaderProps {
  title: string;
  onBackPress: () => void;
}

export const StackNavigationHeader: React.FC<StackNavigationHeaderProps> = ({
  title,
  onBackPress,
}) => (
  <View style={styles.header}>
    <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
      <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
    </TouchableOpacity>

    <Text style={styles.headerTitle}>{title}</Text>

    <View style={styles.headerRight}></View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background.default,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.openSans.semiBold,
    color: colors.text.primary,
  },
  headerRight: {
    width: 40,
    alignItems: "flex-end",
  },
});
