import { request } from 'umi';
import { message } from 'antd';
import type { IBasisPresetListResponse } from '../types';
import type { IDataTableResponse, IPaginationRequest } from '@/components/Table/types';

interface ICategoryPaginationResponse {
  data: {
    basis_presets: IBasisPresetListResponse[];
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
      callback({
        data: response.data.basis_presets,
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
