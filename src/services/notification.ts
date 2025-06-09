import { ApiResponse } from "../types/api";
import { INotification } from "../types/notification";
import axiosInstance, { apiCall } from "./axios";

export const notificationService = {
  getNotifications: async (): Promise<ApiResponse<INotification[]>> =>
    apiCall(axiosInstance.get("/notifications")),
};
