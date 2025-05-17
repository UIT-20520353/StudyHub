import { useTheme as usePaperTheme } from "react-native-paper";

export const useTheme = () => {
  const theme = usePaperTheme();
  return theme;
};
