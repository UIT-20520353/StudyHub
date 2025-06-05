export interface ICategory {
  id: number;
  name: string;
  type: CategoryType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum CategoryType {
  PRODUCT = "PRODUCT",
  TOPIC = "TOPIC",
}

export interface ICategoryFilter {
  type?: CategoryType;
  isActive?: boolean;
  searchKeyword?: string;
}
