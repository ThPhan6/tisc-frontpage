import { request } from 'umi';
import { message } from 'antd';
import type { IBasisPresetListResponse, PresetsValueProp } from '@/types';
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

export async function createPresetMiddleware(
  data: PresetsValueProp,
  callback: (type: STATUS_RESPONSE, message?: string) => void,
) {
  request(`/api/basis-preset/create`, {
    method: 'POST',
    data,
  })
    .then(() => {
      callback(STATUS_RESPONSE.SUCCESS);
    })
    .catch((error) => {
      callback(
        STATUS_RESPONSE.ERROR,
        error?.data?.message || MESSAGE_NOTIFICATION.CREATE_PRESET_ERROR,
      );
    });
}

export async function deletePresetMiddleware(id: string, callback: () => void) {
  request(`/api/basis-preset/delete/${id}`, { method: 'DELETE' })
    .then(() => {
      callback();
    })
    .catch((error) => {
      message.error(error?.data?.message || MESSAGE_NOTIFICATION.DELETE_PRESET_ERROR);
    });
}

export async function updatePresetMiddleware(
  id: string,
  data: PresetsValueProp,
  callback: (type: STATUS_RESPONSE, message?: string) => void,
) {
  request(`/api/basis-preset/update/${id}`, { method: 'PUT', data })
    .then(() => {
      callback(STATUS_RESPONSE.SUCCESS);
    })
    .catch((error) => {
      callback(
        STATUS_RESPONSE.ERROR,
        error?.data?.message || MESSAGE_NOTIFICATION.UPDATE_PRESET_ERROR,
      );
    });
}

export async function getOnePresetMiddleware(
  id: string,
  callbackSuccess: (dataRes: PresetsValueProp) => void,
  callbackError: (message?: string) => void,
) {
  request(`/api/basis-preset/get-one/${id}`, { method: 'GET' })
    .then((response: { data: PresetsValueProp }) => {
      callbackSuccess(response?.data);
    })
    .catch((error) => {
      callbackError(error?.data?.message || MESSAGE_NOTIFICATION.GET_ONE_PRESET_ERROR);
    });
}
