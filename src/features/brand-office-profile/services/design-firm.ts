import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import { LogoOfficeProfile, UpdateOfficeProfileRequestBody } from '../types';

export async function updateOfficeProfile(data: UpdateOfficeProfileRequestBody) {
  return request<boolean>(`/api/design-firm/update-profile`, { method: 'PUT', data })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_PROFILE_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_PROFILE_ERROR);
      return false;
    });
}

export async function updateLogoOfficeProfile(data: LogoOfficeProfile) {
  return request<boolean>(`/api/design-firm/update-logo`, { method: 'PUT', data })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_LOGO_PROFILE_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_LOGO_PROFILE_ERROR);
      return false;
    });
}
