import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
  SummaryResponse,
} from '@/components/Table/types';
import { Quotation } from '@/types';

import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

interface QuotationPaginationResponse {
  data: {
    quotations: Quotation[];
    pagination: PaginationResponse;
    summary: SummaryResponse[];
  };
}

export async function getQuotationPagination(
  params: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
) {
  request(`/api/quotation/get-list`, {
    method: 'GET',
    params,
  })
    .then((response: QuotationPaginationResponse) => {
      const { quotations, pagination, summary } = response.data;
      callback({
        data: quotations,
        pagination: {
          current: pagination.page,
          pageSize: pagination.page_size,
          total: pagination.total,
        },
        summary: summary,
      });
    })
    .catch((error) => {
      hidePageLoading();
      message.error(
        error.data?.message ?? MESSAGE_NOTIFICATION.GET_LIST_INSPIRATIONAL_QUOTES_ERROR,
      );
    });
}

export async function getOneQuotation(id: string) {
  return request<{ data: Quotation }>(`/api/quotation/get-one/${id}`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error.data?.message ?? MESSAGE_NOTIFICATION.GET_ONE_INSPIRATIONAL_QUOTES_ERROR);
      return {} as Quotation;
    });
}

export async function createQuotation(data: Quotation) {
  showPageLoading();
  return request<boolean>(`/api/quotation/create`, { method: 'POST', data })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.CREATE_INSPIRATIONAL_QUOTES_SUCCESS);
      hidePageLoading();
      return true;
    })
    .catch((error) => {
      message.error(error.data?.message ?? MESSAGE_NOTIFICATION.CREATE_INSPIRATIONAL_QUOTES_ERROR);
      hidePageLoading();
      return false;
    });
}

export async function updateQuotation(id: string, data: Quotation) {
  showPageLoading();
  return request<boolean>(`/api/quotation/update/${id}`, { method: 'PUT', data })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_INSPIRATIONAL_QUOTES_SUCCESS);
      hidePageLoading();
      return true;
    })
    .catch((error) => {
      message.error(error.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_INSPIRATIONAL_QUOTES_ERROR);
      hidePageLoading();
      return false;
    });
}

export async function deleteQuotation(id: string) {
  return request<boolean>(`/api/quotation/delete/${id}`, { method: 'DELETE' })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.DELETE_INSPIRATIONAL_QUOTES_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error.data?.message ?? MESSAGE_NOTIFICATION.DELETE_INSPIRATIONAL_QUOTES_ERROR);
      return false;
    });
}
