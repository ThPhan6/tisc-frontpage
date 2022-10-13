import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { COMMON_TYPES } from '@/constants/util';
import { message } from 'antd';
import { request } from 'umi';

import {
  GeneralInquiryListProps,
  GeneralInquiryResponse,
  GeneralInquirySummaryData,
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
    general_inquiries: GeneralInquiryListProps[];
    pagination: PaginationResponse;
  };
}

export async function getGeneralInquiryPagination(
  params: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
) {
  request(`/api/general-inquiry`, {
    method: 'GET',
    params,
  })
    .then((response: GeneralInquiryPaginationResponse) => {
      const { general_inquiries, pagination } = response.data;
      console.log(general_inquiries);

      callback({
        data: general_inquiries,
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
    params: {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 99999999,
    },
  })
    .then((response: ActionTaskPaginationResponse) => {
      callback({
        data: response.data ?? {
          generalInquiries: [] as InquiryMessageTask[],
          pagination: { page: 1, pageSize: 9999999 },
        },
      });
    })
    .catch((error) => {
      message.error(
        error?.data?.message ?? MESSAGE_NOTIFICATION.GET_INQUIRY_MESSAGE_ACTION_TASK_ERROR,
      );
    });
}

export async function getGeneralInquirySummary() {
  return request<GeneralInquirySummaryData>(`/api/general-inquiry/summary`, { method: 'GET' })
    .then((res) => res)
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_GENERAL_INQUIRY_SUMMARY_ERROR);
      return {} as GeneralInquirySummaryData;
    });
}

export async function getOneGeneralInquiry(designFirmId: string) {
  return request<{
    data: GeneralInquiryResponse;
  }>(`/api/general-inquiry/${designFirmId}`, {
    method: 'GET',
  })
    .then((res) => res.data)
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_GENERAL_INQUIRY_LIST_FAILED);
      return {} as GeneralInquiryResponse;
    });
}

export async function getActionTask() {
  return request<{ data: GeneralData[] }>(`/api/setting/common-type/${COMMON_TYPES.ACTION_TASK}`, {
    method: 'GET',
  })
    .then((res) => res.data)
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_ACTION_TASK_LIST_ERROR);
      return [] as GeneralData[];
    });
}
