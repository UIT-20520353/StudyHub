import { ApiResponse } from "../types/api";
import { IUser } from "../types/user";
import axiosInstance, { apiCall } from "./axios";

export const userService = {
  getUserDetail: async (userId: number): Promise<ApiResponse<IUser>> =>
    apiCall(axiosInstance.get(`/user/user-detail/${userId}`)),
  updateAvatar: async (formData: FormData): Promise<ApiResponse<IUser>> =>
    apiCall(
      axiosInstance.put("/user/change-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ),
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<undefined>> =>
    apiCall(axiosInstance.put("/user/change-password", data)),
};
