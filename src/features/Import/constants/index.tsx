import { startCase } from 'lodash';

import { InventoryExportType } from '@/features/Import/types/export.type';
import { ImportDatabaseHeader } from '@/features/Import/types/import.type';

import { BodyText } from '@/components/Typography';

export const INVENTORY_EXPORT_COLUMN_HEADERS = [
  {
    key: InventoryExportType.PRODUCT_ID,
    label: 'Product ID',
    header: 'Default Output',
  },
  {
    key: InventoryExportType.DESCRIPTION,
    label: 'Description',
    header: 'Price, Value & Stock Overview',
  },
  {
    key: InventoryExportType.UNIT_PRICE,
    label: 'Unit Price',
    header: 'Price, Value & Stock Overview',
  },
  {
    key: InventoryExportType.UNIT_TYPE,
    label: 'Unit Type',
    header: 'Price, Value & Stock Overview',
  },
  {
    key: InventoryExportType.TOTAL_STOCK,
    label: 'Total Stock',
    header: 'Price, Value & Stock Overview',
  },
  {
    key: InventoryExportType.OUT_OF_STOCK,
    label: 'Out of Stock',
    header: 'Price, Value & Stock Overview',
  },
  {
    key: InventoryExportType.ON_ORDER,
    label: 'On Order',
    header: 'Price, Value & Stock Overview',
  },
  {
    key: InventoryExportType.STOCK_VALUE,
    label: 'Stock Value',
    header: 'Price, Value & Stock Overview',
  },
  {
    key: [InventoryExportType.WAREHOUSE_NAME, InventoryExportType.WAREHOUSE_IN_STOCK],
    label: 'All Warehouse Location/In Stock',
    header: 'Warehouse Location/In Stock & Volume Price Configuration',
  },
  {
    key: [
      InventoryExportType.DISCOUNT_RATE,
      InventoryExportType.DISCOUNT_PRICE,
      InventoryExportType.MIN_QUANTITY,
      InventoryExportType.MAX_QUANTITY,
    ],
    label: 'All Volume Price Configuration',
    header: 'Warehouse Location/In Stock & Volume Price Configuration',
  },
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
