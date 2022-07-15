import { MESSAGE_NOTIFICATION } from '@/constants/message';
import type {
  IDataTableResponse,
  IPaginationRequest,
  IPaginationResponse,
  ISummaryResponse,
} from '@/components/Table/types';
import { message } from 'antd';
import { request } from 'umi';
import { IEmailAutoRadioListProps, IEmailAutoRespondForm } from '@/types';

interface IEmailAutoPaginationResponse {
  data: {
    auto_emails: IEmailAutoRespondForm[];
    pagination: IPaginationResponse;
    summary: ISummaryResponse[];
  };
}

export async function getEmailAutoPagination(
  params: IPaginationRequest,
  callback: (data: IDataTableResponse) => void,
) {
  request(`/api/email-auto/get-list`, { method: 'GET', params })
    .then((response: IEmailAutoPaginationResponse) => {
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
  return request<{ data: IEmailAutoRespondForm }>(`/api/email-auto/get-one/${id}`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error.message?.data ?? MESSAGE_NOTIFICATION.GET_ONE_EMAIL_AUTO_ERROR);
      return {} as IEmailAutoRespondForm;
    });
}

export async function getTargetedForList() {
  return request<IEmailAutoRadioListProps[]>(`/api/email-auto/get-list-targeted-for`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      message.error(
        error.message?.data ?? MESSAGE_NOTIFICATION.GET_TARGETEDFOR_LIST_EMAIL_AUTO_ERROR,
      );
      return [] as IEmailAutoRadioListProps[];
    });
}

export async function getTopicList() {
  return request<IEmailAutoRadioListProps[]>(`/api/email-auto/get-list-topic`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      message.error(error.message?.data ?? MESSAGE_NOTIFICATION.GET_TOPIC_LIST_EMAIL_AUTO_ERROR);
      return [] as IEmailAutoRadioListProps[];
    });
}

export async function updateEmailAuto(id: string, data: IEmailAutoRespondForm) {
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
