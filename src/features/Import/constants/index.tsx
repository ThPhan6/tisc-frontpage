import { startCase } from 'lodash';

import { DatabaseHeaderMatching, InventoryField } from '@/features/Import/types/import.type';
import { ImportDatabaseHeader } from '@/features/Import/types/import.type';

import { BodyText } from '@/components/Typography';

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

export const INVENTORY_EXPORT_LABELS = [
  { label: 'Product ID' },
  { label: 'Description' },
  { label: 'Unit Price' },
  { label: 'Unit Type' },
  { label: 'Warehouse Name' },
  { label: 'Warehouse Country' },
  { label: 'Warehouse City' },
  { label: 'Warehouse In Stock' },
  { label: 'Out of Stock' },
  { label: 'On Order' },
  { label: 'Backorder' },
  { label: 'Volume Price' },
  { label: 'Volume % Rate' },
  { label: 'Volume Min. Qty' },
  { label: 'Volume Max. Qty' },
];

export const getDatabaseHeader = (
  field: string,
  handleSelectDatabaseHeader: (field: string, header: ImportDatabaseHeader) => void,
) => [
  {
    key: ImportDatabaseHeader.PRODUCT_ID,
    label: (
      <div className="d-flex items-center">
        <BodyText fontFamily="Roboto" level={6}>
          Product ID
        </BodyText>
        <span className="red-magenta required">*</span>
      </div>
    ),
    onClick: () => {
      handleSelectDatabaseHeader(field, ImportDatabaseHeader.PRODUCT_ID);
    },
  },
  {
    key: ImportDatabaseHeader.UNIT_PRICE,
    label: (
      <div className="d-flex items-center">
        <BodyText fontFamily="Roboto" level={6}>
          {startCase(ImportDatabaseHeader.UNIT_PRICE)}
        </BodyText>
        <span className="red-magenta required">*</span>
      </div>
    ),
    onClick: () => {
      handleSelectDatabaseHeader(field, ImportDatabaseHeader.UNIT_PRICE);
    },
  },
  {
    key: ImportDatabaseHeader.UNIT_TYPE,
    label: (
      <div className="d-flex items-center">
        <BodyText fontFamily="Roboto" level={6}>
          {startCase(ImportDatabaseHeader.UNIT_TYPE)}
        </BodyText>
        <span className="red-magenta required">*</span>
      </div>
    ),
    onClick: () => {
      handleSelectDatabaseHeader(field, ImportDatabaseHeader.UNIT_TYPE);
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
