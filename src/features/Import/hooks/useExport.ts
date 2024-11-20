import { useEffect } from 'react';

import { INVENTORY_EXPORT_TYPE_LABELS } from '../constants';

import { filter, includes, union } from 'lodash';

import { setSelectExportType } from '@/features/Import/reducers';
import { InventoryExportType } from '@/features/Import/types/export.type';
import store, { useAppSelector } from '@/reducers';

export const useExport = () => {
  const open = useAppSelector((state) => state.import.open);
  const exportType = useAppSelector((state) => state.import.exportType);

  useEffect(() => {
    if (!open) return;

    store.dispatch(
      setSelectExportType(
        INVENTORY_EXPORT_TYPE_LABELS.map((type) => type.key as InventoryExportType),
      ),
    );
  }, [open]);

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
