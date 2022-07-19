import type {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
  SummaryResponse,
} from '@/components/Table/types';
import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { EmailTemplate, RadioItem } from '@/types';
import { message } from 'antd';
import { request } from 'umi';

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
      message.error(error.message?.data ?? MESSAGE_NOTIFICATION.GET_LIST_EMAIL_AUTO_ERROR);
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
      message.error(error.message?.data ?? MESSAGE_NOTIFICATION.GET_ONE_EMAIL_AUTO_ERROR);
      return {} as EmailTemplate;
    });
}

export async function getTargetedForList() {
  return request<RadioItem[]>(`/api/email-auto/get-list-targeted-for`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      message.error(
        error.message?.data ?? MESSAGE_NOTIFICATION.GET_TARGETEDFOR_LIST_EMAIL_AUTO_ERROR,
      );
      return [] as RadioItem[];
    });
}

export async function getTopicList() {
  return request<RadioItem[]>(`/api/email-auto/get-list-topic`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      message.error(error.message?.data ?? MESSAGE_NOTIFICATION.GET_TOPIC_LIST_EMAIL_AUTO_ERROR);
      return [] as RadioItem[];
    });
}

export async function updateEmailAuto(id: string, data: EmailTemplate) {
  return request<boolean>(`/api/email-auto/update/${id}`, { method: 'PUT', data })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_EMAIL_AUTO_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error.message?.data ?? MESSAGE_NOTIFICATION.UPDATE_EMAIL_AUTO_ERROR);
      return false;
    });
}
