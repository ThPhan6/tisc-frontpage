import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import type {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
  SummaryResponse,
} from '@/components/Table/types';
import type { BasisPresetListResponse, PresetsValueProp } from '@/types';

import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

interface CategoryPaginationResponse {
  data: {
    basis_presets: BasisPresetListResponse[];
    pagination: PaginationResponse;
    summary: SummaryResponse[];
  };
}
export async function getProductBasisPresetPagination(
  params: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
) {
  request(`/api/basis-preset/get-list`, {
    method: 'GET',
    params,
  })
    .then((response: CategoryPaginationResponse) => {
      const { basis_presets, pagination, summary } = response.data;
      callback({
        data: basis_presets,
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

export async function createPresetMiddleware(data: PresetsValueProp) {
  showPageLoading();
  return request<boolean>(`/api/basis-preset/create`, {
    method: 'POST',
    data,
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.CREATE_PRESET_SUCCESS);
      hidePageLoading();
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message || MESSAGE_NOTIFICATION.CREATE_PRESET_ERROR);
      hidePageLoading();
      return false;
    });
}

export async function deletePresetMiddleware(id: string) {
  showPageLoading();
  return request<boolean>(`/api/basis-preset/delete/${id}`, { method: 'DELETE' })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.DELETE_PRESET_SUCCESS);
      hidePageLoading();
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message || MESSAGE_NOTIFICATION.DELETE_PRESET_ERROR);
      hidePageLoading();
      return false;
    });
}

export async function updatePresetMiddleware(id: string, data: PresetsValueProp) {
  showPageLoading();
  return request<boolean>(`/api/basis-preset/update/${id}`, { method: 'PUT', data })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_PRESET_SUCCESS);
      hidePageLoading();
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message || MESSAGE_NOTIFICATION.UPDATE_PRESET_ERROR);
      hidePageLoading();
      return false;
    });
}

export async function getOnePresetMiddleware(id: string) {
  showPageLoading();
  return request<{ data: PresetsValueProp }>(`/api/basis-preset/get-one/${id}`, { method: 'GET' })
    .then((response) => {
      hidePageLoading();
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_ONE_PRESET_ERROR);
      hidePageLoading();
      return {} as PresetsValueProp;
    });
}
