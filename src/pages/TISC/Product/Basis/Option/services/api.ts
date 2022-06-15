import { request } from 'umi';
import { message } from 'antd';
import type { IBasisOptionListResponse } from '../types';
import type { IDataTableResponse, IPaginationRequest } from '@/components/Table/types';

interface ICategoryPaginationResponse {
  data: {
    basis_options: IBasisOptionListResponse[];
  };
}
export async function getProductBasisOptionPagination(
  params: IPaginationRequest,
  callback: (data: IDataTableResponse) => void,
) {
  request(`/api/basis-option/get-list`, {
    method: 'GET',
    params,
  })
    .then((response: ICategoryPaginationResponse) => {
      callback({
        data: response.data.basis_options,
        pagination: {
          current: params.page,
          pageSize: params.pageSize,
        },
      });
    })
    .catch((error) => {
      console.log('error', error);
      message.error(error.message);
    });
}
