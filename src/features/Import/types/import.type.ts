export enum ImportStep {
  STEP_1,
  STEP_2,
  STEP_3,
}

export interface FileUploadInventory {}

export interface DataMatchingInventory {}

export interface ImportInventory {}

export interface InventoryField {
  sku: string;
  unit_type: string;
  unit_price: number;
  image?: string;
  back_order?: number;
  on_order?: number;
  description?: string;
  discount_rate?: number;
  min_quantity?: number;
  max_quantity?: number;
}

export interface DatabaseHeaderMatching {
  id: string;
  label: string;
  value: keyof InventoryField;
}
