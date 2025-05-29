interface IAuthor {
  id: number;
  fullName: string;
  avatarUrl: string;
  university: string;
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
  userReaction: string;
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
  visibility: string;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
  author: IAuthor;
  category: ICategory;
  university: IUniversity;
  attachments: IAttachment[];
  userInteraction: IUserInteraction;
}
