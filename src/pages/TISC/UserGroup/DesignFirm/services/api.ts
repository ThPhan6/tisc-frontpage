import { request } from 'umi';
import { message } from 'antd';
import type { IDesignFirmListResponse } from '../types';
import type { IDataTableResponse } from '@/components/Table/index';

export async function getDesignFirmPagination(
  params: any,
  callback: (data: IDataTableResponse) => void,
) {
  request(`/api/design/get-list`, {
    method: 'GET',
    params,
  })
    .then((response: IDesignFirmListResponse) => {
      callback({
        data: response.data,
        pagination: {
          current: params.page,
          pageSize: params.pageSize,
          total: 10,
        },
      });
    })
    .catch((error) => {
      console.log('error', error);
      message.error(error.message);
    });
}
