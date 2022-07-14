export interface IProductDownload {
  id?: string;
  product_id?: string;
  contents: IProductDownloadData[];
  created_at?: string;
}
export interface IProductDownloadData {
  id?: string;
  title: string;
  url: string;
}
