import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { COMMON_TYPES } from '@/constants/util';
import { message } from 'antd';
import { request } from 'umi';

import { GeneralData } from '@/types';
import { DesignFirmProfile } from '@/types/user.type';

export async function updateDesignFirmOfficeProfile(
  designFirmId: string,
  data: Partial<DesignFirmProfile>,
) {
  return request<boolean>(`/api/design/office-profile/${designFirmId}`, {
    method: 'PATCH',
    data: data,
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_PROFILE_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_PROFILE_ERROR);
      return false;
    });
}

export async function getListCapabilities() {
  return request<{ data: GeneralData[] }>(`/api/setting/common-type/${COMMON_TYPES.CAPABILITIES}`, {
    method: 'GET',
  })
    .then((res) => {
      return res.data;
    })
    .catch(() => {
      return [] as GeneralData[];
    });
}
