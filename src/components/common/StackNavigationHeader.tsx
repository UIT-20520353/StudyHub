import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";
import { ArrowRightIcon } from "../icons";
import { Button } from "./Button";

interface StackNavigationHeaderProps {
  title: string;
  onBackPress: () => void;
}

export const StackNavigationHeader: React.FC<StackNavigationHeaderProps> = ({
  title,
  onBackPress,
}) => (
  <View style={styles.header}>
    <Button onPress={onBackPress} style={styles.backButton}>
      <View style={styles.arrowContainer}>
        <ArrowRightIcon size={28} color={colors.common.gray} />
      </View>
    </Button>
    <Text style={styles.headerTitle}>{title}</Text>
    <View style={styles.backButton} />
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerTitle: {
    fontFamily: "OpenSans_600SemiBold",
    fontSize: 16,
    color: colors.common.gray,
  },
  backButton: {
    width: "auto",
    height: "auto",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.common.transparent,
  },
  arrowContainer: {
    transform: [{ rotate: "180deg" }],
  },
});
