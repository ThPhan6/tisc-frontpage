import { filter, includes, union } from 'lodash';

import { setSelectExportType } from '@/features/Import/reducers';
import { InventoryExportType } from '@/features/Import/types/export.type';
import store, { useAppSelector } from '@/reducers';

export const useExport = () => {
  const exportType = useAppSelector((state) => state.import.exportType);

  const handleCheckboxChange = (type: InventoryExportType) => () => {
    if (includes(exportType, type)) {
      store.dispatch(setSelectExportType(filter(exportType, (item) => item !== type)));
      return;
    }

    store.dispatch(setSelectExportType(union(exportType, [type])));
  };

  return {
    exportType,

    ///
    handleCheckboxChange,
  };
};
