import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import { ExportRequest } from '@/features/Import/types/export.type';
import { InventoryImportRequest } from '@/types';

import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

export const exportInventoryCSV = async (data: ExportRequest) => {
  showPageLoading();
  return request<string>(`/api/inventory/export`, {
    method: 'POST',
    data,
  })
    .then((res) => {
      message.success('Export CSV successfully');
      hidePageLoading();
      return res;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? 'Export CSV failed');
      hidePageLoading();
      return '';
    });
};

export const importInventoryCSV = (data: InventoryImportRequest[]) => {
  showPageLoading();
  return request<boolean>(`/api/inventory/import`, {
    method: 'POST',
    data,
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.IMPORT_INVENTORY_SUCCESS);
      hidePageLoading();
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.IMPORT_INVENTORY_ERROR);
      hidePageLoading();
      return false;
    });
};
