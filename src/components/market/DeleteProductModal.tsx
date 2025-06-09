import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { IProduct } from "../../types/product";

interface DeleteProductModalProps {
  visible: boolean;
  product: IProduct | null;
  onCancel: () => void;
  onConfirm: (productId: number) => void;
}

const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
  visible,
  product,
  onCancel,
  onConfirm,
}) => {
  const handleConfirm = () => {
    if (!product) return;
    onConfirm(product.id);
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Xóa sản phẩm</Text>
          <Text style={styles.subtitle}>
            Bạn có chắc chắn muốn xóa sản phẩm này không?
          </Text>
          {product && (
            <Text style={styles.productTitle} numberOfLines={2}>
              "{product.title}"
            </Text>
          )}
          <Text style={styles.description}>
            Hành động này không thể hoàn tác.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: colors.background.default,
    borderRadius: 12,
    padding: 24,
    width: "85%",
    maxWidth: 350,
    shadowColor: colors.common.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontFamily: fonts.openSans.bold,
    fontSize: 18,
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fonts.openSans.regular,
    fontSize: 16,
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 22,
  },
  productTitle: {
    fontFamily: fonts.openSans.semiBold,
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: 12,
    fontStyle: "italic",
    lineHeight: 20,
  },
  description: {
    fontFamily: fonts.openSans.regular,
    fontSize: 12,
    color: colors.error.main,
    textAlign: "center",
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  cancelButton: {
    backgroundColor: colors.background.default,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  confirmButton: {
    backgroundColor: colors.error.main,
  },
  cancelButtonText: {
    fontFamily: fonts.openSans.semiBold,
    fontSize: 14,
    color: colors.text.secondary,
  },
  confirmButtonText: {
    fontFamily: fonts.openSans.semiBold,
    fontSize: 14,
    color: colors.common.white,
  },
});

export default DeleteProductModal;
