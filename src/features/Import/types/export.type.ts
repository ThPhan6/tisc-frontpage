export enum InventoryExportType {
  PRODUCT_ID = 1,
  DESCRIPTION = 2,
  UNIT_PRICE = 3,
  UNIT_TYPE = 4,
  ON_ORDER = 5,
  BACK_ORDER = 6,
  OUT_OF_STOCK = 7,
  TOTAL_STOCK = 8,
  DISCOUNT_RATE = 9,
  MIN_QUANTITY = 10,
  MAX_QUANTITY = 11,
  WAREHOUSE_NAME = 12,
  WAREHOUSE_CITY = 13,
  WAREHOUSE_COUNTRY = 14,
  WAREHOUSE_IN_STOCK = 15,
}

export interface ExportRequest {
  category_id: string;
  types: InventoryExportType[];
}
