import { message } from 'antd';
import { request } from 'umi';

import { getResponseMessage } from '@/helper/common';

import {
  DataTableResponse,
  GetDataListResponse,
  PaginationRequestParams,
} from '@/components/Table/types';
import {
  ProductSpecifyStatus,
  SpecifiedProductByBrand,
  SpecifiedProductByMaterial,
  SpecifiedProductBySpace,
} from '@/features/project/types';

export async function getSpecifiedProductsByBrand(
  { projectId, ...params }: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
) {
  request(`/api/project-product/get-list-by-brand/${projectId}`, { method: 'GET', params })
    .then((response: { data: GetDataListResponse & { data: SpecifiedProductByBrand[] } }) => {
      console.log('response', response.data);
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
  request(`/api/project-product/get-list-by-material/${projectId}`, { method: 'GET', params })
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
  request(`/api/project-product/get-list-by-zone/${projectId}`, { method: 'GET', params })
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
  consideredId: string,
  data: {
    specified_status: ProductSpecifyStatus;
  },
) {
  return request(`/api/project-product/${consideredId}/update-specified-status`, {
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
