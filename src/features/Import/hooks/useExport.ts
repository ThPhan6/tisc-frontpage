import { exportInventoryCSV } from '@/services';
import { camelCase, filter, includes, mapKeys, omit, startCase, union } from 'lodash';

import { setSelectedFields } from '@/features/Import/reducers';
import { ExportRequest, InventoryExportType } from '@/features/Import/types/export.type';
import store, { useAppSelector } from '@/reducers';

import Papa from 'papaparse';

const fieldsToExclude = [
  'back_order',
  'id',
  'on_order',
  'total_stock',
  'out_stock',
  'image',
  'inventory_category_id',
  'stockValue',
  'created_at',
  'updated_at',
];

export const useExport = () => {
  const selectedFiels = useAppSelector((state) => state.import.selectedFiels);

  const mappingData = (data: any) => {
    const formatHeader = (key: string): string => {
      if (key.startsWith('#')) return key;
      return startCase(camelCase(key));
    };

    const filteredData = data.map((item: Record<string, any>) => omit(item, fieldsToExclude));

    const headers = Object.keys(filteredData[0] || {}).reduce(
      (result, key) => ({
        ...result,
        [key]: formatHeader(key),
      }),
      {},
    );

    return filteredData.map((item: Record<string, any>) =>
      mapKeys(item, (_value, key) => (headers as any)[key]),
    );
  };

  const handleExport = (categoryId: string) => async () => {
    const payload: ExportRequest = {
      category_id: categoryId,
      types: selectedFiels,
    };

    const res = await exportInventoryCSV(payload);

    const csv = Papa.unparse(mappingData(res));

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'export_inventory.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCheckboxChange = (exportType: InventoryExportType) => () => {
    if (includes(selectedFiels, exportType)) {
      store.dispatch(setSelectedFields(filter(selectedFiels, (item) => item !== exportType)));
      return;
    }

    store.dispatch(setSelectedFields(union(selectedFiels, [exportType])));
  };

  return {
    selectedFiels,

    handleCheckboxChange,
    handleExport,
  };
};
