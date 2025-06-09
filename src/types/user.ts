import { EUserRole } from "../enums/user";
import { IUniversity } from "./university";

export interface IUser {
  id: number;
  email: string;
  fullName: string;
  studentId: string;
  university: IUniversity;
  major: string;
  year: number;
  avatarUrl: string;
  phone: string;
  bio: string;
  role: EUserRole;
  isVerified: boolean;
}

export interface IUserSummary {
  id: number;
  fullName: string;
  email: string;
  avatarUrl: string;
  phone: string;
}
