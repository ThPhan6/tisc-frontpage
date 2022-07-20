import { message } from 'antd';
import { MESSAGE_NOTIFICATION } from '@/constants/message';
import type { PermissionData } from '@/types';
import { request } from 'umi';

export async function getPermission() {
  return request<{ data: PermissionData[] }>('/api/permission/get-list', {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error.data.message ?? MESSAGE_NOTIFICATION.GET_PERMISSION_DATA_ERROR);
      return [] as PermissionData[];
    });
}

export async function updatePermission(permissionId: string) {
  return request(`/api/permission/open-close/${permissionId}`, {
    method: 'PUT',
  })
    .then(() => {
      return true;
    })
    .catch((error) => {
      message.error(error.data.message ?? MESSAGE_NOTIFICATION.UPDATE_PERMISSION_DATA_ERROR);
      return false;
    });
}
