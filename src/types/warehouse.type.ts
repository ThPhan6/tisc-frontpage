export interface WarehouseItemMetric {
  id?: string;
  name: string;
  city_name: string;
  country_name: string;
  in_stock?: number;
  convert?: number;
}

export interface Warehouse {
  relation_id?: string;
  location_id: string;
  inventory_id: string;
  total_stock?: number;
  warehouses?: WarehouseItemMetric[];
}
