import {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
  SummaryResponse,
} from '@/components/Table/types';
import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { Distributor, DistributorForm, DistributorDetail } from '@/types/distributor.type';
import { message } from 'antd';
import { request } from 'umi';

interface DistributorPaginationResponse {
  data: {
    pagination: PaginationResponse;
    distributors: Distributor[];
    summary: SummaryResponse[];
  };
}
export async function createDistributor(data: DistributorForm) {
  return request<boolean>('/api/distributor/create', { method: 'POST', data })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.CREATE_DISTRIBUTOR_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.CREATE_DISTRIBUTOR_ERROR);
      return false;
    });
}

export async function getDistributorPagination(
  params: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
) {
  request(`/api/distributor/get-list`, {
    method: 'GET',
    params,
  })
    .then((response: DistributorPaginationResponse) => {
      const { distributors, pagination, summary } = response.data;
      callback({
        data: distributors,
        pagination: {
          current: pagination.page,
          pageSize: pagination.page_size,
          total: pagination.total,
        },
        summary,
      });
    })
    .catch((error) => {
      message.error(error.message);
    });
}

export async function deleteDistributor(id: string) {
  return request<boolean>(`/api/distributor/delete/${id}`, { method: 'DELETE' })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.DELETE_DISTRIBUTOR_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.DELETE_DISTRIBUTOR_ERROR);
      return false;
    });
}

export async function updateDistributor(id: string, data: DistributorForm) {
  return request<boolean>(`/api/distributor/update/${id}`, { method: 'PUT', data })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_DISTRIBUTOR_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_ATTRIBUTE_ERROR);
      return false;
    });
}

export async function getOneDistributor(id: string) {
  return request<{ data: DistributorDetail }>(`/api/distributor/get-one/${id}`, { method: 'GET' })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_ONE_DISTRIBUTOR_ERROR);
    });
}
