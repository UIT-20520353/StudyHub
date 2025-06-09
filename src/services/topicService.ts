import { ETopicReaction, ETopicStatus } from "../enums/topic";
import { ApiResponse, ListResponse } from "../types/api";
import { IComment } from "../types/comment";
import { ITopic } from "../types/topic";
import axiosInstance, { apiCall } from "./axios";

export const topicService = {
  getTopics: async ({
    title,
    categoryIds,
    hasAttachments,
  }: {
    title?: string;
    categoryIds?: number[];
    hasAttachments?: boolean;
  }): Promise<ApiResponse<ListResponse<ITopic>>> =>
    apiCall(
      axiosInstance.get("/user/topics/filter", {
        params: {
          page: 0,
          size: 100,
          statuses: [ETopicStatus.ACTIVE],
          title,
          categoryIds,
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
  createComment: async (body: {
    topicId: number;
    content: string;
  }): Promise<ApiResponse<undefined>> =>
    apiCall(axiosInstance.post("/user/comments", body)),
  getComments: async (topicId: number): Promise<ApiResponse<IComment[]>> =>
    apiCall(axiosInstance.get(`/user/comments/topic/${topicId}`)),
  deleteComment: async (commentId: number): Promise<ApiResponse<undefined>> =>
    apiCall(axiosInstance.delete(`/user/comments/${commentId}`)),
  getTop10Topics: async (): Promise<ApiResponse<ITopic[]>> =>
    apiCall(axiosInstance.get("/user/topics/top-10")),
};
