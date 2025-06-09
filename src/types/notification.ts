import { ENotificationType } from "../enums/notification";
import { IOrder } from "./order";
import { IProduct } from "./product";
import { IUser } from "./user";

export interface INotification {
  id: number;
  type: ENotificationType;
  title: string;
  content: string;
  createdAt: string;
  topic: string | null;
  product: IProduct | null;
  order: IOrder;
  sender: IUser;
  read: boolean;
}
