import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import { MaterialProductCodeMainList, MaterialProductForm } from './type';
import {
  DataTableResponse,
  PaginationRequestParams,
  SummaryResponse,
} from '@/components/Table/types';

import { hidePageLoading, showPageLoading } from '../loading/loading';

interface MaterialProductCodePaginationResponse {
  data: {
    material_codes: MaterialProductCodeMainList[];
    summary: SummaryResponse[];
  };
}
export async function getMaterialProductCodeList(
  { designId, ...params }: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
) {
  request(`/api/material-code/get-list?design_id=${designId}`, {
    method: 'GET',
    params,
  })
    .then((response: MaterialProductCodePaginationResponse) => {
      const { material_codes, summary } = response.data;
      callback({
        data: material_codes,
        summary,
      });
    })
    .catch((error) => {
      message.error(error.message);
      hidePageLoading();
    });
}

export async function createMaterialProductCode(data: MaterialProductForm) {
  showPageLoading();
  return request<boolean>(`/api/material-code/create`, { method: 'POST', data })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.CREATE_MATERIAL_PRODUCT_CODE_SUCCESS);
      hidePageLoading();
      return true;
    })
    .catch((error) => {
      message.error(
        error?.data?.message || MESSAGE_NOTIFICATION.CREATE_MATERIAL_PRODUCT_CODE_ERROR,
      );
      hidePageLoading();
      return false;
    });
}

export async function getOneMaterialProductCode(id: string) {
  showPageLoading();
  return request<{ data: MaterialProductForm }>(`/api/material-code/get-one/${id}`, {
    method: 'GET',
  })
    .then((response) => {
      hidePageLoading();
      return response.data;
    })
    .catch((error) => {
      message.error(
        error?.data?.message || MESSAGE_NOTIFICATION.GET_ONE_MATERIAL_PRODUCT_CODE_ERROR,
      );
      hidePageLoading();
      return {} as MaterialProductForm;
    });
}

export async function deleteMaterialProductCode(id: string) {
  return request<boolean>(`/api/material-code/delete/${id}`, { method: 'DELETE' })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.DELETE_MATERIAL_PRODUCT_CODE_SUCCESS);
      hidePageLoading();
      return true;
    })
    .catch((error) => {
      message.error(
        error?.data?.message || MESSAGE_NOTIFICATION.DELETE_MATERIAL_PRODUCT_CODE_ERROR,
      );
      hidePageLoading();
      return false;
    });
}

export async function updateMaterialProductCode(id: string, data: MaterialProductForm) {
  showPageLoading();
  return request<boolean>(`/api/material-code/update/${id}`, { method: 'PUT', data })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_MATERIAL_PRODUCT_CODE_SUCCESS);
      hidePageLoading();
      return true;
    })
    .catch((error) => {
      message.error(
        error?.data?.message || MESSAGE_NOTIFICATION.DELETE_MATERIAL_PRODUCT_CODE_ERROR,
      );
      hidePageLoading();
      return false;
    });
}
