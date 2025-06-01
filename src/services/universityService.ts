import { ApiResponse } from "../types/api";
import { IUniversity } from "../types/university";
import axiosInstance, { apiCall } from "./axios";

export const universityService = {
  getUniversities: async (): Promise<ApiResponse<IUniversity[]>> =>
    apiCall(axiosInstance.get("/common/universities")),
};
