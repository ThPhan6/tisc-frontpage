import { message } from 'antd';
import { MESSAGE_NOTIFICATION } from '@/constants/message';
import type { AccessLevelModalProps } from '@/components/TISCModal/types';
import { request } from 'umi';

export async function getPermission() {
  return request<{ data: AccessLevelModalProps[] }>('/api/permission/get-list', {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error.data.message ?? MESSAGE_NOTIFICATION.GET_PERMISSION_DATA_ERROR);
      return [] as AccessLevelModalProps[];
    });
}
