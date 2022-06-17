export interface ISubAttribute {
  id: string;
  name: string;
  description: string;
  content_type: string;
}
export interface IAttributeListResponse {
  id: string;
  name: string;
  count: number;
  subs: ISubAttribute[];
  created_at: string;
}
