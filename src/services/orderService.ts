import { EOrderStatus } from "../enums/order";
import { EDeliveryMethod } from "../enums/product";
import { ApiResponse } from "../types/api";
import { IOrder, IOrderCount } from "../types/order";
import axiosInstance, { apiCall } from "./axios";

export const orderService = {
  createOrder: async ({
    productIds,
    ...rest
  }: {
    productIds: number[];
    deliveryMethod: EDeliveryMethod;
    deliveryAddress: string;
    deliveryPhone: string;
    deliveryNotes?: string;
  }) => {
    console.log({
      ...rest,
      orderItems: productIds.map((id) => ({ productId: id })),
    });
    return apiCall(
      axiosInstance.post("/user/orders", {
        ...rest,
        orderItems: productIds.map((id) => ({ productId: id })),
      })
    );
  },
  getOrdersByStatus: async (status: EOrderStatus) =>
    apiCall(axiosInstance.get("/user/orders/bought", { params: { status } })),
  getOrdersByStatusSell: async (
    status: EOrderStatus
  ): Promise<ApiResponse<IOrder[]>> =>
    apiCall(axiosInstance.get("/user/orders/sold", { params: { status } })),
  updateOrderStatus: async (orderId: number, status: EOrderStatus) =>
    apiCall(axiosInstance.put(`/user/orders/${orderId}/status`, { status })),
  countBoughtOrdersByStatus: async (): Promise<ApiResponse<IOrderCount>> =>
    apiCall(axiosInstance.get("/user/orders/bought/count")),
  countSoldOrdersByStatus: async (): Promise<ApiResponse<IOrderCount>> =>
    apiCall(axiosInstance.get("/user/orders/sold/count")),
  confirmOrder: async (orderId: number): Promise<ApiResponse<IOrder>> =>
    apiCall(axiosInstance.put(`/user/orders/${orderId}/confirm`)),
  shipOrder: async (orderId: number): Promise<ApiResponse<IOrder>> =>
    apiCall(axiosInstance.put(`/user/orders/${orderId}/ship`)),
  deliverOrder: async (orderId: number): Promise<ApiResponse<IOrder>> =>
    apiCall(axiosInstance.put(`/user/orders/${orderId}/deliver`)),
  completeOrder: async (orderId: number): Promise<ApiResponse<IOrder>> =>
    apiCall(axiosInstance.put(`/user/orders/${orderId}/complete`)),
  cancelOrder: async (
    orderId: number,
    reason?: string
  ): Promise<ApiResponse<IOrder>> =>
    apiCall(axiosInstance.put(`/user/orders/${orderId}/cancel`, { reason })),
};
