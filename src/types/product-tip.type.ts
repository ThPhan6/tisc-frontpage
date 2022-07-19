export interface ProductTip {
  id?: string;
  product_id?: string;
  contents: ProductTipData[];
  created_at?: string;
}
export interface ProductTipData {
  id?: string;
  title: string;
  content: string;
}
