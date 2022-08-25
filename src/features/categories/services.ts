import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { STATUS_RESPONSE } from '@/constants/util';
import { message } from 'antd';
import { request } from 'umi';

import { CategoryBodyProps, CategoryNestedList } from './types';
import type {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
  SummaryResponse,
} from '@/components/Table/types';
import { setCategoryList } from '@/features/categories/reducers';
import store from '@/reducers';

interface CategoryPaginationResponse {
  data: {
    categories: CategoryNestedList[];
    pagination: PaginationResponse;
    summary: SummaryResponse[];
  };
}
export async function getProductCategoryPagination(
  params: PaginationRequestParams,
  callback: (data: DataTableResponse<CategoryNestedList[]>) => void,
) {
  request(`/api/category/get-list`, {
    method: 'GET',
    params,
  })
    .then((response: CategoryPaginationResponse) => {
      const { categories, pagination, summary } = response.data;
      callback({
        data: categories,
        pagination: {
          current: pagination.page,
          pageSize: pagination.page_size,
          total: pagination.total,
        },
        summary,
      });
    })
    .catch((error) => {
      message.error(error?.data?.message || MESSAGE_NOTIFICATION.GET_LIST_CATEGORY_ERROR);
    });
}

export async function getAllProductCategory() {
  // Don't call again
  if (store.getState().category.list.length) {
    return;
  }

  request(`/api/category/get-list`, {
    method: 'GET',
    params: {
      pageSize: 9999999999,
      page: 1,
    },
  })
    .then((response: CategoryPaginationResponse) => {
      store.dispatch(setCategoryList(response.data.categories));
    })
    .catch((error) => {
      message.error(error?.data?.message || MESSAGE_NOTIFICATION.GET_LIST_CATEGORY_ERROR);
    });
}

export async function createCategoryMiddleware(
  data: CategoryBodyProps,
  callback: (type: STATUS_RESPONSE, message?: string) => void,
) {
  request(`/api/category/create`, {
    method: 'POST',
    data,
  })
    .then(() => {
      callback(STATUS_RESPONSE.SUCCESS);
    })
    .catch((error) => {
      callback(
        STATUS_RESPONSE.ERROR,
        error?.data?.message || MESSAGE_NOTIFICATION.CREATE_CATEGORY_ERROR,
      );
    });
}

export async function updateCategoryMiddleware(
  id: string,
  data: CategoryBodyProps,
  callback: (type: STATUS_RESPONSE, message?: string) => void,
) {
  request(`/api/category/update/${id}`, {
    method: 'PUT',
    data,
  })
    .then(() => {
      callback(STATUS_RESPONSE.SUCCESS);
    })
    .catch((error) => {
      callback(
        STATUS_RESPONSE.ERROR,
        error?.data?.message || MESSAGE_NOTIFICATION.UPDATE_CATEGORY_ERROR,
      );
    });
}

export async function deleteCategoryMiddleware(id: string) {
  return request(`/api/category/delete/${id}`, {
    method: 'DELETE',
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.DELETE_CATEGORY_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message || MESSAGE_NOTIFICATION.DELETE_CATEGORY_ERROR);
      return false;
    });
}

export async function getOneCategoryMiddleware(
  id: string,
  callbackSuccess: (dataRes: CategoryBodyProps) => void,
  callbackError: (message?: string) => void,
) {
  request(`/api/category/get-one/${id}`, {
    method: 'get',
  })
    .then((response: { data: CategoryBodyProps }) => {
      callbackSuccess(response?.data);
    })
    .catch((error) => {
      callbackError(error?.data?.message || MESSAGE_NOTIFICATION.DELETE_CATEGORY_ERROR);
    });
}
