import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { COMMON_TYPES } from '@/constants/util';
import { message } from 'antd';
import { request } from 'umi';

import { DepartmentData } from '@/types';

export async function getDepartmentList() {
  return request<{ data: DepartmentData[] }>(
    `/api/setting/common-type/${COMMON_TYPES.TEAM_DEPARTMENT}`,
  )
    .then((response) => response.data)
    .catch((error) => {
      message.error(error.data || MESSAGE_NOTIFICATION.GET_LIST_DEPARTMENT_ERROR);
      return [] as DepartmentData[];
    });
}
