import { ETopicReaction, ETopicStatus } from "../enums/topic";
import { ApiResponse, ListResponse } from "../types/api";
import { ITopic } from "../types/topic";
import axiosInstance, { apiCall } from "./axios";

export const topicService = {
  getTopics: async (): Promise<ApiResponse<ListResponse<ITopic>>> =>
    apiCall(
      axiosInstance.get("/user/topics/filter", {
        params: {
          page: 0,
          size: 10,
          statuses: [ETopicStatus.ACTIVE],
        },
      })
    ),
  getTopicDetail: async (topicId: number): Promise<ApiResponse<ITopic>> =>
    apiCall(axiosInstance.get(`/user/topics/${topicId}`)),
  reactToTopic: async (
    topicId: number,
    reactionType: ETopicReaction
  ): Promise<ApiResponse<ITopic>> =>
    apiCall(
      axiosInstance.post(`/user/topics/${topicId}/react`, null, {
        params: {
          reactionType,
        },
      })
    ),
  createTopic: async (formData: FormData): Promise<ApiResponse<ITopic>> =>
    apiCall(
      axiosInstance.post("/user/topics", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ),
  deleteTopic: async (topicId: number): Promise<ApiResponse<ITopic>> =>
    apiCall(axiosInstance.delete(`/user/topics/${topicId}`)),
};
