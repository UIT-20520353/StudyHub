import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { ApiResponse, ApiError } from "../types/api";

// Create axios instance with custom config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:8082", // Replace with your API base URL
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // You can add auth token here
    const token = ""; // Get token from your storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          break;
        case 403:
          // Handle forbidden
          break;
        case 404:
          // Handle not found
          break;
        case 500:
          // Handle server error
          break;
        default:
          // Handle other errors
          break;
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up request:", error.message);
    }
    return Promise.reject(error);
  }
);

// Wrapper function to handle API calls
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
  } catch (error) {
    const axiosError = error as AxiosError;
    const apiError: ApiError = {
      status: axiosError.response?.status || 500,
      message:
        (axiosError.response?.data as { message?: string })?.message ||
        axiosError.message ||
        "An error occurred",
    };
    return {
      ok: false,
      body: undefined,
      errors: apiError,
    };
  }
};

export default axiosInstance;
