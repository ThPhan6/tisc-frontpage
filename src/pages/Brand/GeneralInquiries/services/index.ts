import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { COMMON_TYPES } from '@/constants/util';
import { message } from 'antd';
import { request } from 'umi';

import {
  ActionTaskProps,
  ActionTaskRequestBody,
  GeneralInquiryListProps,
  GeneralInquiryResponse,
  GeneralInquirySummaryData,
} from '../types';
import { ActionTaskModalParams } from '@/components/ActionTask/types';
import {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
} from '@/components/Table/types';
import store from '@/reducers';
import { setSummaryGeneralInquiry } from '@/reducers/summary';
import { GeneralData } from '@/types';

import { hidePageLoading } from '@/features/loading/loading';

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
      hidePageLoading();
    });
}

export async function getGeneralInquirySummary() {
  return request<GeneralInquirySummaryData>(`/api/general-inquiry/summary`, { method: 'GET' })
    .then((res) => store.dispatch(setSummaryGeneralInquiry(res)))
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

export async function getActionTaskList(params: ActionTaskModalParams) {
  return request<{ data: ActionTaskProps[] }>(`/api/action-task`, {
    method: 'GET',
    params,
  })
    .then((response) => response.data)
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_ACTION_TASK_LIST_ERROR);
      return [] as ActionTaskProps[];
    });
}

export async function createActionTask(data: ActionTaskRequestBody) {
  return request<boolean>(`/api/action-task`, { method: 'POST', data })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.CREATE_ACTION_TASK_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.CREATE_ACTION_TASK_ERROR);
      return false;
    });
}

export async function updateActionTaskStatus(actionTaskId: string, status: number) {
  return request<boolean>(`/api/action-task/${actionTaskId}`, {
    method: 'PATCH',
    data: { status },
  })
    .then(() => true)
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_ACTION_TASK_STATUS_ERROR);
      return false;
    });
}

export async function getActionTask() {
  return request<{ data: GeneralData[] }>(`/api/setting/common-type/${COMMON_TYPES.ACTION_TASK}`, {
    method: 'GET',
  })
    .then((res) => res.data)
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_ACTION_TASK_DATA_ERROR);
      return [] as GeneralData[];
    });
}
