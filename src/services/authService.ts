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
  message: string;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface IVerifyEmailData {
  code: string;
  userId: number;
}

export interface IRegisterData {
  email: string;
  password: string;
  fullName: string;
  studentId?: string;
  universityId: number;
  major?: string;
  year?: number;
  phone?: string;
}

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
  register: async (body: IRegisterData): Promise<ApiResponse<IUser>> =>
    apiCall(axiosInstance.post("/auth/register", body)),
  sendVerificationEmail: async (userId: number): Promise<ApiResponse<IUser>> =>
    apiCall(axiosInstance.get(`/auth/verify-email/${userId}`)),
  resendVerificationEmail: async (
    userId: number
  ): Promise<ApiResponse<undefined>> =>
    apiCall(
      axiosInstance.post("/auth/resend-verification", {
        userId,
      })
    ),
  verifyEmail: async (body: IVerifyEmailData): Promise<ApiResponse<IUser>> =>
    apiCall(axiosInstance.post("/auth/verify-email", body)),
  forgotPassword: async (email: string): Promise<ApiResponse<undefined>> =>
    apiCall(axiosInstance.post("/auth/forgot-password", { email })),
};
