import { request } from 'umi';
import { message } from 'antd';
import type { IAttributeListResponse } from '../types';
import type { IDataTableResponse, IPaginationRequest } from '@/components/Table/types';

interface ICategoryPaginationResponse {
  data: {
    attributes: IAttributeListResponse[];
  };
}
export async function getProductAttributePagination(
  params: IPaginationRequest,
  callback: (data: IDataTableResponse) => void,
) {
  request(`/api/attribute/get-list`, {
    method: 'GET',
    params,
  })
    .then((response: ICategoryPaginationResponse) => {
      callback({
        data: response.data.attributes,
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
