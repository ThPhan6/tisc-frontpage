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
      message.error(error.data?.message ?? MESSAGE_NOTIFICATION.GETLIST_OPTION_ERROR);
    });
}

export async function createOptionMiddleWare(data: IBasisOptionForm) {
  return request<boolean>(`/api/basis-option/create`, {
    method: 'POST',
    data,
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.CREATE_OPTION_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message || MESSAGE_NOTIFICATION.CREATE_OPTION_ERROR);
      return false;
    });
}
export async function getOneBasisOption(id: string) {
  return request<{ data: IBasisOptionForm }>(`/api/basis-option/get-one/${id}`, {
    method: 'GET',
  })
    .then((response) => {
      const newSubs = response.data.subs.map((subOption) => {
        const isUsingImage = subOption.subs.find((optionItem) => {
          return optionItem.image !== null;
        });
        return {
          ...subOption,
          is_have_image: isUsingImage ? true : false,
        };
      });
      return {
        ...response.data,
        subs: newSubs,
      };
    })
    .catch((error) => {
      console.log(error);
      message.error(error?.data?.message || MESSAGE_NOTIFICATION.GET_ONE_OPTION_ERROR);
    });
}

export async function updateBasisOption(id: string, data: IBasisOptionForm) {
  return request<boolean>(`/api/basis-option/update/${id}`, {
    method: 'PUT',
    data,
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_OPTION_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message || MESSAGE_NOTIFICATION.UPDATE_OPTION_SUCCESS);
      return false;
    });
}

export async function deleteBasisOption(id: string) {
  return request<boolean>(`/api/basis-option/delete/${id}`, {
    method: 'DELETE',
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.DELETE_OPTION_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message || MESSAGE_NOTIFICATION.DELETE_OPTION_ERROR);
      return false;
    });
}
