import { message } from 'antd';
import { request } from 'umi';

import { getResponseMessage } from '@/helper/common';

import { CreateDocumentationResquestBody, Documentation } from './types';
import {
  DataTableResponse,
  GetDataListResponse,
  PaginationRequestParams,
} from '@/components/Table/types';

export enum DocumentType {
  policy = 1,
  // howTo = 2, 3, 4
}

export async function getPolicyTemplates(
  params: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
) {
  request(`/api/documentation/get-list`, {
    method: 'GET',
    params: {
      ...params,
      type: DocumentType.policy,
    },
  })
    .then((response: { data: GetDataListResponse & { documentations: Documentation[] } }) => {
      const { documentations, pagination, summary } = response.data;
      callback({
        data: documentations,
        pagination: {
          current: pagination.page,
          pageSize: pagination.page_size,
          total: pagination.total,
        },
        summary: summary,
      });
    })
    .catch((error) => {
      message.error(getResponseMessage('get-list', 'documentation', 'failed', error));
    });
}

export async function getOnePolicyTemplete(id: string) {
  return request<{ data: Documentation }>(`/api/documentation/get-one/${id}`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(getResponseMessage('get-one', 'documentation', 'failed', error));
      return {} as Documentation;
    });
}

export async function updatePolicyTemplate(id: string, data: CreateDocumentationResquestBody) {
  return request<boolean>(`/api/documentation/update/${id}`, { method: 'PUT', data })
    .then(() => {
      message.success(getResponseMessage('update', 'documentation'));
      return true;
    })
    .catch((error) => {
      message.error(getResponseMessage('update', 'documentation', 'failed', error));
      return false;
    });
}
