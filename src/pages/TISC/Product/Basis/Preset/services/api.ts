import { request } from 'umi';
import { message } from 'antd';
import type { IBasisPresetListResponse } from '../types';
import type {
  IDataTableResponse,
  IPaginationRequest,
  IPaginationResponse,
  ISummaryResponse,
} from '@/components/Table/types';

interface ICategoryPaginationResponse {
  data: {
    basis_presets: IBasisPresetListResponse[];
    pagination: IPaginationResponse;
    summary: ISummaryResponse[];
  };
}
export async function getProductBasisPresetPagination(
  params: IPaginationRequest,
  callback: (data: IDataTableResponse) => void,
) {
  request(`/api/basis-preset/get-list`, {
    method: 'GET',
    params,
  })
    .then((response: ICategoryPaginationResponse) => {
      const { basis_presets, pagination, summary } = response.data;
      callback({
        data: basis_presets,
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
