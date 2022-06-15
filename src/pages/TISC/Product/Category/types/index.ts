export interface ICategoryListResponse {
  id: string;
  name?: string;
  count?: number;
  subs: ICategoryListResponse[];
}
