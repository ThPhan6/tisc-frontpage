import { downloadFile } from '@/helper/utils';
import { exportInventoryCSV } from '@/services';
import { filter, includes, union } from 'lodash';

import { setSelectedFields } from '@/features/Import/reducers';
import { ExportRequest, InventoryExportType } from '@/features/Import/types/export.type';
import store, { useAppSelector } from '@/reducers';

export const useExport = () => {
  const exportType = useAppSelector((state) => state.import.exportType);

  const handleExport = (categoryId: string) => async () => {
    const payload: ExportRequest = {
      category_id: categoryId,
      types: exportType,
    };
    const res = await exportInventoryCSV(payload);
    downloadFile([res], 'export_inventory.csv', { type: 'text/csv' });
  };

  const handleCheckboxChange = (type: InventoryExportType) => () => {
    if (includes(exportType, type)) {
      store.dispatch(setSelectedFields(filter(exportType, (item) => item !== type)));
      return;
    }

    store.dispatch(setSelectedFields(union(exportType, [type])));
  };

  return {
    exportType,

    handleCheckboxChange,
    handleExport,
  };
};
