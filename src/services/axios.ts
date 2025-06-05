import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import qs from "qs";
import { AUTH_TOKEN_KEY } from "../constants/AppConstants";
import { Config } from "../constants/Config";
import { ApiError, ApiResponse } from "../types/api";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${Config.API_URL}/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export const apiCall = async <T>(
  promise: Promise<T>
): Promise<ApiResponse<T>> => {
  try {
    const data = await promise;
    return {
      ok: true,
      body: data,
      errors: undefined,
    };
  } catch (error: any) {
    const apiError: ApiError = {
      status: (error.response?.data as any)?.status || 500,
      message: (error.response?.data as any)?.detail || "An error occurred",
    };
    return {
      ok: false,
      body: undefined,
      errors: apiError,
    };
  }
};

export default axiosInstance;
