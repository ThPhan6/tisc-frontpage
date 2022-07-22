import type {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
} from '@/components/Table/types';
import { DesignFirm } from '@/types';
import { message } from 'antd';
import { request } from 'umi';

interface DesignFirmListResponse {
  designers: DesignFirm;
  pagination: PaginationResponse;
}

export async function getDesignFirmPagination(
  params: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
) {
  request(`/api/design/get-list`, {
    method: 'GET',
    params,
  })
    .then((response: { data: DesignFirmListResponse }) => {
      const { designers, pagination } = response.data;
      callback({
        data: designers,
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
