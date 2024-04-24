import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { DEFAULT_MAIN_OPTION_ID } from '@/pages/TISC/Product/Basis/Option/components/constant';
import { message } from 'antd';
import { request } from 'umi';

import { flatMap } from 'lodash';

import type {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
  SummaryResponse,
} from '@/components/Table/types';
import store from '@/reducers';
import type {
  BasisOptionForm,
  BasisOptionListResponse,
  BasisOptionListResponseForTable,
  ConnectionListResponse,
  LinkageUpsertBody,
  MainBasisOptionSubForm,
} from '@/types';

import { LinkedOption } from './../pages/TISC/Product/Basis/Option/store';

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

export async function getProductBasisOptionPaginationForTable(
  params: PaginationRequestParams,
  callback: (data: DataTableResponse<BasisOptionListResponseForTable[]>) => void,
) {
  request(`/api/basis-option/get-list`, {
    method: 'GET',
    params,
  })
    .then((response: CategoryPaginationResponse) => {
      const { basis_options, pagination, summary } = response.data;
      callback({
        data: flatMap(
          basis_options.map((grp) =>
            grp.subs.map((sub) => ({
              ...sub,
              group_id: grp.id,
              group_name: grp.name,
              group_count: grp.count,
              master: !!grp?.master,
            })),
          ),
        ),
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

      const newData = response.data.subs.map((subOption) => {
        const isUsingImage = subOption.subs.find((optionItem) => {
          return optionItem.image !== null;
        });

        return {
          ...subOption,
          is_have_image: isUsingImage ? true : false,
        };
      });

      const newSubs = newData.map((el) => {
        /// change default main option
        if (el.id === DEFAULT_MAIN_OPTION_ID) {
          return {
            ...el,
            id: `new-${DEFAULT_MAIN_OPTION_ID}`,
          };
        }
        return el;
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

export async function updateBasisOption(
  id: string,
  data: BasisOptionForm,
  type: 'create' | 'update' | 'delete' = 'update',
) {
  showPageLoading();
  return request<{ data: MainBasisOptionSubForm }>(`/api/basis-option/update/${id}`, {
    method: 'PUT',
    data,
  })
    .then((res) => {
      message.success(
        type === 'update'
          ? MESSAGE_NOTIFICATION.UPDATE_OPTION_SUCCESS
          : type === 'create'
          ? MESSAGE_NOTIFICATION.CREATE_OPTION_SUCCESS
          : type === 'delete'
          ? MESSAGE_NOTIFICATION.DELETE_OPTION_SUCCESS
          : 'Successfully',
      );
      hidePageLoading();
      return res.data;
    })
    .catch((error) => {
      message.error(
        error?.data?.message || type === 'update'
          ? MESSAGE_NOTIFICATION.UPDATE_OPTION_ERROR
            ? type === 'create'
            : MESSAGE_NOTIFICATION.CREATE_OPTION_ERROR
          : type === 'delete'
          ? MESSAGE_NOTIFICATION.DELETE_OPTION_ERROR
          : 'Error',
      );
      hidePageLoading();
      return {} as MainBasisOptionSubForm;
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

// Linkage option API

export async function getLinkageConnection(option_id: string) {
  showPageLoading();

  return request<{ data: ConnectionListResponse[] }>(`/api/linkage/option/${option_id}`, {
    method: 'GET',
  })
    .then((res) => {
      hidePageLoading();

      return res.data.map((el) => ({
        isPair: el.is_pair,
        pairId: el.to,
        productId: el.to_product_id,
      })) as LinkedOption[];
    })
    .catch((error) => {
      hidePageLoading();
      message.error(error?.data?.message || MESSAGE_NOTIFICATION.GET_LINKAGE_OPTION_ERROR);
      return [] as LinkedOption[];
    });
}

export async function upsertLinkageOption() {
  const { rootSubItemId, connectionList } = store.getState().linkage;
  if (!rootSubItemId || !connectionList.length) {
    message.error('Please select options');
    return;
  }

  showPageLoading();

  const data: LinkageUpsertBody[] = connectionList.map((el) => ({
    pair: `${rootSubItemId},${el.pairId}`,
    is_pair: el.isPair,
  }));

  request<{ data: ConnectionListResponse[] }>(`/api/linkage/upsert`, {
    method: 'POST',
    data: { data },
  })
    .then(() => {
      hidePageLoading();
      message.success(MESSAGE_NOTIFICATION.CREATE_LINKAGE_OPTION_SUCCESS);

      // return res.data;
    })
    .catch((error) => {
      hidePageLoading();
      message.error(error?.data?.message || MESSAGE_NOTIFICATION.CREATE_LINKAGE_OPTION_ERROR);
      // return [] as LinkageUpsertBody[];
    });
}
