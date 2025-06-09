export interface IComment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  dislikeCount: number;
  author: {
    id: number;
    fullName: string;
    avatarUrl: string;
    university: {
      id: number;
      name: string;
      shortName: string;
    };
    major?: string;
    year?: number;
  };
  userInteraction?: {
    userReaction?: "LIKE" | "DISLIKE";
    isAuthor: boolean;
  };
}

export interface ICommentCreate {
  content: string;
}
