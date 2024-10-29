export interface PriceAndInventoryAttribute {
  id?: string;
  sku?: string;
  description?: string;
  unit_price?: number;
  discount_price?: number;
  discount_rate?: number;
  min_quantity?: number;
  max_quantity?: number;
  unit_type: string;
  unit_type_code?: string;
  inventory_category_id?: string;
  image?: any;
}
