import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { COMMON_TYPES } from '@/constants/util';
import { message } from 'antd';
import { request } from 'umi';

import { GeneralInquiryForm, ProjectRequestForm } from '../../product/types';
import { GeneralData } from '@/types';

/// INQUIRY/REQUEST
export async function getInquiryRequestFor() {
  return request<{ data: GeneralData[] }>(`/api/setting/common-type/${COMMON_TYPES.REQUEST_FOR}`, {
    method: 'GET',
  })
    .then((res) => res.data)
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_INQUIRY_REQUEST_FOR_ERROR);
      return [] as GeneralData[];
    });
}

export async function createGeneralInquiry(data: GeneralInquiryForm) {
  return request<boolean>(`/api/general-inquiry`, { method: 'POST', data })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.CREATE_GENERAL_INQUIRY_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.CREATE_GENERAL_INQUIRY_ERROR);
      return false;
    });
}

export async function createProjectRequest(data: ProjectRequestForm) {
  return request<boolean>(`/api/project-tracking/request/create`, { method: 'POST', data })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.CREATE_PROJECT_REQUEST_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.CREATE_PROJECT_REQUEST_ERROR);
      return false;
    });
}
