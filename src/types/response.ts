export interface ApiResponse<T> {
  data: T | null;
  statusCode: string | number;
  message: string;
}
