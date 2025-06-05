export const colors = {
  // Primary colors
  primary: {
    light: "#B5E0F7", // Pastel blue light
    main: "#7EC8E3", // Pastel blue main
    dark: "#4A9CC7", // Pastel blue dark
  },

  // Secondary colors
  secondary: {
    light: "#E3F2FD", // Very light blue
    main: "#BBDEFB", // Light blue
    dark: "#90CAF9", // Medium blue
  },

  warning: {
    main: "#F59E0B",
    dark: "#D97706",
    background: "#FEF3C7",
    border: "#FDE68A",
  },

  // Background colors
  background: {
    default: "#FFFFFF",
    paper: "#F5F9FC",
    dark: "#E3F2FD",
    card: "#FAFBFC", // Subtle card background
    gradient: "#F8FCFF", // Light gradient background
    surface: "#F8FAFC",
    disabled: "#F3F4F6",
    light: "#F8F9FA", // Light background for unselected chips/tags
  },

  // Text colors
  text: {
    primary: "#2C3E50", // Dark blue-gray
    secondary: "#546E7A", // Medium blue-gray
    disabled: "#90A4AE", // Light blue-gray
    hint: "#78909C", // Hint text
    accent: "#37474F", // Accent text
    placeholder: "#9CA3AF",
    hint2: "#6B7280",
    disabled2: "#9CA3AF",
  },

  // Status colors
  status: {
    success: "#A5D6A7", // Pastel green
    warning: "#FFE082", // Pastel yellow
    error: "#EF9A9A", // Pastel red
    info: "#81D4FA", // Pastel light blue
  },

  // Border colors
  border: {
    light: "#E0E0E0",
    main: "#BDBDBD",
    dark: "#9E9E9E",
    subtle: "#F0F4F8", // Very subtle border
  },

  // Common colors
  common: {
    white: "#FFFFFF",
    black: "#000000",
    transparent: "transparent",
    gray: "#666666",
    gray1: "#F5F7FA", // Very light gray
    gray2: "#F8F8F8",
    gray3: "#202020",
    gray4: "#ECEFF1", // New subtle gray
    red: "#FF0000",
  },

  // Button colors
  button: {
    primary: {
      main: "#7EC8E3",
      disabled: "#cccccc",
    },
    secondary: "#E5E7EB",
  },

  // Card colors
  card: {
    background: "#FFFFFF",
    shadow: "rgba(58, 87, 149, 0.08)",
    border: "#F0F4F8",
    hover: "#FAFBFC",
  },

  // Avatar colors
  avatar: {
    background: "#E8F4F8",
    border: "#B5E0F7",
  },

  // Tag colors
  tag: {
    background: "#EBF8FF",
    text: "#1E40AF",
    border: "#BFDBFE",
  },

  // Interaction colors
  interaction: {
    like: "#10B981", // Green for like
    dislike: "#6B7280", // Gray for dislike
    comment: "#3B82F6", // Blue for comment
    view: "#9CA3AF", // Light gray for view count
  },

  input: {
    background: "#F9FAFB",
    border: "#E5E7EB",
    disabled: "#F3F4F6",
    disabledBorder: "#D1D5DB",
  },

  file: {
    image: "#10B981", // Green for images
    video: "#8B5CF6", // Purple for videos
    document: "#3B82F6", // Blue for documents
  },

  error: {
    main: "#EF4444",
    background: "#FEF2F2",
    border: "#FECACA",
    dark: "#DC2626",
  },
} as const;

// Type for the colors object
export type ColorTheme = typeof colors;

// Helper function to get color with opacity
export const withOpacity = (color: string, opacity: number): string => {
  // Convert hex to rgba
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
