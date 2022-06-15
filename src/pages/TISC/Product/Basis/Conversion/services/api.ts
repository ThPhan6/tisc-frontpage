import { request } from 'umi';
import { message } from 'antd';
import type { IBasisConversionListResponse } from '../types';
import type { IDataTableResponse, IPaginationRequest } from '@/components/Table/types';

interface ICategoryPaginationResponse {
  data: {
    basis_conversions: IBasisConversionListResponse[];
  };
}
export async function getProductBasisConversionPagination(
  params: IPaginationRequest,
  callback: (data: IDataTableResponse) => void,
) {
  request(`/api/basis-conversion/get-list`, {
    method: 'GET',
    params,
  })
    .then((response: ICategoryPaginationResponse) => {
      callback({
        data: response.data.basis_conversions,
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
