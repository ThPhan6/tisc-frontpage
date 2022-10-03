import { message } from 'antd';
import { request } from 'umi';

import { MaterialProductCodeMain } from './type';
import {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
  SummaryResponse,
} from '@/components/Table/types';

interface MaterialProductCodePaginationResponse {
  data: {
    material_product_code: MaterialProductCodeMain[];
    pagination: PaginationResponse;
    summary: SummaryResponse[];
  };
}
export async function getMaterialProductCodeList(
  params: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
  design_id: string,
) {
  request(`/api/material-code/get-list-group/${design_id}`, {
    method: 'GET',
    params,
  })
    .then((response: MaterialProductCodePaginationResponse) => {
      const { material_product_code, pagination, summary } = response.data;
      callback({
        data: material_product_code,
        pagination: {
          current: pagination.page,
          pageSize: pagination.page_size,
          total: pagination.total,
        },
        summary,
      });
    })
    .catch((error) => {
      message.error(error.message);
    });
}
