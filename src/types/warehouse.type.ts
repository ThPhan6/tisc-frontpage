export interface WarehouseItemMetric {
  id: string;
  name: string;
  location_id: string;
  city_name: string;
  country_name: string;
  in_stock: number;
  new_in_stock: number;
  convert: number;
}

export interface WarehouseRequest {
  location_id: string;
  quantity: number;
}

export interface WarehouseResponse {
  warehouses: WarehouseItemMetric[];
  total_stock: number;
}
