import {
  EDeliveryMethod,
  EProductCondition,
  EProductStatus,
} from "../enums/product";
import { ICategory } from "./category";
import { IUser } from "./user";

export interface IProductSummary {
  id: number;
  title: string;
  price: number;
  seller: IUser;
  viewCount: number;
  condition: EProductCondition;
  status: EProductStatus;
  primaryImageUrl: string;
  sellerName: string;
  categoryName: string;
  createdAt: string;
}

export interface IProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  viewCount: number;
  condition: EProductCondition;
  status: string;
  address: string;
  deliveryMethod: EDeliveryMethod;
  seller: IUser;
  category: ICategory;
  images: IImage[];
  primaryImageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface IImage {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
  createdAt: string;
}
