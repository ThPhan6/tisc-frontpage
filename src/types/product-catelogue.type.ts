export interface IProductCatelogue {
  id?: string;
  product_id?: string;
  contents: IProductCatelogueData[];
  created_at?: string;
}
export interface IProductCatelogueData {
  id?: string;
  title: string;
  url: string;
}
