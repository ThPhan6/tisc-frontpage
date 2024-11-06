import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import { Warehouse } from '@/types';

import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

export const createWarehouse = async (data: Warehouse) => {
  showPageLoading();

  return request<boolean>(`/api/warehouse/create`, {
    method: 'POST',
    data,
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.CREATE_WAREHOUSE_SUCCESS);
      hidePageLoading();
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.CREATE_WAREHOUSE_ERROR);
      hidePageLoading();
      return false;
    });
};

export const getListWithInventory = async (inventoryId: string): Promise<Warehouse | null> => {
  showPageLoading();
  return request<{ data: Warehouse }>(`/api/warehouse/get-list/inventory/${inventoryId}`)
    .then((response) => {
      hidePageLoading();
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message || 'Get list with inventory failed');
      hidePageLoading();
      return null;
    });
};

export const updateMultiple = async (payload: {
  [warehouse_id: string]: { changeQuantity: number };
}) => {
  showPageLoading();
  return request<boolean>(`/api/warehouse/update-multiple`, {
    method: 'POST',
    data: payload,
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_WAREHOUSE_SUCCESS);
      hidePageLoading();
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_WAREHOUSE_ERROR);
      hidePageLoading();
      return false;
    });
};

export async function deleteWarehouse(id: string) {
  return request<boolean>(`/api/warehouse/delete/${id}`, { method: 'DELETE' })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.DELETE_WAREHOUSE_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.DELETE_WAREHOUSE_ERROR);
      return false;
    });
}
