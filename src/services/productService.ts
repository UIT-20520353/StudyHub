import {
  EDeliveryMethod,
  EProductCondition,
  EProductStatus,
} from "../enums/product";
import { ApiResponse, ListResponse } from "../types/api";
import { IProduct, IProductSummary } from "../types/product";
import axiosInstance, { apiCall } from "./axios";

export const productService = {
  getProducts: async ({
    title,
    conditions,
    deliveryMethods,
    categoryIds,
  }: {
    title?: string;
    conditions?: EProductCondition[];
    deliveryMethods?: EDeliveryMethod[];
    categoryIds?: number[];
  }): Promise<ApiResponse<ListResponse<IProductSummary>>> =>
    apiCall(
      axiosInstance.get("/user/products/search", {
        params: {
          size: 100,
          page: 0,
          title,
          conditions,
          deliveryMethods,
          categoryIds,
          statuses: [EProductStatus.AVAILABLE],
        },
      })
    ),
  getProductById: async (id: number): Promise<ApiResponse<IProduct>> =>
    apiCall(axiosInstance.get(`/user/products/${id}`)),
  createProduct: async (data: FormData): Promise<ApiResponse<IProduct>> =>
    apiCall(
      axiosInstance.post("/user/products/create", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ),
  deleteProduct: async (id: number): Promise<ApiResponse<void>> =>
    apiCall(axiosInstance.delete(`/user/products/${id}`)),
  getTopProducts: async (): Promise<ApiResponse<IProductSummary[]>> =>
    apiCall(axiosInstance.get("/user/products/top-10")),
};
