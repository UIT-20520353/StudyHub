import axiosInstance, { apiCall } from "./axios";
import { ApiResponse } from "../types/api";

// Types for request data
type LoginData = {
  email: string;
  password: string;
};

type RegisterData = LoginData & {
  name: string;
};

type UserProfile = {
  id: string;
  name: string;
  email: string;
  // Add other profile fields as needed
};

// Example API endpoints
export const api = {
  // Auth endpoints
  auth: {
    login: (data: LoginData): Promise<ApiResponse<{ token: string }>> =>
      apiCall(axiosInstance.post("/auth/login", data)),

    register: (data: RegisterData): Promise<ApiResponse<{ token: string }>> =>
      apiCall(axiosInstance.post("/auth/register", data)),

    logout: (): Promise<ApiResponse<void>> =>
      apiCall(axiosInstance.post("/auth/logout")),
  },

  // User endpoints
  user: {
    getProfile: (): Promise<ApiResponse<UserProfile>> =>
      apiCall(axiosInstance.get("/user/profile")),

    updateProfile: (
      data: Partial<UserProfile>
    ): Promise<ApiResponse<UserProfile>> =>
      apiCall(axiosInstance.put("/user/profile", data)),
  },

  // Example of how to use the API
  // Usage:
  // try {
  //   const response = await api.auth.login({ email: 'user@example.com', password: 'password' });
  //   console.log(response);
  // } catch (error) {
  //   console.error(error);
  // }
};
