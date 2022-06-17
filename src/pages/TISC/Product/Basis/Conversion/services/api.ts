import { request } from 'umi';
import { message } from 'antd';
import type { ConversionBodyProp, IBasisConversionListResponse } from '../types';
import type {
  IDataTableResponse,
  IPaginationRequest,
  IPaginationResponse,
  ISummaryResponse,
} from '@/components/Table/types';
import { STATUS_RESPONSE } from '@/constants/util';
import { MESSAGE_NOTIFICATION } from '@/constants/message';

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

export async function createConversionMiddleware(
  data: ConversionBodyProp,
  callback: (type: STATUS_RESPONSE, message?: string) => void,
) {
  request(`/api/basis-conversion/create`, {
    method: 'POST',
    data,
  })
    .then(() => {
      callback(STATUS_RESPONSE.SUCCESS);
    })
    .catch((error) => {
      callback(
        STATUS_RESPONSE.ERROR,
        error?.data?.message || MESSAGE_NOTIFICATION.CREATE_CONVERSION_ERROR,
      );
    });
}

export async function deleteConversionMiddleware(id: string, callback: () => void) {
  request(`/api/basis-conversion/delete/${id}`, {
    method: 'DELETE',
  })
    .then(() => {
      callback();
    })
    .catch((error) => {
      message.error(error?.data?.message || MESSAGE_NOTIFICATION.DELETE_CONVERSION_ERROR);
    });
}
