import { request } from 'umi';
import { message } from 'antd';
import type { IBrand } from '../types';
import type {
  IDataTableResponse,
  IPaginationRequest,
  IPaginationResponse,
} from '@/components/Table/types';

interface IBrandListResponse {
  brands: IBrand;
  pagination: IPaginationResponse;
}

export async function getBrandPagination(
  params: IPaginationRequest,
  callback: (data: IDataTableResponse) => void,
) {
  request(`/api/brand/get-list`, {
    method: 'GET',
    params,
  })
    .then((response: { data: IBrandListResponse }) => {
      const { brands, pagination } = response.data;
      callback({
        data: brands,
        pagination: {
          current: pagination.page,
          pageSize: pagination.page_size,
          total: pagination.total,
        },
      });
    })
    .catch((error) => {
      console.log('error', error);
      message.error(error.message);
    });
}
