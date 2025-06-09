import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { colors } from "../../theme/colors";
import { IOrder } from "../../types/order";
import { NAMESPACES } from "../../i18n";
import { useTranslation } from "../../hooks";
import { fonts } from "../../theme/fonts";

interface CancelOrderModalProps {
  visible: boolean;
  order: IOrder | null;
  onCancel: () => void;
  onConfirm: (order: IOrder, reason: string) => void;
}

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  visible,
  order,
  onCancel,
  onConfirm,
}) => {
  const { t: tOrder } = useTranslation(NAMESPACES.MARKETPLACE);
  const { t: tButton } = useTranslation(NAMESPACES.BUTTON);
  const [reason, setReason] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError(tOrder("cart.cancel_reason"));
      return;
    }

    if (!order) return;

    onConfirm(order, reason.trim());
    setReason("");
  };

  const handleCancel = () => {
    setReason("");
    onCancel();
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Hủy đơn hàng</Text>
          <Text style={styles.subtitle}>Đơn hàng: #{order?.orderCode}</Text>

          <Text style={styles.label}>Lý do hủy đơn *</Text>
          <TextInput
            style={[
              styles.textInput,
              {
                marginBottom: error ? 4 : 20,
              },
            ]}
            placeholder="Nhập lý do hủy đơn..."
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          {error && <Text style={styles.error}>{error}</Text>}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>
                {tButton("cancel_order")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>
                {tButton("confirm_cancel_order")}
              </Text>
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
    backgroundColor: colors.common.white,
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxWidth: 400,
    shadowColor: colors.common.gray3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontFamily: fonts.openSans.bold,
    fontSize: 18,
    color: colors.common.gray3,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fonts.openSans.regular,
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontFamily: fonts.openSans.semiBold,
    fontSize: 14,
    color: colors.common.gray3,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border.main,
    borderRadius: 8,
    padding: 12,
    fontFamily: fonts.openSans.regular,
    fontSize: 14,
    color: colors.common.gray3,
    minHeight: 80,
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
  },
  cancelButton: {
    backgroundColor: colors.common.white,
    borderWidth: 1,
    borderColor: colors.border.main,
  },
  confirmButton: {
    backgroundColor: colors.common.red,
  },
  cancelButtonText: {
    fontFamily: fonts.openSans.semiBold,
    fontSize: 14,
    color: colors.common.gray3,
  },
  confirmButtonText: {
    fontFamily: fonts.openSans.semiBold,
    fontSize: 14,
    color: colors.common.white,
  },
  error: {
    fontFamily: fonts.openSans.regular,
    fontSize: 12,
    color: colors.error.main,
    marginBottom: 20,
  },
});

export default CancelOrderModal;
