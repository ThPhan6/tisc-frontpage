import { request } from 'umi';
import { message } from 'antd';
import type { CategoryBodyProp, ICategoryListResponse } from '@/types';
import type {
  IDataTableResponse,
  IPaginationRequest,
  IPaginationResponse,
  ISummaryResponse,
} from '@/components/Table/types';
import { STATUS_RESPONSE } from '@/constants/util';
import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { setList } from '@/reducers/category';
import store from '@/reducers';

interface ICategoryPaginationResponse {
  data: {
    categories: ICategoryListResponse[];
    pagination: IPaginationResponse;
    summary: ISummaryResponse[];
  };
}
export async function getProductCategoryPagination(
  params: IPaginationRequest,
  callback: (data: IDataTableResponse) => void,
) {
  request(`/api/category/get-list`, {
    method: 'GET',
    params,
  })
    .then((response: ICategoryPaginationResponse) => {
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
  request(`/api/category/get-list`, {
    method: 'GET',
    params: {
      pageSize: 9999999999,
      page: 1,
    },
  })
    .then((response: ICategoryPaginationResponse) => {
      store.dispatch(setList(response.data.categories));
    })
    .catch((error) => {
      message.error(error?.data?.message || MESSAGE_NOTIFICATION.GET_LIST_CATEGORY_ERROR);
    });
}

export async function createCategoryMiddleware(
  data: CategoryBodyProp,
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
  data: CategoryBodyProp,
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

export async function deleteCategoryMiddleware(
  id: string,
  callback: (type: STATUS_RESPONSE, message?: string) => void,
) {
  request(`/api/category/delete/${id}`, {
    method: 'DELETE',
  })
    .then(() => {
      callback(STATUS_RESPONSE.SUCCESS);
    })
    .catch((error) => {
      callback(
        STATUS_RESPONSE.ERROR,
        error?.data?.message || MESSAGE_NOTIFICATION.DELETE_CATEGORY_ERROR,
      );
    });
}

export async function getOneCategoryMiddleware(
  id: string,
  callbackSuccess: (dataRes: CategoryBodyProp) => void,
  callbackError: (message?: string) => void,
) {
  request(`/api/category/get-one/${id}`, {
    method: 'get',
  })
    .then((response: { data: CategoryBodyProp }) => {
      callbackSuccess(response?.data);
    })
    .catch((error) => {
      callbackError(error?.data?.message || MESSAGE_NOTIFICATION.DELETE_CATEGORY_ERROR);
    });
}
