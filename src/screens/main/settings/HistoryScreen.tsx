import React, { useEffect, useState } from "react";
import { StyleSheet, View, Modal, ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationHeader } from "../../../components/common/StackNavigationHeader";
import {
  OrderList,
  OrderTabs,
  CancelOrderModal,
} from "../../../components/order";
import { EOrderStatus } from "../../../enums/order";
import { useTranslation, useQuickToast } from "../../../hooks";
import { NAMESPACES } from "../../../i18n";
import { orderService } from "../../../services/orderService";
import { colors } from "../../../theme/colors";
import { SettingsStackNavigationProp } from "../../../types/navigation";
import { IOrder } from "../../../types/order";

interface HistoryScreenProps {
  navigation: SettingsStackNavigationProp;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ navigation }) => {
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
    const response = await orderService.countBoughtOrdersByStatus();
    if (response.ok && response.body) {
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
      console.error("Failed to load order counts:", response.errors);
      setOrderCounts({});
    }
  };

  const loadCurrentOrders = async (status: EOrderStatus) => {
    setLoading(true);
    try {
      const response = await orderService.getOrdersByStatus(status);
      if (response.ok && response.body) {
        const orders = Array.isArray(response.body) ? response.body : [];
        setCurrentOrders(orders);
      } else {
        setCurrentOrders([]);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      setCurrentOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderPress = (order: IOrder) => {
    console.log("Order pressed:", order.id);
  };

  const handleCompleteOrder = async (order: IOrder) => {
    setActionLoading(true);
    const response = await orderService.completeOrder(order.id);
    if (response.ok) {
      toast.success(t("order.completed_success_message"));
      await loadOrderCounts();
      await loadCurrentOrders(activeTab);
    } else {
      toast.error("Không thể hoàn thành đơn hàng");
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
    if (
      order.status === EOrderStatus.DELIVERED &&
      newStatus === EOrderStatus.COMPLETED
    ) {
      await handleCompleteOrder(order);
      return;
    }
  };

  const handleTabChange = (newTab: EOrderStatus) => {
    setActiveTab(newTab);
    loadCurrentOrders(newTab);
  };

  useEffect(() => {
    loadOrderCounts();
    loadCurrentOrders(activeTab);
  }, []);

  useEffect(() => {
    loadCurrentOrders(activeTab);
  }, [activeTab]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StackNavigationHeader
          title="Lịch sử mua hàng"
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
  header: {
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: colors.common.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.common.gray1,
  },
  title: {
    fontFamily: "OpenSans_700Bold",
    fontSize: 20,
    color: colors.common.gray3,
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

export default HistoryScreen;
