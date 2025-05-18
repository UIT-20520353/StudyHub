import { EUserRole } from "../enums/user";

export interface IUser {
  id: number;
  email: string;
  fullName: string;
  studentId: string;
  university: string;
  major: string;
  year: number;
  avatarUrl: string;
  phone: string;
  bio: string;
  role: EUserRole;
  isVerified: boolean;
}
