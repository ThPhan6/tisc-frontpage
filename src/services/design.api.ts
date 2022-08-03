import { DataMenuSummaryProps } from '@/components/MenuSummary/types';
import type {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
} from '@/components/Table/types';
import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { DesignFirm, DesignFirmDetail, LocationDesignFirm } from '@/types';
import { message } from 'antd';
import { request } from 'umi';

interface DesignFirmListResponse {
  designers: DesignFirm;
  pagination: PaginationResponse;
}

export async function getDesignFirmPagination(
  params: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
) {
  request(`/api/design/get-list`, {
    method: 'GET',
    params,
  })
    .then((response: { data: DesignFirmListResponse }) => {
      const { designers, pagination } = response.data;
      callback({
        data: designers,
        pagination: {
          current: pagination.page,
          pageSize: pagination.page_size,
          total: pagination.total,
        },
      });
    })
    .catch((error) => {
      console.log('error', error);
      message.error(error.message);
    });
}

export async function getOneDesignFirm(id: string) {
  return request<{ data: DesignFirmDetail }>(`/api/design/get-one/${id}`, { method: 'GET' })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_ONE_DESIGN_FIRM_ERROR);
    });
}

export async function getSummary() {
  return request<{ data: DataMenuSummaryProps }>(`/api/design/summary`, { method: 'GET' })
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_SUMMARY);
    });
}

export async function getLocationByDesignFirms(id: string) {
  return request<{ data: LocationDesignFirm[] }>(`/api/location/design/${id}`, { method: 'GET' })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_LOCATION_BY_DESIGN_FIRMS);
    });
}
