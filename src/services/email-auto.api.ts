import { message } from 'antd';
import { request } from 'umi';

import { getResponseMessage } from '@/helper/common';

import type {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
  SummaryResponse,
} from '@/components/Table/types';
import { EmailTemplate, RadioItem } from '@/types';

import { hidePageLoading } from '@/features/loading/loading';

interface EmailTemplatePaginationResponse {
  data: {
    auto_emails: EmailTemplate[];
    pagination: PaginationResponse;
    summary: SummaryResponse[];
  };
}

export async function getEmailTemplatePagination(
  params: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
) {
  request(`/api/email-auto/get-list`, { method: 'GET', params })
    .then((response: EmailTemplatePaginationResponse) => {
      const { auto_emails, pagination, summary } = response.data;
      callback({
        data: auto_emails,
        pagination: {
          current: pagination.page,
          pageSize: pagination.page_size,
          total: pagination.total,
        },
        summary: summary,
      });
    })
    .catch((error) => {
      message.error(getResponseMessage('get-list', 'email autoresponder', 'failed', error));
    });
}

export async function getOneEmailAuto(id: string) {
  return request<{ data: EmailTemplate }>(`/api/email-auto/get-one/${id}`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(getResponseMessage('get-one', 'email autoresponder', 'failed', error));
      return {} as EmailTemplate;
    });
}

export async function getTargetedForList() {
  return request<RadioItem[]>(`/api/email-auto/get-list-targeted-for`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      message.error(getResponseMessage('get-list', 'targeted', 'failed', error));
      return [] as RadioItem[];
    });
}

export async function getTopicList() {
  return request<RadioItem[]>(`/api/email-auto/get-list-topic`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      message.error(getResponseMessage('update', 'email topic', 'failed', error));
      return [] as RadioItem[];
    });
}

export async function updateEmailAuto(id: string, data: EmailTemplate) {
  return request<boolean>(`/api/email-auto/update/${id}`, { method: 'PUT', data })
    .then(() => {
      message.success(getResponseMessage('update', 'email autoresponder'));
      hidePageLoading();
      return true;
    })
    .catch((error) => {
      message.error(getResponseMessage('update', 'email autoresponder', 'failed', error));
      hidePageLoading();
      return false;
    });
}
