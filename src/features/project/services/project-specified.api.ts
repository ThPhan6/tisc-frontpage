import {
  DataTableResponse,
  GetDataListResponse,
  PaginationRequestParams,
} from '@/components/Table/types';
import {
  SpecifiedProductBrand,
  SpecifiedProductMaterial,
  SpecifiedProductSpace,
} from '@/features/project/types';
import { message } from 'antd';
import { request } from 'umi';

export async function getSpecifiedProductsByBrand(
  { projectId, ...params }: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
) {
  request(`/api/specified-product/get-list-brand/${projectId}`, { method: 'GET', params })
    .then((response: { data: GetDataListResponse & { data: SpecifiedProductBrand[] } }) => {
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
    .then((response: { data: GetDataListResponse & { data: SpecifiedProductMaterial[] } }) => {
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
    .then((response: { data: GetDataListResponse & { data: SpecifiedProductSpace[] } }) => {
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
