import {
  DataTableResponse,
  GetDataListResponse,
  PaginationRequestParams,
} from '@/components/Table/types';
import {
  SpecifiedProductByBrand,
  SpecifiedProductByMaterial,
  SpecifiedProductBySpace,
  SpecifyStatus,
} from '@/features/project/types';
import { getResponseMessage } from '@/helper/common';
import { message } from 'antd';
import { request } from 'umi';

export async function getSpecifiedProductsByBrand(
  { projectId, ...params }: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
) {
  request(`/api/specified-product/get-list-brand/${projectId}`, { method: 'GET', params })
    .then((response: { data: GetDataListResponse & { data: SpecifiedProductByBrand[] } }) => {
      const { data, summary } = response.data;
      callback({
        data: data,
        summary,
      });
    })
    .catch((error) => {
      console.log('error', error);
      message.error(error.message);
    });
}

export async function getSpecifiedProductByMaterial(
  { projectId, ...params }: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
) {
  request(`/api/specified-product/get-list-material/${projectId}`, { method: 'GET', params })
    .then((response: { data: GetDataListResponse & { data: SpecifiedProductByMaterial[] } }) => {
      const { data, summary } = response.data;
      callback({
        data: data,
        summary,
      });
    })
    .catch((error) => {
      console.log('error', error);
      message.error(error.message);
    });
}

export async function getSpecifiedProductBySpace(
  { projectId, ...params }: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
) {
  request(`/api/specified-product/get-list-zone/${projectId}`, { method: 'GET', params })
    .then((response: { data: GetDataListResponse & { data: SpecifiedProductBySpace[] } }) => {
      const { data, summary } = response.data;
      data[0].id = 'entire_project';
      callback({
        data: data,
        summary,
      });
    })
    .catch((error) => {
      console.log('error', error);
      message.error(error.message);
    });
}

export async function updateProductSpecifiedStatus(
  specifyId: string,
  data: {
    status: SpecifyStatus;
  },
) {
  return request(`/api/specified-product/update-status/${specifyId}`, {
    method: 'PATCH',
    data,
  })
    .then(() => {
      message.success(getResponseMessage('update', 'specified status'));
      return true;
    })
    .catch((error) => {
      console.log('updateProductSpecifiedStatus error', error);
      message.error(getResponseMessage('update', 'specified status', 'failed', error));
      return false;
    });
}

export async function removeSpecifiedPromConsider(specifyId: string) {
  return request(`/api/specified-product/delete/${specifyId}`, {
    method: 'DELETE',
  })
    .then(() => {
      message.success(getResponseMessage('delete', 'product from project'));
      return true;
    })
    .catch((error) => {
      console.log('removeSpecifiedPromConsider error', error);
      message.error(getResponseMessage('delete', 'product from project', 'failed', error));
      return false;
    });
}
