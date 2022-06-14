import { request } from 'umi';
import { message } from 'antd';
import type { ICategoryListResponse } from '../types';
import type { IDataTableResponse } from '@/components/Table/index';

interface ICategoryPaginationResponse {
  data: {
    categories: ICategoryListResponse[];
    category_count: number;
    main_category_count: number;
    sub_category_count: number;
  };
}
export async function getBrandPagination(
  params: any,
  callback: (data: IDataTableResponse) => void,
) {
  request(`/api/category/get-list`, {
    method: 'GET',
    params,
  })
    .then((response: ICategoryPaginationResponse) => {
      callback({
        data: response.data.categories,
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
