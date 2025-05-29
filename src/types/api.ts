export type ApiError = {
  status: number;
  message: string;
};

export type ApiResponse<T> =
  | {
      ok: true;
      body: T;
      errors: undefined;
    }
  | {
      ok: false;
      body: undefined;
      errors: ApiError;
    };

export type ListResponse<T> = {
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  items: T[];
};
