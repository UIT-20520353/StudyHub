import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { IComment, ICommentCreate } from "../../types/comment";

interface CommentInputProps {
  onSubmit: (comment: ICommentCreate) => void;
  loading?: boolean;
  placeholder?: string;
}

export const CommentInput: React.FC<CommentInputProps> = ({
  onSubmit,
  loading = false,
  placeholder = "Viết bình luận...",
}) => {
  const [content, setContent] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleSubmit = () => {
    if (content.trim().length === 0) {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung bình luận");
      return;
    }

    if (content.trim().length > 1000) {
      Alert.alert("Lỗi", "Bình luận không được vượt quá 1000 ký tự");
      return;
    }

    onSubmit({
      content: content.trim(),
    });

    // Reset form after submit
    setContent("");
  };

  const hasContent = content.trim().length > 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      style={[
        styles.container,
        Platform.OS === "android" &&
          keyboardHeight > 0 && { paddingBottom: keyboardHeight },
      ]}
    >
      {/* Input Container */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor={colors.text.placeholder}
          value={content}
          onChangeText={setContent}
          multiline
          maxLength={1000}
          editable={!loading}
          textAlignVertical="top"
          autoFocus={false}
          scrollEnabled={false}
          blurOnSubmit={false}
        />

        <View style={styles.inputFooter}>
          <Text style={styles.characterCount}>{content.length}/1000</Text>

          <TouchableOpacity
            style={[
              styles.submitButton,
              (!hasContent || loading) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!hasContent || loading}
          >
            {loading ? (
              <View style={styles.loadingIndicator} />
            ) : (
              <Ionicons
                name="send"
                size={16}
                color={hasContent ? colors.common.white : colors.text.disabled}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.default,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },

  inputContainer: {
    padding: 16,
  },
  textInput: {
    backgroundColor: colors.background.paper,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: fonts.openSans.regular,
    color: colors.text.primary,
    minHeight: 44,
    maxHeight: 120,
    lineHeight: 20,
  },
  inputFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  characterCount: {
    fontSize: 12,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
  },
  submitButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary.main,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonDisabled: {
    backgroundColor: colors.background.surface,
  },
  loadingIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.common.white,
    borderTopColor: "transparent",
  },
});
