import { EOrderStatus } from "../enums/order";
import { EDeliveryMethod } from "../enums/product";
import { IUserSummary } from "./user";

export interface IOrder {
  id: number;
  orderCode: string;
  status: EOrderStatus;
  deliveryMethod: EDeliveryMethod;
  buyer: IUserSummary;
  seller: IUserSummary;
  deliveryAddress: string;
  deliveryPhone: string;
  deliveryNotes: string;
  shippingFee: number;
  productTotal: number;
  totalAmount: number;
  orderItems: IOrderItem[];
  createdAt: string;
  updatedAt: string;
  confirmedAt: string;
  shippingFeeUpdatedAt: string;
  deliveredAt: string;
  completedAt: string;
  cancelledAt: string;
  cancellationReason: string;
  cancelledBy: IUserSummary;
  completed: boolean;
  cancelled: boolean;
  shippingFeeUpdated: boolean;
  delivered: boolean;
  confirmed: boolean;
  pending: boolean;
  shipping: boolean;
}

export interface IOrderItem {
  id: number;
  productId: number;
  productTitle: string;
  productImageUrl: string;
  itemPrice: number;
  createdAt: string;
}

export interface IOrderCount {
  pending: number;
  confirmed: number;
  shipping: number;
  shippingFeeUpdated: number;
  delivered: number;
  completed: number;
  cancelled: number;
}
