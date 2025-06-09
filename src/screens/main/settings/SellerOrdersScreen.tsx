import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Modal, ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuickToast, useTranslation } from "../../../hooks";
import { NAMESPACES } from "../../../i18n";
import { colors } from "../../../theme/colors";
import { SettingsStackNavigationProp } from "../../../types/navigation";
import { IOrder } from "../../../types/order";
import { EOrderStatus } from "../../../enums/order";
import { orderService } from "../../../services/orderService";
import {
  OrderTabs,
  OrderList,
  CancelOrderModal,
} from "../../../components/order";
import { StackNavigationHeader } from "../../../components/common/StackNavigationHeader";
import { useFocusEffect } from "@react-navigation/native";

interface SellerOrdersScreenProps {
  navigation: SettingsStackNavigationProp;
}

const SellerOrdersScreen: React.FC<SellerOrdersScreenProps> = ({
  navigation,
}) => {
  const { t } = useTranslation(NAMESPACES.SETTINGS);
  const toast = useQuickToast();
  const [activeTab, setActiveTab] = useState<EOrderStatus>(
    EOrderStatus.PENDING
  );
  const [orderCounts, setOrderCounts] = useState<Record<string, number>>({});
  const [currentOrders, setCurrentOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<IOrder | null>(null);

  const loadOrderCounts = async () => {
    const response = await orderService.countSoldOrdersByStatus();
    if (response.ok) {
      const orderCount = response.body;
      const counts: Record<string, number> = {
        [EOrderStatus.PENDING]: orderCount.pending,
        [EOrderStatus.CONFIRMED]: orderCount.confirmed,
        [EOrderStatus.SHIPPING]: orderCount.shipping,
        [EOrderStatus.DELIVERED]: orderCount.delivered,
        [EOrderStatus.COMPLETED]: orderCount.completed,
        [EOrderStatus.CANCELLED]: orderCount.cancelled,
      };
      setOrderCounts(counts);
    } else {
      setOrderCounts({});
    }
  };

  const loadCurrentOrders = async (status: EOrderStatus) => {
    setLoading(true);
    const response = await orderService.getOrdersByStatusSell(status);
    if (response.ok && response.body) {
      setCurrentOrders(response.body);
    } else {
      setCurrentOrders([]);
    }
    setLoading(false);
  };

  const handleOrderPress = (order: IOrder) => {
    console.log("Seller order pressed:", order.id);
  };

  const handleConfirmOrder = async (order: IOrder) => {
    setActionLoading(true);
    const response = await orderService.confirmOrder(order.id);
    if (response.ok) {
      toast.success(t("order.confirmed_success_message"));
      await loadOrderCounts();
      await loadCurrentOrders(activeTab);
    } else {
      toast.error("Không thể xác nhận đơn hàng");
    }
    setActionLoading(false);
  };

  const handleShipOrder = async (order: IOrder) => {
    setActionLoading(true);
    const response = await orderService.shipOrder(order.id);
    if (response.ok) {
      toast.success(t("order.shipped_success_message"));
      await loadOrderCounts();
      await loadCurrentOrders(activeTab);
    } else {
      toast.error("Không thể giao đơn hàng");
    }
    setActionLoading(false);
  };

  const handleDeliverOrder = async (order: IOrder) => {
    setActionLoading(true);
    const response = await orderService.deliverOrder(order.id);
    if (response.ok) {
      toast.success(t("order.delivered_success_message"));
      await loadOrderCounts();
      await loadCurrentOrders(activeTab);
    } else {
      toast.error("Không thể giao đơn hàng");
    }
    setActionLoading(false);
  };

  const handleCancelPress = (order: IOrder) => {
    setOrderToCancel(order);
    setCancelModalVisible(true);
  };

  const handleCancelOrder = async (order: IOrder, reason: string) => {
    setCancelModalVisible(false);
    setActionLoading(true);

    const response = await orderService.cancelOrder(order.id, reason);
    if (response.ok) {
      toast.success("Đã hủy đơn hàng thành công");
      await loadOrderCounts();
      await loadCurrentOrders(activeTab);
    } else {
      toast.error("Không thể hủy đơn hàng");
    }
    setActionLoading(false);
    setOrderToCancel(null);
  };

  const handleCancelModalClose = () => {
    setCancelModalVisible(false);
    setOrderToCancel(null);
  };

  const handleUpdateStatus = async (order: IOrder, newStatus: EOrderStatus) => {
    if (order.status === EOrderStatus.PENDING) {
      await handleConfirmOrder(order);
      return;
    }
    if (order.status === EOrderStatus.CONFIRMED) {
      await handleShipOrder(order);
      return;
    }
    if (order.status === EOrderStatus.SHIPPING) {
      await handleDeliverOrder(order);
      return;
    }
    // Người bán không thể complete order - chỉ người mua mới được complete
  };

  const handleTabChange = (newTab: EOrderStatus) => {
    setActiveTab(newTab);
    loadCurrentOrders(newTab);
  };

  useFocusEffect(
    useCallback(() => {
      loadOrderCounts();
      loadCurrentOrders(activeTab);
    }, [activeTab])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StackNavigationHeader
          title="Quản lý đơn hàng bán"
          onBackPress={() => navigation.goBack()}
        />

        <OrderTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          orderCounts={orderCounts}
        />

        <OrderList
          orders={currentOrders}
          loading={loading}
          mode="seller"
          onOrderPress={handleOrderPress}
          onUpdateStatus={handleUpdateStatus}
          onCancelPress={handleCancelPress}
        />
      </View>

      <Modal
        transparent={true}
        animationType="fade"
        visible={actionLoading}
        onRequestClose={() => {}}
      >
        <View style={styles.overlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary.main} />
            <Text style={styles.loadingText}>Đang xử lý...</Text>
          </View>
        </View>
      </Modal>

      <CancelOrderModal
        visible={cancelModalVisible}
        order={orderToCancel}
        onCancel={handleCancelModalClose}
        onConfirm={handleCancelOrder}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.common.gray2,
  },
  container: {
    flex: 1,
    backgroundColor: colors.common.gray2,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  loadingContainer: {
    backgroundColor: colors.common.white,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: colors.common.gray3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingText: {
    marginTop: 10,
    fontFamily: "OpenSans_400Regular",
    fontSize: 16,
    color: colors.common.gray3,
  },
});

export default SellerOrdersScreen;
