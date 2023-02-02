import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import type {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
  SummaryResponse,
} from '@/components/Table/types';
import type { BasisConversionListResponse, ConversionBodyProp } from '@/types';

import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

interface CategoryPaginationResponse {
  data: {
    basis_conversions: BasisConversionListResponse[];
    pagination: PaginationResponse;
    summary: SummaryResponse[];
  };
}
export async function getProductBasisConversionPagination(
  params: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
) {
  request(`/api/basis-conversion/get-list`, {
    method: 'GET',
    params,
  })
    .then((response: CategoryPaginationResponse) => {
      const { basis_conversions, pagination, summary } = response.data;
      callback({
        data: basis_conversions,
        pagination: {
          current: pagination.page,
          pageSize: pagination.page_size,
          total: pagination.total,
        },
        summary,
      });
    })
    .catch((error) => {
      console.log('error', error);
      hidePageLoading();
      message.error(error.message);
    });
}

export async function getOneConversionMiddleware(id: string) {
  showPageLoading();
  return request<{ data: ConversionBodyProp }>(`/api/basis-conversion/get-one/${id}`, {
    method: 'get',
  })
    .then((response) => {
      hidePageLoading();
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_ONE_CONVERSION_ERROR);
      hidePageLoading();
      return {} as ConversionBodyProp;
    });
}

export async function createConversionMiddleware(data: ConversionBodyProp) {
  showPageLoading();
  return request<boolean>(`/api/basis-conversion/create`, {
    method: 'POST',
    data,
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.CREATE_CONVERSION_SUCCESS);
      hidePageLoading();
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message || MESSAGE_NOTIFICATION.CREATE_CONVERSION_ERROR);
      hidePageLoading();
      return false;
    });
}

export async function updateConversionMiddleware(id: string, data: ConversionBodyProp) {
  showPageLoading();
  return request<boolean>(`/api/basis-conversion/update/${id}`, {
    method: 'PUT',
    data,
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_CONVERSION_SUCCESS);
      hidePageLoading();
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message || MESSAGE_NOTIFICATION.UPDATE_CONVERSION_ERROR);
      hidePageLoading();
      return false;
    });
}

export async function deleteConversionMiddleware(id: string) {
  showPageLoading();
  return request<boolean>(`/api/basis-conversion/delete/${id}`, {
    method: 'DELETE',
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.DELETE_CONVERSION_SUCCESS);
      hidePageLoading();
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message || MESSAGE_NOTIFICATION.DELETE_CONVERSION_ERROR);
      hidePageLoading();
      return false;
    });
}
