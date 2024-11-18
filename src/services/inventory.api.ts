import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import { IPriceAndInventoryForm } from '@/types';

import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

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

export const exportInventoryCSV = () => {};
