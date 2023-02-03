import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import type {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
  SummaryResponse,
} from '@/components/Table/types';
import type { BasisOptionForm, BasisOptionListResponse } from '@/types';

import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

interface CategoryPaginationResponse {
  data: {
    basis_options: BasisOptionListResponse[];
    pagination: PaginationResponse;
    summary: SummaryResponse[];
  };
}
export async function getProductBasisOptionPagination(
  params: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
) {
  request(`/api/basis-option/get-list`, {
    method: 'GET',
    params,
  })
    .then((response: CategoryPaginationResponse) => {
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
      hidePageLoading();
    });
}

export async function createOptionMiddleWare(data: BasisOptionForm) {
  showPageLoading();
  return request<boolean>(`/api/basis-option/create`, {
    method: 'POST',
    data,
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.CREATE_OPTION_SUCCESS);
      hidePageLoading();
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message || MESSAGE_NOTIFICATION.CREATE_OPTION_ERROR);
      hidePageLoading();
      return false;
    });
}
export async function getOneBasisOption(id: string) {
  showPageLoading();
  return request<{ data: BasisOptionForm }>(`/api/basis-option/get-one/${id}`, {
    method: 'GET',
  })
    .then((response) => {
      hidePageLoading();
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
      hidePageLoading();
      console.log(error);
      message.error(error?.data?.message || MESSAGE_NOTIFICATION.GET_ONE_OPTION_ERROR);
    });
}

export async function updateBasisOption(id: string, data: BasisOptionForm) {
  showPageLoading();
  return request<boolean>(`/api/basis-option/update/${id}`, {
    method: 'PUT',
    data,
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_OPTION_SUCCESS);
      hidePageLoading();
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message || MESSAGE_NOTIFICATION.UPDATE_OPTION_SUCCESS);
      hidePageLoading();
      return false;
    });
}

export async function deleteBasisOption(id: string) {
  showPageLoading();
  return request<boolean>(`/api/basis-option/delete/${id}`, {
    method: 'DELETE',
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.DELETE_OPTION_SUCCESS);
      hidePageLoading();
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message || MESSAGE_NOTIFICATION.DELETE_OPTION_ERROR);
      hidePageLoading();
      return false;
    });
}
