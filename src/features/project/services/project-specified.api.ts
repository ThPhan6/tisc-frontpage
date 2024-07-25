import { COMMON_TYPES } from '@/constants/util';
import { message } from 'antd';
import { request } from 'umi';

import { getResponseMessage } from '@/helper/common';
import { bufferToArrayBufferCycle } from '@/helper/utils';

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
import { PdfDetail } from '@/pages/Designer/Project/tabs/ProductSpecification/type';

import { hidePageLoading } from '@/features/loading/loading';

export async function getSpecifiedProductsByBrand(
  { projectId, ...params }: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
) {
  request(`/api/project-product/get-list-by-brand/${projectId}`, { method: 'GET', params })
    .then((response: { data: GetDataListResponse & { data: SpecifiedProductByBrand[] } }) => {
      // console.log('response', response.data);
      const { data, summary } = response.data;
      callback({
        data: data,
        summary,
      });
    })
    .catch((error) => {
      // console.log('error', error);
      hidePageLoading();
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
      // console.log('error', error);
      hidePageLoading();
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
      // console.log('error', error);
      hidePageLoading();
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
      // console.log('updateProductSpecifiedStatus error', error);
      message.error(getResponseMessage('update', 'specified status', 'failed', error));
      return false;
    });
}

export async function getSpecifiedProductByPDF(id: string) {
  return request<{ data: PdfDetail }>(`/api/pdf/project/config/${id}`, { method: 'GET' })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(getResponseMessage('get-one', 'product specified', 'failed', error));
      return {} as PdfDetail;
    });
}

export async function getIssuingFor() {
  return request<{ data: { id: string; name: string }[] }>(
    `/api/setting/common-type/${COMMON_TYPES.ISSUE_FOR}`,
    { method: 'GET' },
  )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(getResponseMessage('get-list', 'issuing for', 'failed', error));
      return [] as { id: string; name: string }[];
    });
}

export async function createPDF(
  id: string,
  data: {
    location_id: string;
    issuing_for_id: string;
    revision: string;
    has_cover: boolean;
    document_title: string;
    template_ids: string[];
    issuing_date: string;
  },
) {
  return request(`/api/pdf/project/${id}/generate?responseType=base64`, {
    method: 'POST',
    data,
  })
    .then((response) => {
      hidePageLoading();
      return {
        filename: response.filename,
        fileBuffer: bufferToArrayBufferCycle(Buffer.from(response.data, 'base64')),
      };
    })
    .catch((error) => {
      hidePageLoading();
      message.error(error.data.message);
    });
}
