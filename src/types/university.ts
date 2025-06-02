import { EUniversityStatus } from "../enums/university";

export interface IUniversity {
  id: number;
  name: string;
  shortName: string;
  address?: string;
  emailDomain: string;
  city?: string;
  website?: string;
  logoUrl?: string;
  description?: string;
  status: EUniversityStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
