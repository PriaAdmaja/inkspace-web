export type Response<T> = {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    current_page: number;
    last_page: number;
    limit: number;
    total: number;
  };
  error?: { field: string; message: string }[];
};
