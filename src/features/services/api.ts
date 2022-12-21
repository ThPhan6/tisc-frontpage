import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { COMMON_TYPES } from '@/constants/util';
import { message } from 'antd';
import { request } from 'umi';

import { setSummaryServices } from './reducer';
import { ServicesForm, ServicesResponse, SummaryService } from './type';
import {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
} from '@/components/Table/types';
import store from '@/reducers';
import { GeneralData } from '@/types';
import { UserDetail } from '@/types/user.type';

interface RevenuePaginationResponse {
  data: {
    data: ServicesResponse[];
    pagination: PaginationResponse;
  };
}
export async function getServicesSummary() {
  return request<{
    data: SummaryService;
  }>(`/api/invoice/summary`, { method: 'GET' })
    .then((response) => {
      store.dispatch(setSummaryServices(response.data));
    })
    .catch((error) => {
      message.error(error?.data?.message);
      return {} as SummaryService;
    });
}

export async function getServicesPagination(
  params: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
) {
  request(`/api/invoice`, { method: 'GET', params })
    .then((response: RevenuePaginationResponse) => {
      const { data, pagination } = response.data;
      callback({
        data: data,
        pagination: {
          current: pagination.page,
          pageSize: pagination.page_size,
          total: pagination.total,
        },
      });
    })
    .catch((error) => {
      message.error(error?.data?.message);
    });
}

export async function getOneService(id: string) {
  return request<{ data: ServicesResponse }>(`/api/invoice/${id}`, { method: 'GET' })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message);
      return {} as ServicesResponse;
    });
}

export async function createService(data: ServicesForm) {
  return request<boolean>(`/api/invoice`, { method: 'POST', data })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.CREATE_SERVICE_SUCCESS);
      return true;
    })
    .catch(() => {
      return false;
    });
}

export async function getServiceType() {
  return request<{ data: GeneralData[] }>(`/api/setting/common-type/${COMMON_TYPES.INVOICE}`, {
    method: 'GET',
  })
    .then((res) => {
      return res.data;
    })
    .catch(() => {
      return [] as GeneralData[];
    });
}

export async function getListOrderBy(id: string, type: number, role: number) {
  return request<{ data: { users: UserDetail[] } }>(
    `/api/team-profile/get-by-type-role-relation?type=${type}&role=${role}&relation_id=${id}`,
    { method: 'GET' },
  )
    .then((response) => {
      return response.data.users;
    })
    .catch((error) => {
      message.error(error?.data?.message);
      return [] as UserDetail[];
    });
}

export async function updateService(id: string, data: ServicesForm) {
  return request<boolean>(`/api/invoice/${id}`, { method: 'PATCH', data })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_SERVICE_SUCCESS);
      return true;
    })
    .catch(() => {
      return false;
    });
}

export async function sendBill(id: string) {
  return request<boolean>(`/api/invoice/${id}/bill`, { method: 'POST' })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.SENT_BILL_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message);
      return false;
    });
}

export async function sendRemind(id: string) {
  return request<boolean>(`/api/invoice/${id}/send-reminder`, { method: 'POST' })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.SENT_REMIND_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message);
      return false;
    });
}

export async function markAsPaid(id: string) {
  return request<boolean>(`/api/invoice/${id}/paid`, { method: 'POST' })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.MARK_AS_PAID_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message);
      return false;
    });
}

export async function deleteService(id: string) {
  return request<boolean>(`/api/invoice/${id}/delete`, { method: 'DELETE' })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.DELETE_SERVICE_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message);
      return false;
    });
}

export async function getServicePDF(id: string) {
  return request(`/api/invoice/${id}/invoice-pdf`, { method: 'GET', responseType: 'arrayBuffer' })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      message.error(error?.data?.message);
    });
}
