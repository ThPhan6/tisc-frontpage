export interface IProductTip {
  id?: string;
  product_id?: string;
  contents: IProductTipData[];
  created_at?: string;
}
export interface IProductTipData {
  id?: string;
  title: string;
  content: string;
}
