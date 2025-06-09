import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { colors } from "../../theme/colors";
import { IOrder } from "../../types/order";
import { EOrderStatus } from "../../enums/order";

interface OrderCardProps {
  order: IOrder;
  mode?: "buyer" | "seller";
  onPress?: (order: IOrder) => void;
  onUpdateStatus?: (order: IOrder, newStatus: EOrderStatus) => void;
  onCancelPress?: (order: IOrder) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  mode = "buyer",
  onPress,
  onUpdateStatus,
  onCancelPress,
}) => {
  const getStatusColor = (status: EOrderStatus): string => {
    switch (status) {
      case EOrderStatus.PENDING:
        return colors.status.warning;
      case EOrderStatus.CONFIRMED:
        return colors.status.info;
      case EOrderStatus.SHIPPING:
        return colors.primary.main;
      case EOrderStatus.DELIVERED:
        return colors.status.success;
      case EOrderStatus.COMPLETED:
        return colors.status.success;
      case EOrderStatus.CANCELLED:
        return colors.status.error;
      default:
        return colors.common.gray3;
    }
  };

  const getStatusText = (status: EOrderStatus): string => {
    switch (status) {
      case EOrderStatus.PENDING:
        return "Chờ xác nhận";
      case EOrderStatus.CONFIRMED:
        return "Đã xác nhận";
      case EOrderStatus.SHIPPING:
        return "Đang giao hàng";
      case EOrderStatus.DELIVERED:
        return "Đã giao hàng";
      case EOrderStatus.COMPLETED:
        return "Hoàn thành";
      case EOrderStatus.CANCELLED:
        return "Đã hủy";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getNextStatus = (currentStatus: EOrderStatus): EOrderStatus | null => {
    if (mode === "seller") {
      switch (currentStatus) {
        case EOrderStatus.PENDING:
          return EOrderStatus.CONFIRMED;
        case EOrderStatus.CONFIRMED:
          return EOrderStatus.SHIPPING;
        case EOrderStatus.SHIPPING:
          return EOrderStatus.DELIVERED;
        default:
          return null;
      }
    } else {
      switch (currentStatus) {
        case EOrderStatus.DELIVERED:
          return EOrderStatus.COMPLETED;
        default:
          return null;
      }
    }
  };

  const getActionText = (status: EOrderStatus): string => {
    switch (status) {
      case EOrderStatus.PENDING:
        return "Xác nhận";
      case EOrderStatus.CONFIRMED:
        return "Giao hàng";
      case EOrderStatus.SHIPPING:
        return "Đã giao";
      case EOrderStatus.DELIVERED:
        return "Hoàn thành";
      default:
        return "";
    }
  };

  const renderActionButtons = () => {
    const nextStatus = getNextStatus(order.status);
    const canCancel =
      order.status === EOrderStatus.PENDING ||
      order.status === EOrderStatus.CONFIRMED;

    if ((!onUpdateStatus && !onCancelPress) || (!nextStatus && !canCancel))
      return null;

    return (
      <View style={styles.actionButtons}>
        {canCancel && onCancelPress && (
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => onCancelPress(order)}
          >
            <Text style={[styles.actionButtonText, styles.cancelButtonText]}>
              Hủy đơn
            </Text>
          </TouchableOpacity>
        )}

        {nextStatus && onUpdateStatus && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onUpdateStatus(order, nextStatus)}
          >
            <Text style={styles.actionButtonText}>
              {getActionText(order.status)}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => onPress?.(order)}
      activeOpacity={0.7}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderCode}>#{order.orderCode}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(order.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
        </View>
      </View>

      <View style={styles.orderContent}>
        {order.orderItems.map((item) => (
          <View key={item.id} style={styles.orderItem}>
            <Image
              source={{ uri: item.productImageUrl }}
              style={styles.productImage}
            />
            <View style={styles.productInfo}>
              <Text style={styles.productTitle} numberOfLines={2}>
                {item.productTitle}
              </Text>
              <Text style={styles.productPrice}>
                {formatPrice(item.itemPrice)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <View style={styles.orderDetails}>
          {mode === "seller" ? (
            <>
              <Text style={styles.sellerInfo}>
                Người mua: {order.buyer.fullName}
              </Text>
              <Text style={styles.orderDate}>
                Địa chỉ: {order.deliveryAddress}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.sellerInfo}>
                Người bán: {order.seller.fullName}
              </Text>
              <Text style={styles.orderDate}>
                Ngày đặt: {formatDate(order.createdAt)}
              </Text>
            </>
          )}
        </View>
        <View style={styles.orderTotal}>
          <Text style={styles.totalLabel}>Tổng cộng:</Text>
          <Text style={styles.totalAmount}>
            {formatPrice(order.totalAmount)}
          </Text>
        </View>

        {renderActionButtons()}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  orderCard: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.common.gray3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderCode: {
    fontFamily: "OpenSans_700Bold",
    fontSize: 16,
    color: colors.common.gray3,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontFamily: "OpenSans_600SemiBold",
    fontSize: 12,
    color: colors.common.white,
  },
  orderContent: {
    gap: 12,
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: "row",
    gap: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    resizeMode: "cover",
  },
  productInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  productTitle: {
    fontFamily: "OpenSans_600SemiBold",
    fontSize: 14,
    color: colors.common.gray3,
  },
  productPrice: {
    fontFamily: "OpenSans_700Bold",
    fontSize: 14,
    color: colors.primary.main,
  },
  orderFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.common.gray1,
    paddingTop: 12,
    gap: 8,
  },
  orderDetails: {
    gap: 4,
  },
  sellerInfo: {
    fontFamily: "OpenSans_400Regular",
    fontSize: 12,
    color: colors.text.secondary,
  },
  orderDate: {
    fontFamily: "OpenSans_400Regular",
    fontSize: 12,
    color: colors.text.secondary,
  },
  orderTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontFamily: "OpenSans_600SemiBold",
    fontSize: 14,
    color: colors.common.gray3,
  },
  totalAmount: {
    fontFamily: "OpenSans_700Bold",
    fontSize: 16,
    color: colors.primary.main,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.common.gray1,
    gap: 8,
  },
  actionButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: colors.common.red,
  },
  actionButtonText: {
    fontFamily: "OpenSans_600SemiBold",
    fontSize: 14,
    color: colors.common.white,
  },
  cancelButtonText: {
    color: colors.common.white,
  },
});

export default OrderCard;
