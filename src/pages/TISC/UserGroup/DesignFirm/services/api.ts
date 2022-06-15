import { request } from 'umi';
import { message } from 'antd';
import type { IDesignFirm } from '../types';
import type {
  IDataTableResponse,
  IPaginationRequest,
  IPaginationResponse,
} from '@/components/Table/types';

interface IDesignFirmListResponse {
  designers: IDesignFirm;
  pagination: IPaginationResponse;
}

export async function getDesignFirmPagination(
  params: IPaginationRequest,
  callback: (data: IDataTableResponse) => void,
) {
  request(`/api/design/get-list`, {
    method: 'GET',
    params,
  })
    .then((response: { data: IDesignFirmListResponse }) => {
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
