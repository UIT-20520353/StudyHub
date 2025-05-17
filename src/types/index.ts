export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  university: string;
  rating?: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  subject: string;
  department: string;
  price: number;
  originalPrice?: number;
  condition: "new" | "like-new" | "good" | "fair";
  images: string[];
  description: string;
  sellerId: string;
  status: "available" | "sold" | "reserved";
  university: string;
  createdAt: Date;
}

export interface Post {
  id: string;
  authorId: string;
  title: string;
  content: string;
  type: "experience" | "document" | "question" | "answer";
  subject?: string;
  department?: string;
  university: string;
  likes: number;
  comments: Comment[];
  createdAt: Date;
}

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  createdAt: Date;
}
