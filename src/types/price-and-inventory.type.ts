import { WarehouseItemMetrics } from '@/pages/Brand/PricesAndInventories/PriceAndInventoryForm/InventoryForm';

export interface PriceAttribute {
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

export interface InventoryAttribute extends Partial<WarehouseItemMetrics> {
  location_id: string;
  total_stock: number | null;
  out_of_stock: number | null;
  on_order: number | null;
  back_order: number | null;
}
