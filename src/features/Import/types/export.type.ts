export enum InventoryExportType {
  PRODUCT_ID = 1,
  DESCRIPTION = 2,
  UNIT_PRICE = 3,
  UNIT_TYPE = 4,
  ON_ORDER = 5,
  BACK_ORDER = 6,
  OUT_OF_STOCK = 7,
  TOTAL_STOCK = 8,
  STOCK_VALUE = 9,
  DISCOUNT_RATE = 10,
  DISCOUNT_PRICE = 11,
  MIN_QUANTITY = 12,
  MAX_QUANTITY = 13,
  WAREHOUSE_NAME = 14,
  WAREHOUSE_CITY = 15,
  WAREHOUSE_COUNTRY = 16,
  WAREHOUSE_IN_STOCK = 17,
}

export interface ExportRequest {
  category_id: string;
  types: InventoryExportType[];
}
