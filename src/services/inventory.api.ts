import { message } from 'antd';
import { request } from 'umi';

import { ExportRequest } from '@/features/Import/types/export.type';

import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

import { MESSAGE_NOTIFICATION } from '@/constants/message';

import { IPriceAndInventoryForm } from '@/types';

export const exportInventoryCSV = async (data: ExportRequest) => {
  showPageLoading();
  return request<{ data: any }>(`/api/inventory/export`, {
    method: 'POST',
    data,
  })
    .then((res) => {
      message.success('Export CSV successfully');
      hidePageLoading();
      return res.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? 'Export CSV failed');
      hidePageLoading();
      return {};
    });
};

export const importInventoryCSV = (data: Partial<IPriceAndInventoryForm>[]) => {
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
