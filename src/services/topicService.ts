import { ApiResponse, ListResponse } from "../types/api";
import { ITopic } from "../types/topic";
import axiosInstance, { apiCall } from "./axios";

export const topicService = {
  getTopics: async (): Promise<ApiResponse<ListResponse<ITopic>>> =>
    apiCall(axiosInstance.get("/user/topics")),
};
