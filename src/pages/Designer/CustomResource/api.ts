import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import { setSummaryCustomResource } from './reducer';
import { CustomResourceForm, CustomResourceType, CustomResources } from './type';
import { DataMenuSummaryProps } from '@/components/MenuSummary/types';
import {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
} from '@/components/Table/types';
import store from '@/reducers';
import { GeneralData } from '@/types';

interface ProjectPaginationResponse {
  data: {
    resources: CustomResources[];
    pagination: PaginationResponse;
  };
}

export async function getListVendorByBrandOrDistributor(
  { type, ...params }: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
) {
  request(`/api/custom-resource/get-list?type=${type}`, {
    method: 'GET',
    params,
  })
    .then((response: ProjectPaginationResponse) => {
      const { resources, pagination } = response.data;
      callback({
        data: resources,
        pagination: {
          current: pagination.page,
          pageSize: pagination.page_size,
          total: pagination.total,
        },
      });
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_LIST_VENDOR);
    });
}

export async function getCustomResourceSummary() {
  return request<{ data: DataMenuSummaryProps[] }>(`/api/custom-resource/summary`, {
    method: 'GET',
  })
    .then((res) => {
      store.dispatch(setSummaryCustomResource(res.data));
    })
    .catch((error) => {
      message.error(error?.data?.message);
    });
}

export async function deleteCustomResource(id: string) {
  return request<boolean>(`/api/custom-resource/delete/${id}`, { method: 'DELETE' })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.DELETE_CUSTOM_RESOURCE_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message);
      return false;
    });
}

export async function getAllCustomResource(type: CustomResourceType) {
  return request<{ data: GeneralData[] }>(`/api/custom-resource/get-all`, {
    method: 'GET',
    params: { type: type },
  })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      message.error(err?.data?.message ?? 'Failed to get list brand companies');
      return [] as GeneralData[];
    });
}

export async function createCustomResource(data: CustomResourceForm) {
  return request<boolean>(`/api/custom-resource/create`, { method: 'POST', data })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.CREATE_CUSTOM_RESOURCE_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message);
      return false;
    });
}

export async function getOneCustomResource(id: string) {
  return request<{ data: CustomResourceForm }>(`/api/custom-resource/get-one/${id}`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message);
      return {} as CustomResourceForm;
    });
}

export async function updateCustomResource(id: string, data: CustomResourceForm) {
  return request<boolean>(`/api/custom-resource/update/${id}`, { method: 'PUT', data })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_CUSTOM_RESOURCE_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message);
      return false;
    });
}
