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
      message.error(error.message);
    });
}

export async function getOneConversionMiddleware(id: string) {
  return request<{ data: ConversionBodyProp }>(`/api/basis-conversion/get-one/${id}`, {
    method: 'get',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_ONE_CONVERSION_ERROR);
    });
}

export async function createConversionMiddleware(data: ConversionBodyProp) {
  return request<boolean>(`/api/basis-conversion/create`, {
    method: 'POST',
    data,
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.CREATE_CONVERSION_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message || MESSAGE_NOTIFICATION.CREATE_CONVERSION_ERROR);
      return false;
    });
}

export async function updateConversionMiddleware(id: string, data: ConversionBodyProp) {
  return request<boolean>(`/api/basis-conversion/update/${id}`, {
    method: 'PUT',
    data,
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_CONVERSION_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message || MESSAGE_NOTIFICATION.UPDATE_CONVERSION_ERROR);
      return false;
    });
}

export async function deleteConversionMiddleware(id: string) {
  return request<boolean>(`/api/basis-conversion/delete/${id}`, {
    method: 'DELETE',
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.DELETE_CONVERSION_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message || MESSAGE_NOTIFICATION.DELETE_CONVERSION_ERROR);
      return false;
    });
}
