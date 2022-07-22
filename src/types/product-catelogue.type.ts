export interface ProductCatelogue {
  id?: string;
  product_id?: string;
  contents: ProductCatelogueData[];
  created_at?: string;
}
export interface ProductCatelogueData {
  id?: string;
  title: string;
  url: string;
}
