import { DatabaseHeaderMatching, InventoryField } from '@/features/Import/types/import.type';

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
