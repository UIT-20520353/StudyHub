import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "../constants/AppConstants";
import { ApiResponse } from "../types/api";
import { IUser } from "../types/user";
import { api } from "./api";
import axiosInstance, { apiCall } from "./axios";

export interface ILoginResponse {
  token: string;
  tokenType: string;
  user: IUser;
}

export type ILoginData = {
  email: string;
  password: string;
};

export const authService = {
  login: async (body: ILoginData): Promise<ApiResponse<ILoginResponse>> =>
    apiCall(axiosInstance.post("/auth/login", body)),
  logout: async (): Promise<void> => {
    try {
      await api.auth.logout();
    } finally {
      // Clear storage regardless of API call success
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(AUTH_USER_KEY);
    }
  },
  getProfile: async (): Promise<ApiResponse<IUser>> =>
    apiCall(axiosInstance.get("/user/profile")),
  getStoredUser: async () => {
    const userStr = await AsyncStorage.getItem(AUTH_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },
  getStoredToken: async () => {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  },
};
