export interface Warehouse {
  relation_id?: string;
  location_id: string;
  inventory_id: string;
  total_stock?: number;
  warehouses?: {
    city_name: string;
    country_name: string;
    created_at: string;
    id: string;
    in_stock: number;
    name: string;
  }[];
}
