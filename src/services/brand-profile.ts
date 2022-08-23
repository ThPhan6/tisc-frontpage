import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import {
  LogoBrandProfile,
  UpdateBrandProfileRequestBody,
} from '@/pages/Brand/Adminstration/BrandProfile/types';

export async function updateBrandProfile(data: UpdateBrandProfileRequestBody) {
  return request<boolean>(`/api/brand/update-profile`, { method: 'PUT', data })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_BRAND_PROFILE_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_BRAND_PROFILE_ERROR);
      return false;
    });
}

export async function updateLogoBrandProfile(data: LogoBrandProfile) {
  return request<boolean>(`/api/brand/update-logo`, { method: 'PUT', data })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_LOGO_BRAND_PROFILE_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_LOGO_BRAND_PROFILE_ERROR);
      return false;
    });
}

export async function updateBrandStatus(brandId: string, data: { status: number }) {
  return request<boolean>(`/api/brand/update-status/${brandId}`, { method: 'PUT', data })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_BRAND_STATUS_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_BRAND_STATUS_ERROR);
      return false;
    });
}
