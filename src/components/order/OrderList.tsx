import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  Text,
} from "react-native";
import { colors } from "../../theme/colors";
import { IOrder } from "../../types/order";
import { EOrderStatus } from "../../enums/order";
import OrderCard from "./OrderCard";

interface OrderListProps {
  orders: IOrder[];
  loading?: boolean;
  mode?: "buyer" | "seller";
  onOrderPress?: (order: IOrder) => void;
  onUpdateStatus?: (order: IOrder, newStatus: EOrderStatus) => void;
  onCancelPress?: (order: IOrder) => void;
}

const OrderList: React.FC<OrderListProps> = ({
  orders,
  loading = false,
  mode = "buyer",
  onOrderPress,
  onUpdateStatus,
  onCancelPress,
}) => {
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyTitle}>Không có đơn hàng nào</Text>
        <Text style={styles.emptyText}>
          Không có đơn hàng nào ở trạng thái này.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.ordersList}>
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            mode={mode}
            onPress={onOrderPress}
            onUpdateStatus={onUpdateStatus}
            onCancelPress={onCancelPress}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  ordersList: {
    padding: 16,
    gap: 12,
  },
  loadingText: {
    fontFamily: "OpenSans_400Regular",
    fontSize: 14,
    color: colors.common.gray3,
    marginTop: 12,
  },
  emptyTitle: {
    fontFamily: "OpenSans_700Bold",
    fontSize: 18,
    color: colors.common.gray3,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: "OpenSans_400Regular",
    fontSize: 14,
    color: colors.common.gray3,
    opacity: 0.7,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default OrderList;
