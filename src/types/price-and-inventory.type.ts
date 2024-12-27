import type { ExchangeCurrencyHistory } from '@/types/currency.type';
import { WarehouseItemMetric, WarehouseRequest } from '@/types/warehouse.type';

export interface VolumePrice
  extends Pick<
    PriceAttribute,
    'id' | 'discount_price' | 'discount_rate' | 'min_quantity' | 'max_quantity' | 'unit_type'
  > {}

export interface PriceAttribute {
  id?: string;
  sku?: string;
  description?: string;
  unit_price?: number | null;
  discount_price?: number | null;
  discount_rate?: number | null;
  min_quantity?: number | null;
  max_quantity?: number | null;
  unit_type: string;
  unit_type_code?: string;
  inventory_category_id?: string;
  image?: any;
}

export interface InventoryAttribute {
  total_stock: number;
  out_of_stock: number;
  on_order: number;
  back_order: number;
  location_id?: string;
  name?: string;
  city_name?: string;
  country_name?: string;
  warehouses: WarehouseItemMetric[];
}

export interface IPriceAndInventoryForm extends PriceAttribute, InventoryAttribute {
  price: Partial<InventoryPrice>;
}

export const initialInventoryFormData: IPriceAndInventoryForm = {
  sku: '',
  description: '',
  unit_type: '',
  inventory_category_id: '',
  image: [],
  total_stock: 0,
  out_of_stock: 0,
  on_order: 0,
  back_order: 0,
  warehouses: [],
  city_name: '',
  country_name: '',
  discount_price: null,
  discount_rate: null,
  min_quantity: null,
  max_quantity: null,
  location_id: '',
  name: '',
  price: {
    created_at: '',
    currency: '',
    unit_price: 0,
    unit_type: '',
    volume_prices: [],
    exchange_histories: [],
  },
};

export interface InventoryPrice {
  created_at: string;
  currency?: string;
  unit_price: number;
  unit_type: string;
  volume_prices: VolumePrice[];
  exchange_histories: ExchangeCurrencyHistory[];
}

export interface PriceAndInventoryColumn {
  id: string;
  image: string;
  back_order: number;
  originBackOrder: number;
  out_stock: number;
  total_stock: number;
  on_order: number;
  sku: string;
  description: string;
  stock_value: number;
  price: InventoryPrice;
  warehouses: WarehouseItemMetric[];
}

export interface InventoryImportRequest {
  sku: string;
  inventory_category_id: string;
  description: string;
  unit_price: number;
  unit_type: string;
  on_order: number;
  back_order: number;
  warehouses: WarehouseRequest[];
}
