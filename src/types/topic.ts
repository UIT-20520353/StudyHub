import { ETopicReaction, ETopicVisibility } from "../enums/topic";

interface IAuthor {
  id: number;
  fullName: string;
  avatarUrl: string;
  university: IUniversity;
  major: string;
  year: number;
}

interface ICategory {
  id: number;
  name: string;
}

interface IUniversity {
  id: number;
  name: string;
  shortName: string;
}

interface IAttachment {
  id: number;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

interface IUserInteraction {
  isFollowing: boolean;
  userReaction: ETopicReaction;
  isAuthor: boolean;
}

export interface ITopic {
  id: number;
  title: string;
  content: string;
  viewCount: number;
  commentCount: number;
  likeCount: number;
  dislikeCount: number;
  status: string;
  isLocked: boolean;
  visibility: ETopicVisibility;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
  author: IAuthor;
  categories: ICategory[];
  university: IUniversity | null;
  attachments: IAttachment[];
  userInteraction: IUserInteraction | null;
}
