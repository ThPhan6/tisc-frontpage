export interface ProductDownload {
  id?: string;
  product_id?: string;
  contents: ProductDownloadData[];
  created_at?: string;
}
export interface ProductDownloadData {
  id?: string;
  title: string;
  url: string;
}
