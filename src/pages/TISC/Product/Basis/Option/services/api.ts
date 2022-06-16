import { request } from 'umi';
import { message } from 'antd';
import type { IBasisOptionListResponse } from '../types';
import type {
  IDataTableResponse,
  IPaginationRequest,
  IPaginationResponse,
  ISummaryResponse,
} from '@/components/Table/types';

interface ICategoryPaginationResponse {
  data: {
    basis_options: IBasisOptionListResponse[];
    pagination: IPaginationResponse;
    summary: ISummaryResponse[];
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
      const { basis_options, pagination, summary } = response.data;
      callback({
        data: basis_options,
        pagination: {
          current: pagination.page,
          pageSize: pagination.page_size,
          total: pagination.total,
        },
        summary,
      });
    })
    .catch((error) => {
      console.log('error', error);
      message.error(error.message);
    });
}
