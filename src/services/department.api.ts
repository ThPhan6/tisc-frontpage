import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { IDepartmentForm } from '@/types';
import { message } from 'antd';
import { request } from 'umi';

export async function getDepartmentList() {
  return request<{ data: IDepartmentForm[] }>(`/api/department/get-list`, { method: 'GET' })
    .then((response) => response.data)
    .catch((error) => {
      message.error(error.data || MESSAGE_NOTIFICATION.GET_LIST_DEPARTMENT_ERROR);
      return [] as IDepartmentForm[];
    });
}
