import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import {
  GeneralInquiryDesignFirm,
  GeneralInquiryProps,
  GeneralInquirySummaryData,
  InquiryMessageOfGeneralInquiry,
  InquiryMessageTask,
} from '../types';
import {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
} from '@/components/Table/types';
import { GeneralData } from '@/types';

interface GeneralInquiryPaginationResponse {
  data: {
    generalInquiries: GeneralInquiryProps[];
    pagination: PaginationResponse;
  };
}

export async function getGeneralInquiryPagination(
  params: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
) {
  request(`/api/general-inquiry/get-list`, {
    method: 'GET',
    params,
  })
    .then((response: GeneralInquiryPaginationResponse) => {
      const { generalInquiries, pagination } = response.data;
      callback({
        data: generalInquiries,
        pagination: {
          current: pagination.page,
          pageSize: pagination.page_size,
          total: pagination.total,
        },
      });
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_GENERAL_INQUIRY_LIST_FAILED);
    });
}

interface ActionTaskPaginationResponse {
  data: {
    generalInquiries: InquiryMessageTask[];
    pagination: PaginationResponse;
  };
}

export async function getActionTaskPagination(
  params: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
) {
  request(`/api/inquiry-message/action-task`, {
    method: 'GET',
    params,
  })
    .then((response: ActionTaskPaginationResponse) => {
      callback({
        data: response.data,
      });
    })
    .catch((error) => {
      message.error(
        error?.data?.message ?? MESSAGE_NOTIFICATION.GET_INQUIRY_MESSAGE_ACTION_TASK_ERROR,
      );
    });
}

export async function getGeneralInquirySummary() {
  return request<GeneralInquirySummaryData>(`/api/general-inquiry/get-summary`, { method: 'GET' })
    .then((res) => res)
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_GENERAL_INQUIRY_SUMMARY_ERROR);
      return {} as GeneralInquirySummaryData;
    });
}

export async function getGeneralInquiryDesignFirm() {
  return request<GeneralInquiryDesignFirm>(`/api/general-inquiry/design-firm`, { method: 'GET' })
    .then((res) => res)
    .catch((error) => {
      message.error(
        error?.data?.message ?? MESSAGE_NOTIFICATION.GET_GENERAL_INQUIRY_DESIGN_FIRM_ERROR,
      );
      return {} as GeneralInquiryDesignFirm;
    });
}

export async function getInquiryMessageForGeneralInquiry() {
  return request<InquiryMessageOfGeneralInquiry>(`/api/general-inquiry/inquiry-message`, {
    method: 'GET',
  })
    .then((res) => res)
    .catch((error) => {
      message.error(
        error?.data?.message ?? MESSAGE_NOTIFICATION.GET_GENERAL_INQUIRY_INQUIRY_MESSAGE_ERROR,
      );
      return {} as InquiryMessageOfGeneralInquiry;
    });
}

export async function getInquiryMessageActionTask() {
  return request<GeneralData[]>(`/api/general-inquiry/action-task`, {
    method: 'GET',
  })
    .then((res) => res)
    .catch((error) => {
      message.error(
        error?.data?.message ?? MESSAGE_NOTIFICATION.GET_GENERAL_INQUIRY_INQUIRY_MESSAGE_ERROR,
      );
      return [] as GeneralData[];
    });
}
