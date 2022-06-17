import { request } from 'umi';
import { message } from 'antd';
import type { IAttributeListResponse } from '../types';
import type {
  IDataTableResponse,
  IPaginationRequest,
  IPaginationResponse,
  ISummaryResponse,
} from '@/components/Table/types';

interface ICategoryPaginationResponse {
  data: {
    attributes: IAttributeListResponse[];
    pagination: IPaginationResponse;
    summary: ISummaryResponse[];
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
      const { attributes, pagination, summary } = response.data;
      callback({
        data: attributes,
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
