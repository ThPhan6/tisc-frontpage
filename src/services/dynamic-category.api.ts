import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
} from '@/components/Table/types';
import { CategoryEntity } from '@/types';

import { AccordionItem } from '@/components/AccordionMenu';
import { PriceAndInventoryAttribute } from '@/pages/Brand/PricesAndInventories/PriceAndInventoryForm';

import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

interface InventoryReponse {
  data: {
    pagination: PaginationResponse;
    partners: PriceAndInventoryAttribute[];
  };
}

export async function getDynamicCategories() {
  showPageLoading();

  return request<{ data: AccordionItem[] }>(`/api/dynamic-category/get-list`, {
    method: 'GET',
  })
    .then((response) => {
      hidePageLoading();
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_LIST_CATEGORY_ERROR);
      hidePageLoading();
      return [];
    });
}

export async function getGroupCategories() {
  return request<{ data: AccordionItem[] }>(`/api/dynamic-category/group`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? 'Get group categories error');
      return [];
    });
}

export async function createDynamicCategory(data: Partial<CategoryEntity>) {
  return request<{ data: AccordionItem }>(`/api/dynamic-category/create`, {
    method: 'POST',
    data,
  })
    .then((response) => {
      message.success(MESSAGE_NOTIFICATION.CREATE_CATEGORY_SUCCESS);
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.CREATE_CATEGORY_ERROR);
      return false;
    });
}

export async function updateDynamicCategory(id: string, name: string) {
  return request<boolean>(`/api/dynamic-category/update/${id}`, {
    method: 'PUT',
    data: { name },
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_CATEGORY_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_CATEGORY_ERROR);
      return false;
    });
}

export async function deleteDynamicCategory(id: string) {
  return request<boolean>(`/api/dynamic-category/delete/${id}`, {
    method: 'DELETE',
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.DELETE_CATEGORY_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.DELETE_CATEGORY_SUCCESS);
      return false;
    });
}

export async function moveCategoryToSubCategory(sub_id: string, parent_id: string) {
  return request<boolean>(`/api/dynamic-category/${sub_id}/move`, {
    method: 'POST',
    data: { parent_id },
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.MOVE_CATEGORY_TO_SUB_CATEGORY_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(
        error?.data?.message ?? MESSAGE_NOTIFICATION.MOVE_CATEGORY_TO_SUB_CATEGORY_ERROR,
      );
      return false;
    });
}

export const getListInventories = (
  params: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
) => {
  request(`/api/inventory/get-list`, {
    method: 'GET',
    params,
  })
    .then((response: InventoryReponse) => {
      const { pagination } = response as any;

      callback({
        data: response.data,
        pagination: {
          current: pagination.page,
          pageSize: pagination.page_size,
          total: pagination.total,
        },
      });
    })
    .catch((error) => {
      message.error(error.message);
      hidePageLoading();
    });
};

export async function createInventory(data: PriceAndInventoryAttribute) {
  return request<{ data: PriceAndInventoryAttribute }>(`/api/inventory/create`, {
    method: 'POST',
    data,
  })
    .then((response) => {
      message.success(MESSAGE_NOTIFICATION.CREATE_INVENTORY_SUCCESS);
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.CREATE_INVENTORY_ERROR);
      return false;
    });
}

export async function deleteInventory(id: string) {
  return request<boolean>(`/api/inventory/delete/${id}`, {
    method: 'DELETE',
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.DELETE_INVENTORY_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.DELETE_INVENTORY_ERROR);
      return false;
    });
}

export async function getInventory(id: string) {
  return request<{ data: PriceAndInventoryAttribute }>(`/api/inventory/get-one/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      message.error(error?.data?.message || MESSAGE_NOTIFICATION.GET_PARTNER_ERROR);
      return null;
    });
}
