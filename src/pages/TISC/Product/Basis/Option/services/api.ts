import { STATUS_RESPONSE } from '@/constants/util';
import { request } from 'umi';
import { message } from 'antd';
import type { IBasisOptionForm, IBasisOptionListResponse } from '../types';
import type {
  IDataTableResponse,
  IPaginationRequest,
  IPaginationResponse,
  ISummaryResponse,
} from '@/components/Table/types';
import { MESSAGE_NOTIFICATION } from '@/constants/message';

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

export async function createOptionMiddleWare(
  data: IBasisOptionForm,
  callback: (type: STATUS_RESPONSE, message?: string) => void,
) {
  request(`/api/basis-option/create`, {
    method: 'POST',
    data,
  })
    .then(() => {
      callback(STATUS_RESPONSE.SUCCESS);
    })
    .catch((error) => {
      callback(
        STATUS_RESPONSE.ERROR,
        error?.data?.message || MESSAGE_NOTIFICATION.CREATE_OPTION_ERROR,
      );
    });
}
