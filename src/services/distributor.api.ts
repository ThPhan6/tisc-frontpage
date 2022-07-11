import {
  IDataTableResponse,
  IPaginationRequest,
  IPaginationResponse,
  ISummaryResponse,
} from '@/components/Table/types';
import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { IDistributorForm, IDistributorListResponse } from '@/types/distributor.type';
import { message } from 'antd';
import { request } from 'umi';

interface IDistributorPaginationResponse {
  data: {
    pagination: IPaginationResponse;
    distributors: IDistributorListResponse[];
    summary: ISummaryResponse[];
  };
}
export async function createDistributor(data: IDistributorForm) {
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
  params: IPaginationRequest,
  callback: (data: IDataTableResponse) => void,
  //   brand_id: string,
) {
  request(`/api/distributor/get-list?brand_id=54bbfa0d-5fda-413b-81a9-1332081e2739`, {
    method: 'GET',
    params,
  })
    .then((response: IDistributorPaginationResponse) => {
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

export async function updateDistributor(id: string, data: IDistributorForm) {
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
