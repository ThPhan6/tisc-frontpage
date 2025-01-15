import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { COMMON_TYPES } from '@/constants/util';
import { message } from 'antd';
import { request } from 'umi';

import {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
} from '@/components/Table/types';
import store from '@/reducers';
import { setSummaryFinancialRecords, setUnitType } from '@/reducers/summary';
import {
  CategoryEntity,
  type FinancialRecords,
  type IPriceAndInventoryForm,
  type PriceAndInventoryColumn,
  PriceAttribute,
} from '@/types';

import { AccordionItem } from '@/components/AccordionMenu';
import { UnitItem } from '@/components/Modal/UnitType';

import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

interface InventoryReponse {
  data: {
    pagination: PaginationResponse;
    inventories: PriceAttribute[];
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
  params?: PaginationRequestParams & { search?: string },
  callback?: (data: DataTableResponse) => void,
) => {
  request(`/api/inventory/get-list`, {
    method: 'GET',
    params,
  })
    .then((response: InventoryReponse) => {
      const { pagination, inventories } = response.data;

      callback?.({
        data: inventories,
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

export async function createInventory(data: Partial<IPriceAndInventoryForm>) {
  showPageLoading();
  return request<{ data: PriceAttribute }>(`/api/inventory/create`, {
    method: 'POST',
    data,
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.CREATE_INVENTORY_SUCCESS);
      hidePageLoading();
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.CREATE_INVENTORY_ERROR);
      hidePageLoading();
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
  showPageLoading();
  return request<{ data: PriceAndInventoryColumn }>(`/api/inventory/get-one/${id}`)
    .then((response) => {
      hidePageLoading();
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message || MESSAGE_NOTIFICATION.GET_INVENTORY_ERROR);
      hidePageLoading();
      return null;
    });
}

export async function updateInventory(id: string, payload: Partial<IPriceAndInventoryForm>) {
  showPageLoading();
  return request<boolean>(`/api/inventory/update/${id}`, {
    method: 'PATCH',
    data: payload,
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_INVENTORY_SUCCESS);
      hidePageLoading();
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_INVENTORY_ERROR);
      hidePageLoading();
      return false;
    });
}

export async function fetchUnitType() {
  return request<{ data: UnitItem[] }>(`/api/setting/common-type/${COMMON_TYPES.INVENTORY_UNIT}`, {
    method: 'GET',
  })
    .then((response) => store.dispatch(setUnitType(response.data)))
    .catch((error) => {
      console.log('getUnitTypeList error', error);
      return [];
    });
}

export async function getBrandCurrencySummary(brandId: string) {
  return request<{ data: FinancialRecords }>(`/api/inventory/summary/brand/${brandId}`, {
    method: 'GET',
  })
    .then((response) => {
      store.dispatch(setSummaryFinancialRecords(response.data));
    })
    .catch((error) => {
      return null;
    });
}

export async function exchangeCurrency(brandId: string, currency: string) {
  showPageLoading();
  return request<{ data: FinancialRecords }>(`/api/inventory/exchange/brand/${brandId}`, {
    method: 'POST',
    data: { to_currency: currency },
  })
    .then(() => {
      hidePageLoading();
      message.success('Exchange currency success');
      return true;
    })
    .catch((error) => {
      hidePageLoading();
      console.log('Exchange currency failed', error);
      message.error('Exchange currency unsuccessful');
      return false;
    });
}

export async function updateInventories(payload: any) {
  showPageLoading();
  return request<{ data: any }>(`/api/inventory/update/inventories`, {
    method: 'PATCH',
    data: payload,
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_INVENTORY_SUCCESS);
      return true;
    })
    .catch((error) => {
      hidePageLoading();
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_INVENTORY_ERROR);
      return false;
    });
}

export async function moveInventoryToCategory(inventoryId: string, categoryId: string) {
  return request<boolean>(`/api/inventory/move/${inventoryId}`, {
    method: 'PATCH',
    data: { categoryId },
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.MOVE_INVENTORY_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.MOVE_INVENTORY_ERROR);
      return false;
    });
}
