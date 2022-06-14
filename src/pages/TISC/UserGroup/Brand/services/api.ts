import { request } from 'umi';
import { message } from 'antd';
import type { IBrandListResponse } from '../types';
import type { IDataTableResponse } from '@/components/Table/index';

export async function getBrandPagination(
  params: any,
  callback: (data: IDataTableResponse) => void,
) {
  request(`/api/brand/get-list`, {
    method: 'GET',
    params,
  })
    .then((response: { data: IBrandListResponse }) => {
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
