import { InventoryExportType } from '@/features/Import/types/export.type';
import { DatabaseHeaderMatching, InventoryField } from '@/features/Import/types/import.type';

import { startCase } from 'lodash';

import {
  DatabaseHeaderMatching,
  ImportDatabaseHeader,
  InventoryField,
} from '@/features/Import/types/import.type';


const generateLabel = (field: keyof InventoryField) => {
  switch (field) {
    case 'sku':
      return 'Product ID';
    case 'unit_type':
      return 'Unit Type';
    case 'unit_price':
      return 'Unit Price';
    case 'image':
      return 'Image';
    case 'back_order':
      return 'Back Order';
    case 'on_order':
      return 'On Order';
    case 'description':
      return 'Description';
    case 'discount_rate':
      return 'Discount Rate';
    case 'min_quantity':
      return 'Minimum Quantity';
    case 'max_quantity':
      return 'Maximum Quantity';
    default:
      return (field as any).charAt(0).toUpperCase() + (field as any).slice(1);
  }
};

const keys: string[] = [
  'sku',
  'unit_type',
  'unit_price',
  'image',
  'back_order',
  'on_order',
  'description',
  'discount_rate',
  'min_quantity',
  'max_quantity',
];

export const DATABASE_HEADER_MATCHING: DatabaseHeaderMatching[] = keys.map((key, index) => ({
  id: (index + 1).toString(),
  label: generateLabel(key as keyof InventoryField),
  value: key as keyof InventoryField,
}));


export const INVENTORY_EXPORT_TYPE_LABELS = [
  { key: InventoryExportType.PRODUCT_ID, label: 'Product ID' },
  { key: InventoryExportType.DESCRIPTION, label: 'Description' },
  { key: InventoryExportType.UNIT_PRICE, label: 'Unit Price' },
  { key: InventoryExportType.UNIT_TYPE, label: 'Unit Type' },
  { key: InventoryExportType.DISCOUNT_RATE, label: 'Discount Rate' },
  { key: InventoryExportType.MIN_QUANTITY, label: 'Min. Quantity' },
  { key: InventoryExportType.MAX_QUANTITY, label: 'Max. Quantity' },
  { key: InventoryExportType.WAREHOUSE_NAME, label: 'Warehouse Name' },
  { key: InventoryExportType.WAREHOUSE_CITY, label: 'Warehouse City Name' },
  { key: InventoryExportType.WAREHOUSE_COUNTRY, label: 'Warehouse Country Name' },
  { key: InventoryExportType.WAREHOUSE_IN_STOCK, label: 'Warehouse In Stock' },
  { key: InventoryExportType.OUT_OF_STOCK, label: 'Warehouse Out of Stock' },
  { key: InventoryExportType.ON_ORDER, label: 'Warehouse On Order' },
  { key: InventoryExportType.BACK_ORDER, label: 'Warehouse Backorder' },

export const getDatabaseHeader = (
  field: string,
  handleSelectDatabaseHeader: (field: string, header: ImportDatabaseHeader) => void,
) => [
  {
    key: ImportDatabaseHeader.PRODUCT_ID,
    label: 'Product ID',
    onClick: () => {
      handleSelectDatabaseHeader(field, ImportDatabaseHeader.PRODUCT_ID);
    },
  },
  {
    key: ImportDatabaseHeader.DESCRIPTION,
    label: startCase(ImportDatabaseHeader.DESCRIPTION),
    onClick: () => {
      handleSelectDatabaseHeader(field, ImportDatabaseHeader.DESCRIPTION);
    },
  },
  {
    key: ImportDatabaseHeader.UNIT_PRICE,
    label: startCase(ImportDatabaseHeader.UNIT_PRICE),
    onClick: () => {
      handleSelectDatabaseHeader(field, ImportDatabaseHeader.UNIT_PRICE);
    },
  },
  {
    key: ImportDatabaseHeader.UNIT_TYPE,
    label: startCase(ImportDatabaseHeader.UNIT_TYPE),
    onClick: () => {
      handleSelectDatabaseHeader(field, ImportDatabaseHeader.UNIT_TYPE);
    },
  },
  {
    key: ImportDatabaseHeader.ON_ORDER,
    label: startCase(ImportDatabaseHeader.ON_ORDER),
    onClick: () => {
      handleSelectDatabaseHeader(field, ImportDatabaseHeader.ON_ORDER);
    },
  },
  {
    key: ImportDatabaseHeader.BACK_ORDER,
    label: startCase(ImportDatabaseHeader.BACK_ORDER),
    onClick: () => {
      handleSelectDatabaseHeader(field, ImportDatabaseHeader.BACK_ORDER);
    },
  },
];
