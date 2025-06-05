import { ApiResponse } from "../types/api";
import { ICategory } from "../types/category";
import axiosInstance, { apiCall } from "./axios";

export const categoryService = {
  getTopicCategories: async (): Promise<ApiResponse<ICategory[]>> =>
    apiCall(axiosInstance.get("/common/categories/topic")),
};
