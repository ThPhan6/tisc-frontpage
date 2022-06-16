import { request } from 'umi';
import { message } from 'antd';
import type { IBasisConversionListResponse } from '../types';
import type {
  IDataTableResponse,
  IPaginationRequest,
  IPaginationResponse,
  ISummaryResponse,
} from '@/components/Table/types';

interface ICategoryPaginationResponse {
  data: {
    basis_conversions: IBasisConversionListResponse[];
    pagination: IPaginationResponse;
    summary: ISummaryResponse[];
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
      const { basis_conversions, pagination, summary } = response.data;
      callback({
        data: basis_conversions,
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
